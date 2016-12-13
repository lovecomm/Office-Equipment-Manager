import Papa from 'papaparse' // http://papaparse.com/docs
import { ref } from 'config/constants'
import { saveNewPerson } from 'helpers/api'
import { saveNewHardware } from 'helpers/api'

let storedPeople
let storedHardwares
let duplicates = []
let newRows

export default function handleFileImport (file) {
	return new Promise((resolve, reject) => {
		Papa.parse(file, {
			complete: (results) => {
				validateHeaders(results.data)
				.then(({data, headers}) => validateColumns(data, headers))
				.then(({data, headers}) => checkForDuplicateItems(data, headers))
				.then(({data, headers}) => convertDataArrayToObject(data, headers))
				.then(() => checkIfPeopleAndHardwaresExist())
				.catch((error) => reject(error))
			},
			error: (err, file, inputElem, reason) => {
				reject('Error! There was a problem with the data in you CSV file. Please be sure it is formatted correctly and try again. If you continue to receive this error, contact the Interactive department.')
			}
		})
	})
}

// Start Misc Helper functions
function convertDataArrayToObject (data, headers, duplicates) {
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
function checkIfPeopleAndHardwaresExist () {
	return new Promise((resolve, reject) => {
		getStoredData('people')
		.then((stored_people) => {
			storedPeople = stored_people
			return getStoredData('hardwares')
		})
		.then((stored_hardwares) => {
			storedHardwares = stored_hardwares
			// need each row's person and hardwars to combine after
			// if new hardwares or people are created, need subsequent rows to know about it (synchronous)
			let hardwareAndPersonPromises = []
			Object.keys(newRows).forEach((key) => {
				const row = newRows[key]
				hardwareAndPersonPromises.push(
					() => handlePersonExists(storedPeople, row),
					() => handleHardwaresExists(storedHardwares, row)
				)
			})
			doSynchronousLoop(hardwareAndPersonPromises.length, hardwareAndPersonPromises, () => {
				console.log('handle merging newRows into Data', newRows)
			})
		})
		.catch((err) => reject(err))
		resolve()
	})
}

function doSynchronousLoop (iterator, data, done) {
	if (iterator >= 0) {
		let promiseFunction = data[data.length - iterator]
		if (promiseFunction !== undefined) {
			iterator--
			promiseFunction()
			.then(() => doSynchronousLoop(iterator, data, done))
		} else {
			done()
		}
	} else {
		done()
	}
}

function handleHardwaresExists (storedHardwares, row) { // checks if hardware exists, if does then adds hardwareId to row, if not creates the hardware and then adds hardwareId to row
	return new Promise((resolve, reject) => {
		checkIfHardwareExists(storedHardwares, row)
		.then(({hardwareExists, storedHardwareId}) => {
			if (hardwareExists) {
				row.hardware.hardwareId = storedHardwareId
				resolve(row)
			} else {
				resolve(row)
				saveNewHardware(storedHardwares, row.hardware, 100000)
				.then((newHardware) => {
					storedHardwares[newHardware.hardwareId] = {
						make: newHardware.make,
						model: newHardware.model,
						hardwareId: newHardware.id,
					}
					row.hardware.hardwareId = newHardware.hardwareId
					resolve(row)
				})
			}
		})
	})
}

function checkIfHardwareExists (storedHardwares, row) {
	return new Promise((resolve, reject) => {
		let hardwareExists = false
		let storedHardwareId = ''
		Object.keys(storedHardwares).forEach((key) => {
			const storedHardware = storedHardwares[key]
			if (storedHardware.make.toLowerCase() === row.hardware.make.toLowerCase() && storedHardware.model.toLowerCase() === row.hardware.model.toLowerCase()) {
				hardwareExists = true
				storedHardwareId = storedHardware.hardwareId
			}
		})
		resolve ({hardwareExists, storedHardwareId})
	})
}

function handlePersonExists (storedPeople, row) { // checks if person exists, if does then adds personId to row, if not creates the person and then adds personId to row
	return new Promise((resolve, reject) => {
		checkIfPersonExists(storedPeople, row)
		.then(({personExists, storedPersonId}) => {
			if (personExists) {
				row.person.personId = storedPersonId
				resolve(row)
			} else {
				saveNewPerson(storedPeople, row.person, 100000)
				.then((newPerson) => {
					storedPeople[newPerson.personId] = {
						firstName: newPerson.firstName,
						lastName: newPerson.lastName,
						personId: newPerson.personId,
					}
					row.person.personId = newPerson.personId
					resolve(row)
				})
			}
		})
	})
}

function checkIfPersonExists (storedPeople, row) {
	return new Promise((resolve, reject) => {
		let personExists = false
		let storedPersonId = ''
		Object.keys(storedPeople).forEach((key) => {
			const storedPerson = storedPeople[key]
			if (storedPerson.firstName.toLowerCase() === row.person.firstName.toLowerCase() && storedPerson.lastName.toLowerCase() === row.person.lastName.toLowerCase()) {
				personExists = true
				storedPersonId = storedPerson.personId
			}
		})
		resolve ({personExists, storedPersonId})
	})
}

function checkForDuplicateItems (data, headers) {
	return new Promise((resolve, reject) => {
		getStoredData('items')
		.then((storedItems) => {
			data.forEach((row) => {
				const serial = row[headers.serial]
				checkIfDuplicateItem(storedItems, serial)
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

function checkIfDuplicateItem(storedItems, serial) {
	return new Promise((resolve) => {
		Object.keys(storedItems).forEach((key) => {
			const storedItem = storedItems[key]
			if (storedItem.serial === serial) resolve(true)
		})
		resolve(false)
	})
}

function getStoredData (path) {
	return ref.child(`feed/${path}`).once('value')
	.then((snapshot) => snapshot.val())
}
// END Firebase API functions

// Start Initial Import Validation functions
function validateColumns (data, headers) {
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
		missingHeaders === ''
		? resolve({data, headers})
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
