import Papa from 'papaparse' // http://papaparse.com/docs
import { ref } from 'config/constants'

String.prototype.toTitleCase = function () {
    return this.replace(/\w\S*/g, (txt) => { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase() })
}

export default function handleFileImport (file) {
	return new Promise((resolve, reject) => {
		Papa.parse(file, {
			complete: (results) => {
				validateHeaders(results.data)
				.then(({data, headers}) => validateColumns(data, headers))
				.then(({data, headers}) => checkForDuplicateItems(data, headers))
				.then(({data, headers, duplicates}) => console.log(data, headers, duplicates))
				.catch((error) => reject(error))
			},
			error: (err, file, inputElem, reason) => {
				reject('Error! There was a problem with the data in you CSV file. Please be sure it is formatted correctly and try again. If you continue to receive this error, contact the Interactive department.')
			}
		})
	})
}



// Start Firebase API functions
function checkForDuplicateItems (data, headers) {
	return new Promise((resolve, reject) => {
		getStoredItems()
		.then((storedItems) => {
			let duplicates = []
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
			resolve({data, headers, duplicates})
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

function getStoredItems () {
	return ref.child('feed/items').once('value')
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
