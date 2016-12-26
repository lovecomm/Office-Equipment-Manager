import Papa from 'papaparse' // http://papaparse.com/docs
import { ref, imagesRef } from 'config/constants'
import { determineItemHasSubContent } from 'helpers/utils'
import { saveNewPerson, saveNewHardware, saveNewItem } from 'helpers/api'

let storedPeople // used to know what's already in firebase, so that we don't create duplicates
let storedHardwares // used to know what's already in firebase, so that we don't create duplicates
let storedItems // used to know what's already in firebase, so that we don't create duplicates
let duplicates = [] // this is where items that were already found in firebase, and in the .csv upload file will be added... we will eventually display this list to the user so that they are aware of which items were already in the system
let headers // this will become an object with each of the column headers from the csv, with the value being their index in a row... that way if someone uploads a csv with columns in a different order, it bother us here
let data // just the data received from the CSV, unformatted
let newRows // this is created/structured data based on the 'data' variable. It is what we will use to store all our person/hardware/itemIds, and ultimately what we use to upload these things to firebase
let newPeople = {}
let newHardwares = {}
let newItems = {}
let uid

export default function handleFileImport (file, authedId) {
	uid = authedId
	return new Promise((resolve, reject) => {
		Papa.parse(file, {
			complete: (results) => {
				validateHeaders(results.data)
				.then(({initialData, generatedHeaders}) => {
					data = initialData
					headers = generatedHeaders
					return validateColumns()
				})
				.then(() => checkForDuplicateItems())
				.then(() => convertDataArrayToObject())
				.then(() => resolveImportedPeopleAndHardware())
				.then(() => resolveItems())
				.then(() => {
					ref.child('feed/people').update(newPeople)
					ref.child('feed/hardwares').update(newHardwares)
					ref.child('feed/items').update(newItems)
					resolve()
				})
				.catch((error) => {
					console.warn(error)
					reject(error)
				})
			},
			error: (err, file, inputElem, reason) => {
				reject('Error! There was a problem with the data in you CSV file. Please be sure it is formatted correctly and try again. If you continue to receive this error, contact the Interactive department.')
			}
		})
	})
}

function resolveItems () {
	return new Promise((resolve, reject) => {
		Object.keys(newRows).forEach((key) => {
			const row = newRows[key]
			const today = new Date()
			const purchasedDate = row.item.purchase_month && row.item.purchase_year ? new Date(row.item.purchase_year, row.item.purchase_month) : today
			const noteIsEmpty = row.item.notes === ''
			if (today === purchasedDate) {
				const message = ' ...This item was uploaded without a purchase date, so the date given is according to the day it was uploaded.'
				noteIsEmpty === true ? row.item.notes = message : row.item.notes += message
			}
			row.item = {
				serial: row.item.serial,
				itemId: ref.child('feed/items').push().key,
				personId: row.person.personId,
				hardwareId: row.hardware.hardwareId,
				purchasedDate: purchasedDate.toString(),
				dateCreated: new Date().toString(),
				dateLastUpdated: new Date().toString(),
				collapsed: true,
				note: row.item.notes === undefined ? '' : row.item.notes,
				createdBy: uid,
				photo: {
					name: '',
					fullPath: '',
					size: '',
					type: '',
					bucket: '',
					url: ''
				},
				hasSubContent: determineItemHasSubContent(row.item, row.hardware.description),
			}
			newItems[row.item.itemId] = row.item
		})
		resolve()
	})
}

// Start Misc Helper functions
function convertDataArrayToObject () {
	return new Promise((resolve) => {
		let rows = {}
		data.forEach((row) => {
			rows[row[headers.serial]] = {
				item: {
					serial: row[headers.serial],
					purchase_year: row[headers.purchase_year],
					purchase_month: row[headers.purchase_month],
					notes: row[headers.notes],
				},
				person: {
					firstName: row[headers.first_name],
					lastName: row[headers.last_name],
				},
				hardware: {
					make: row[headers.make],
					model: row[headers.model],
					description: row[headers.description],
					isComputer: row[headers.computer],
				}
			}
		})
		newRows = rows
		resolve(duplicates)
	})
}
// End Misc Helper functions

// Start Firebase API functions
function resolveImportedPeopleAndHardware () {
	return new Promise((resolve, reject) => {
		getStoredData('people')
		.then((stored_people) => {
			storedPeople = stored_people
			return getStoredData('hardwares')
		})
		.then((stored_hardwares) => {
			storedHardwares = stored_hardwares
			// need each row's person and hardwares to combine after
			let hardwareAndPersonPromises = []
			Object.keys(newRows).forEach((key) => {
				const row = newRows[key]
				hardwareAndPersonPromises.push(
					handlePersonExists(row),
					handleHardwaresExists(row)
				)
			})
			return Promise.all(hardwareAndPersonPromises).then(() => resolve())
			.catch((err) => console.error(err))
		})
		.catch((err) => reject(err))
	})
}

function handleHardwaresExists (row) { // checks if hardware exists, if does then adds hardwareId to row, if not creates the hardware and then adds hardwareId to row
	return new Promise((resolve, reject) => {
		checkIfHardwareExists(row)
		.then(({hardwareExists, storedHardwareId}) => {
			if (hardwareExists) {
				row.hardware.hardwareId = storedHardwareId
				resolve(row)
			} else {
				var hardwarePhotoRef = imagesRef.child('hardwares/default.jpg')
				row.hardware = {
					make: row.hardware.make,
					model: row.hardware.model,
					isComputer: row.hardware.isComputer,
					description: row.hardware.description,
					hardwareId: ref.child('feed/hardwares').push().key,
					photo: {
						name: hardwarePhotoRef.name,
						fullPath: hardwarePhotoRef.fullPath,
						size: 3.52,
						type: 'image/jpeg',
						bucket: hardwarePhotoRef.bucket,
						url: ''
					},
					collapsed: true,
					createdBy: uid,
					dateCreated: new Date().toString(),
					dateLastUpdated: new Date().toString()
				}
				storedHardwares = { // we want to append our new hardware to the storedHardware list, so that future items within the same import, who share this hardware, wont force the hardware to be created again.
					...storedHardwares,
					[row.hardware.hardwareId]: {
						make: row.hardware.make,
						model: row.hardware.model,
						hardwareId: row.hardware.id,
					}
				}
				newHardwares[row.hardware.hardwareId] = row.hardware
				resolve()
			}
		})
	})
}

function checkIfHardwareExists (row) {
	return new Promise((resolve, reject) => {
		let hardwareExists = false
		let storedHardwareId = ''
		if (storedHardwares) {
			Object.keys(storedHardwares).forEach((key) => {
				const storedHardware = storedHardwares[key]
				if (storedHardware.make.toLowerCase() === row.hardware.make.toLowerCase() && storedHardware.model.toLowerCase() === row.hardware.model.toLowerCase()) {
					hardwareExists = true
					storedHardwareId = storedHardware.hardwareId
				}
			})
		}
		resolve ({hardwareExists, storedHardwareId})
	})
}

function handlePersonExists (row) { // checks if person exists, if does then adds personId to row, if not creates the person and then adds personId to row
	return new Promise((resolve, reject) => {
		checkIfPersonExists(row)
		.then(({personExists, storedPersonId}) => {
			if (personExists) {
				row.person.personId = storedPersonId
				resolve(row)
			} else {
				var personPhotoRef = imagesRef.child('people/default.jpg')
				row.person = {
					firstName: row.person.firstName,
					lastName: row.person.lastName,
					personId: ref.child('feed/people').push().key,
					photo: {
						name: personPhotoRef.name,
						fullPath: personPhotoRef.fullPath,
						size: 4.48,
						type: 'image/jpeg',
						bucket: personPhotoRef.bucket,
						url: ''
					},
					dateCreated: new Date().toString(),
					createdBy: uid,
					dateLastUpdated: new Date().toString(),
					collapsed: true
				}
				storedPeople = { // we want to append our new person to the storedPeople list, so that future items within the same import, who share this person, wont force the person to be created again.
					...storedPeople,
					[row.person.personId]: {
						firstName: row.person.firstName,
						lastName: row.person.lastName,
						personId: row.person.personId,
					}
				}
				newPeople[row.person.personId] = row.person
				resolve()
			}
		})
	})
}

function checkIfPersonExists (row) {
	return new Promise((resolve, reject) => {
		let personExists = false
		let storedPersonId = ''
		if (storedPeople) {
			Object.keys(storedPeople).forEach((key) => {
				const storedPerson = storedPeople[key]
				if (storedPerson.firstName.toLowerCase() === row.person.firstName.toLowerCase() && storedPerson.lastName.toLowerCase() === row.person.lastName.toLowerCase()) {
					personExists = true
					storedPersonId = storedPerson.personId
				}
			})
		}
		resolve ({personExists, storedPersonId})
	})
}

function checkForDuplicateItems () {
	return new Promise((resolve, reject) => {
		getStoredData('items')
		.then((items) => {
			storedItems = items
			data.forEach((row) => {
				const serial = row[headers.serial]
				checkIfDuplicateItem(serial)
				.then((duplicate) => {
					if (duplicate) {
						data.splice(data.indexOf(row), 1)
						duplicates.push(serial)
					}
				}).catch((error) => reject(error))
			})
			resolve({data, headers})
		}).catch((error) => reject(error))
	})
}

function checkIfDuplicateItem(serial) {
	return new Promise((resolve) => {
		if (storedItems) {
			Object.keys(storedItems).forEach((key) => {
				const storedItem = storedItems[key]
				if (storedItem.serial === serial) resolve(true)
			})
		}
		resolve(false)
	})
}

function getStoredData (path) {
	return ref.child(`feed/${path}`).once('value')
	.then((snapshot) => snapshot.val())
}
// END Firebase API functions

// Start Initial Import Validation functions
function validateColumns () {
	return new Promise((resolve, reject) => {
		let columnsToValidate = []
		Object.keys(headers).forEach((header) => {
			if (header === 'serial' ||
				header === 'first_name' ||
				header === 'last_name' ||
				header === 'make' ||
				header === 'model' ||
				header === 'computer') { // these are the columns that need to be validated ... only checking to see if content exists
				columnsToValidate.push(validateColumn(data, headers[header]))
			}
		})
		data.shift() // we don't need the first row (headers), b/c now we have the headers object that lets us know they key for each header, within each row.
		Promise.all(columnsToValidate)
		.then(() => resolve({data, headers}))
		.catch((error) => reject(error))
	})
}

function validateHeaders (data) {
	const columnHeaders = data[0]
	return new Promise((resolve, reject) => {
		const neededColumns = ['serial', 'purchase year', 'purchase month', 'notes', 'first name', 'last name', 'make', 'model', 'description', 'computer']
		let headers = {} // attach a property for each column header, with the value of it's position in the row... this way we know what position each of the columns are, for each of the items/rows within the csv passed in
		let missingHeaders = ''
		neededColumns.forEach((neededColumn) => {
			const found = columnHeaders.find((existingColumn) => existingColumn.toLowerCase() === neededColumn)
			if (found !== undefined) { // then the column was found
				const columnHeader = neededColumn.replace(/\s/g, '_')
				headers[columnHeader] = columnHeaders.indexOf(found)
			} else {
				missingHeaders === ''
				? missingHeaders = neededColumn.toTitleCase()
				: missingHeaders = `${missingHeaders}, ${neededColumn.toTitleCase()}`
			}
		})
		const initialData = data
		const generatedHeaders = headers
		missingHeaders === ''
		? resolve({initialData, generatedHeaders})
		: reject(`Error! It looks like you're missing the following column(s): ${missingHeaders}`)
	})
}

function validateColumn (data, column) {
	return new Promise((resolve, reject) => {
		let error = ''
		for (let r = 1; r <= data.length - 1; r++) {
			const row = data[r][column]
			const columnName = data[0][column]
			if (row !== undefined && row !== '' && row.length === 0) {
				error === ''
				? error = `Error! There was a problem with column, ${columnName}, in the following rows: ${r + 1}`
				: error = `${error}, ${r + 1}`
			}
			if (row === undefined) data.splice(r, 1) // remove any empty rows from the data set
		}
		error === ''
		? resolve()
		: reject(error)
	})
}
// End Initial Import Validation functions


String.prototype.toTitleCase = function () {
    return this.replace(/\w\S*/g, (txt) => { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase() })
}
