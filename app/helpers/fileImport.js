import Papa from 'papaparse' // http://papaparse.com/docs

String.prototype.toTitleCase = function () {
    return this.replace(/\w\S*/g, (txt) => { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase() })
}

export default function handleFileImport (file) {
	return new Promise((resolve, reject) => {
		let columns = {}
		Papa.parse(file, {
			complete: (results) => {
				validateColumns(results.data)
				// .then((columnsWithIndex) => {
					// columns = columnsWithIndex
					// return validateColumn(results.data, columns, columns.serial)
				// })
				// .then(() => validateColumn(results.data, columns, columns.first_name))
				// .then(() => validateColumn(results.data, columns, columns.last_name))
				// .then(() => validateColumn(results.data, columns, columns.make))
				// .then(() => validateColumn(results.data, columns, columns.model))
				// .then(() => validateColumn(results.data, columns, columns.computer))
				.then(() => console.log('columns all validated'))
				.catch((error) => reject(error))
				// resolve()
			},
			error: (err, file, inputElem, reason) => {
				reject('Error! There was a problem with the data in you CSV file. Please be sure it is formatted correctly and try again. If you continue to receive this error, contact the Interactive department.')
			}
		})
	})
}

function validateColumns (data) {
	const columnHeaders = data[0]
	let columns = {}
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
		columns = headers
		if (missingHeaders === '') {
			Object.keys(columns).forEach((column) => {
				console.log(column)
				if (column !== 'purchase_year' || column !== 'purchase_month' || column !== 'notes' || column !== 'description') { // these columns can be empty
					return validateColumn(data, columns, columns[column])
					.catch((error) => reject(error))
				}
			})
			console.log('after each column validate')
			// resolve(columns)
			// validateColumn(data, columns, columns.serial)
			// .then(() => validateColumn(data, columns, columns.first_name))
			// .then(() => validateColumn(data, columns, columns.last_name))
			// .then(() => validateColumn(data, columns, columns.make))
			// .then(() => validateColumn(data, columns, columns.model))
			// .then(() => validateColumn(data, columns, columns.computer))
			// .then(() => resolve(columns))
			// .catch((error) => reject(error))
		} else {
			reject(`Error! It looks like you're missing the following column(s): ${missingHeaders}`)
		}
	})
}

function validateColumn (data, columns, column) {
	return new Promise((resolve, reject) => {
		let error = ''
		for (let r = 1; r <= data.length - 1; r++) {
			const row = data[r][column]
			const columnName = data[0][column]
			const first_name = data[r][columns.first_name]
			const inventoryWithoutLastName = (columnName.toLowerCase() === 'last name' && first_name.toLowerCase() === 'inventory') // inventory doesn't have a last name, so we don't want to say there is an error when finding an empty last name on an inventory item
			if (row.length === 0 && !inventoryWithoutLastName) {
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
