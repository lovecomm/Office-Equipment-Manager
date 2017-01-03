import { getItemsBound, getPeopleBound, getHardwaresBound } from 'helpers/api'
import fileDownload from 'react-file-download'

export default function fileExport () {
	getItemsBound(({items, sortedItemIds}) => {
		getPeopleBound((people) => {
			getHardwaresBound((hardwares) => {
				buildCSV(items, people, hardwares)
				.then((csv) => fileDownload(csv, `equipment-manager-data-${new Date()}`))
			})
		})
	})
}

function buildCSV (items, people, hardwares) {
	return new Promise((resolve, reject) => {
		let csv = `Serial,Purchase Year,Purchase Month,Notes,First Name,Last Name,Make,Model,Description,Computer`
		Object.keys(items).forEach((key) => {
			const item = items[key]
			const person = people[item.personId]
			const hardware = hardwares[item.hardwareId]
			const purchaseDate = new Date(item.purchasedDate)
			const year = purchaseDate.getFullYear()
			const month = purchaseDate.getMonth()
			csv += `\n ${item.serial},"${year}","${month}","${item.note}","${person.firstName}","${person.lastName}","${hardware.make}","${hardware.model}","${hardware.description}","${hardware.isComputer}"`
		})
		resolve(csv)
	})
}
