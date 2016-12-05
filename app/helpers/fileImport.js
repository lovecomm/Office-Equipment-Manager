import Papa from 'papaparse' // http://papaparse.com/docs

String.prototype.toTitleCase = function () {
    return this.replace(/\w\S*/g, (txt) => { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase() })
}

export default function handleFileImport (file) {
	return new Promise((resolve, reject) => {
		let columns = {}
		Papa.parse(file, {
			complete: (results) => {
				validateHeaders(results.data)
				.then((columnHeaders) => validateColumns(results.data, columnHeaders))
				.catch((error) => reject(error))
			},
			error: (err, file, inputElem, reason) => {
				reject('Error! There was a problem with the data in you CSV file. Please be sure it is formatted correctly and try again. If you continue to receive this error, contact the Interactive department.')
			}
		})
	})
}

function validateColumns (data, columnHeaders) {
	return new Promise((resolve, reject) => {
		let columnsToValidate = []
		Object.keys(columnHeaders).forEach((columnHeader) => {
			if (columnHeader === 'serial' ||
				columnHeader === 'first_name' ||
				columnHeader === 'last_name' ||
				columnHeader === 'make' ||
				columnHeader === 'model' ||
				columnHeader === 'computer') { // these are the columns that need to be validated ... only checking to see if content exists
				columnsToValidate.push(validateColumn(data, columnHeaders[columnHeader]))
			}
		})
		Promise.all(columnsToValidate)
		.then(() => resolve())
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
		? resolve(headers)
		: reject(`Error! It looks like you're missing the following column(s): ${missingHeaders}`)
	})
}

function validateColumn (data, column) {
	return new Promise((resolve, reject) => {
		let error = ''
		for (let r = 1; r <= data.length - 1; r++) {
			const row = data[r][column]
			const columnName = data[0][column]
			if (row.length === 0) {
				error === ''
				? error = `Error! There was a problem with column, ${columnName}, in the following rows, ${r + 1}`
				: error = `${error}, ${r + 1}`
			}
		}
		error === ''
		? resolve()
		: reject(error)
	})
}
