import { ref, imagesRef } from 'config/constants'
import { determineItemHasSubContent } from 'helpers/utils'

// START General Firebase API Calls
export function listenToFeed (cb, errorCB) {
	getItemsBound(({items, sortedItemIds}) => {
		getPeopleBound((people) => {
			getHardwaresBound((hardwares) => cb({
				items,
				sortedItemIds,
				people,
				hardwares,
			}))
		})
	})
}

export function getUrl (imageFolder, photoName) {
	return imagesRef.child(`${imageFolder}/${photoName}`).getDownloadURL()
	.then((url) => url)
	.catch((err) => `Error in getUrl: ${err}`)
}

export function deleteDataDB (dataType, dataId, items, people) {
	return new Promise((resolve, reject) => {
		switch (dataType) {
		case 'people':
			return assignToInventory(items, people, dataId) // move items assigned to soon-to-be-deleted person to Inventory
			.then(() => ref.child(`feed/people/${dataId}`).remove())
			.then(() => resolve())
			.catch((err) => console.warn('Error in deleteDataDB, case people: ', err))
		case 'hardwares':
			return ref.child(`feed/hardwares/${dataId}`).remove()
			.then(() => {
				Object.keys(items).forEach((itemId) => {
					if (items[itemId].hardwareId === dataId) return ref.child(`feed/items/${itemId}`).remove() // delete all items that use this hardware
				})
			})
			.then(() => resolve())
			.catch((err) => console.warn('Error in deleteDataDB, case hardwares: ' , err))
		case 'items':
			return ref.child(`feed/items/${dataId}`).remove()
			.then(() => resolve())
			.catch((err) => console.warn('Error in deleteDataDB, case default - items: ', err))
		default:
			reject(`Sorry, but "dataType" must be people, hardwares, or items in deleteDataDB. You passed in, ${dataType}`)
		}
	})
}

function assignToInventory (items, people, deletedPersonId) {
	return new Promise((resolve, reject) => {
		let itemUpdatePromises = []
		Object.keys(people).forEach((personId) => { // need to find the personId for INVENTORY
			if (people[personId].firstName.toLowerCase() === 'inventory') { // found inventory's personId
				Object.keys(items).forEach((itemId) => { // find all items that have the deletedPersonId
					if (items[itemId].personId === deletedPersonId) {
						itemUpdatePromises.push(ref.child(`feed/items/${itemId}`).update({personId: personId}))
					}
				})
			}
		})
		Promise.all(itemUpdatePromises).then(() => resolve())
	})
}

// END General Firebase API Calls
// START Hardwares related Firebase API Calls
export function saveNewHardware (hardwares, hardware, uid) {
	return new Promise((resolve, reject) => {
		const hardwareId = ref.child('feed/hardwares').push().key
		var hardwarePhotoRef = imagesRef.child(`hardwares/${hardware.photo.name}`)
		verifyNewHardware(hardwares, hardware)
		.then((isVerified) => {
			return hardwarePhotoRef.put(hardware.photo) // Store photo to firebase
		})
		.then((photoSnapshot) => hardwarePhotoRef.getDownloadURL())
		.then((url) => {
			const newHardware = {
				hardwareId: hardwareId,
				dateCreated: new Date().toString(),
				dateLastUpdated: new Date().toString(),
				make: hardware.make,
				model: hardware.model,
				collapsed: true,
				description: hardware.description,
				isComputer: hardware.isComputer,
				createdBy: uid,
				photo: {
					name: hardwarePhotoRef.name,
					fullPath: hardwarePhotoRef.fullPath,
					size: hardware.photo.size,
					type: hardware.photo.type,
					bucket: hardwarePhotoRef.bucket,
					url: url,
				},
			}
			ref.child(`feed/hardwares/${hardwareId}`).set(newHardware) // saving hardwares to firebase
			resolve(newHardware)
		})
		.catch((err) => {
			console.warn(err)
			reject('Error in saveNewHardware, ', err)
		})
	})
}

function verifyNewHardware (hardwares, hardware) {
	return new Promise((resolve, reject) => {
		if (hardwares) {
			Object.keys(hardwares).forEach((hardwareId) => {
				const newMakeAndModel = `${hardware.make} ${hardware.model}`.toLowerCase()
				const currenMakeAndModel = `${hardwares[hardwareId].make} ${hardwares[hardwareId].model}`.toLowerCase()
				if (newMakeAndModel === currenMakeAndModel) reject(`Sorry, but the hardware, ${newMakeAndModel} is already registered.`)
			})
		}
		resolve(true)
	})
}

export function saveUpdatedHardware (hardwares, hardware, uid, items) {
	return new Promise((resolve, reject) => {
		let updatedHardware
		let storedHardware
		const hardwarePhotoRef = hardware.photo.name !== undefined ? imagesRef.child(`hardwares/${hardware.photo.name}`) : undefined // the photo is a required property on hardware. However, if there isn't a new photo being submitted with the updated hardware, then photo.name will be undefined.
		const updatedHardwareBase = {
			hardwareId: hardware.hardwareId,
			make: hardware.make,
			model: hardware.model,
			description: hardware.description,
			isComputer: hardware.isComputer,
			dateLastUpdated: new Date().toString(),
			createdBy: uid,
		}
		return getHardwarePromise(hardware.hardwareId)
		.then((storedHardwareInFB) => {
			storedHardware = storedHardwareInFB.val()
			return testIfMakeAndModelExist(hardwares, hardware)
		})
		.then((existingMakeAndModel) => {
			const storedMakeAndModel = `${storedHardware.make} ${storedHardware.model}`
			if (existingMakeAndModel !== undefined &&
				storedMakeAndModel.toLowerCase() !== existingMakeAndModel.toLowerCase()) { // if there is a existingMakeAndModel, then the new makeAndModel for the hardware we're editing is already in use. As such, we have to check if it's matching against the stored version of itself, or a different makeAndModel. The former is okay, the latter we want to prevent.
				reject(`Sorry, but the hardware, ${existingMakeAndModel} is already registered.`)
				throw new Error(`Sorry, but the hardware, ${existingMakeAndModel} is already registered.`)
			} else { return true }
		})
		.then((isVerified) => {
			if (hardwarePhotoRef) {
				return hardwarePhotoRef.put(hardware.photo) // Store photo to firebase
			} else { return undefined } // is updating existing hardware, and does not have an updated photo
		})
		.then((photoSnapshot) => {
			if (hardwarePhotoRef !== undefined || photoSnapshot !== undefined) { // new photo has been stored
				hardwarePhotoRef.getDownloadURL()
				.then((url) => {
					return Object.assign(storedHardware, updatedHardwareBase, { photo: {
						name: hardwarePhotoRef.name,
						fullPath: hardwarePhotoRef.fullPath,
						size: hardware.photo.size,
						type: hardware.photo.type,
						bucket: hardwarePhotoRef.bucket,
						url: url,
					}})
				})
			} else {
				return Object.assign(storedHardware, updatedHardwareBase)
			}
		})
		.then((modifiedHardware) => {
			updatedHardware = modifiedHardware
			return ref.child(`feed/hardwares/${updatedHardware.hardwareId}`).update(updatedHardware) // updating hardware in firebase
		})
		.then(() => {
			return updateItemsHasSubContentStatus(hardware, items)
		})
		.then(() => resolve(updatedHardware))
		.catch((err) => err)
	})
}

function testIfMakeAndModelExist (hardwares, hardware) {
	return new Promise((resolve, reject) => {
		Object.keys(hardwares).some((hardwareId) => {
			const newMakeAndModel = `${hardware.make} ${hardware.model}`
			const currenMakeAndModel = `${hardwares[hardwareId].make} ${hardwares[hardwareId].model}`
			if (newMakeAndModel.toLowerCase() === currenMakeAndModel.toLowerCase()) resolve(currenMakeAndModel)
		})
		resolve(undefined)
	})
}

function updateItemsHasSubContentStatus (hardware, items) {
	return new Promise((resolve, reject) => {
		Object.keys(items).forEach((itemId) => {
			const newSubContentStatus = determineItemHasSubContent(items[itemId], hardware.description)
			if (newSubContentStatus !== items[itemId].hasSubContent) ref.child(`feed/items/${itemId}`).update({hasSubContent: newSubContentStatus})
		})
		resolve(true)
	})
}

export function getHardwaresBound (cb, errorCB) { // this version is for the feed, its data is bound to firebase
	ref.child('feed/hardwares').on('value', (snapshot) => {
		const hardware = snapshot.val() || {}
		cb(hardware)
	})
}

function getHardwarePromise (hardwareId) {
	return ref.child(`feed/hardwares/${hardwareId}`).once('value', (snapshot) => Promise.resolve(snapshot))
	.catch((err) => err)
}
// END Hardwares related Firebase API Calls
// START People related Firebase API Calls
export function saveNewPerson (people, person, uid) {
	return new Promise((resolve, reject) => {
		const personId = ref.child('feed/people').push().key
		var personPhotoRef = imagesRef.child(`people/${person.photo.name}`)
		return verifyNewPerson(people, person)
		.then((isVerified) => {
			return personPhotoRef.put(person.photo)
		})
		.then((photoSnapshot) => personPhotoRef.getDownloadURL())
		.then((url) => {
			let newPerson = {
				personId,
				dateCreated: new Date().toString(),
				createdBy: uid,
				dateLastUpdated: new Date().toString(),
				firstName: person.firstName,
				lastName: person.lastName,
				collapsed: true,
				photo: {
					name: personPhotoRef.name,
					fullPath: personPhotoRef.fullPath,
					size: person.photo.size,
					type: person.photo.type,
					bucket: personPhotoRef.bucket,
					url: url, 
				},
			}
			ref.child(`feed/people/${personId}`).set(newPerson) // saving new person to firebase
			resolve(newPerson)
		})
		.catch((err) => {
			console.warn(err)
			reject('Error in savePerson, ', err);
		})
	})
}

function verifyNewPerson (people, person) {
	return new Promise((resolve, reject) => {
		if (people) {
			Object.keys(people).forEach((personId) => {
				const newName = `${person.firstName} ${person.lastName}`.toLowerCase()
				const currentName = `${people[personId].firstName} ${people[personId].lastName}`.toLowerCase()
				if (newName === currentName) reject(`Sorry, but the person, ${currentName} is already registered.`)
			})
		}
		resolve(true)
	})
}

export function saveUpdatedPerson (people, person, uid) {
	return new Promise((resolve, reject) => {
		let storedPerson
		let updatedPerson
		const personPhotoRef = person.photo.name !== undefined ? imagesRef.child(`people/${person.photo.name}`) : undefined // the photo is a required property on hardware. However, if there isn't a new photo being submitted with the updated hardware, then photo.name will be undefined.
		const updatedPersonBase = {
			personId: person.personId,
			dateCreated: new Date().toString(),
			createdBy: uid,
			dateLastUpdated: new Date().toString(),
			firstName: person.firstName,
			lastName: person.lastName,
		}
		return getPersonPromise(person.personId)
		.then((storedPersonInFB) => {
			storedPerson = storedPersonInFB.val()
			return updatedPersonMatchesExistingPerson(people, person)
		})
		.then((matchedName) => {
			const storedName = `${storedPerson.firstName} ${storedPerson.lastName}`
			if (matchedName !== undefined && storedName.toLowerCase() !== matchedName.toLowerCase()) { // if there is a matchedName, then the new name for the person we're editing is already in use. As such, we have to check if it's matching against the stored version of itself, or a different name. The former is okay, the latter we want to prevent.
				const errorMessage = `Sorry, but the person, ${matchedName} is already registered.`
				reject(errorMessage)
				throw new Error(errorMessage)
			} else { return true }
		})
		.then((isVerified) => {
			if (personPhotoRef) {
				return personPhotoRef.put(person.photo)
			} else { return undefined }
		})
		.then((photoSnapshot) => {
			if (personPhotoRef !== undefined || photoSnapshot !== undefined) { // new photo has been stored
				personPhotoRef.getDownloadURL()
				.then((url) => {
					return Object.assign(storedPerson, updatedPersonBase, { photo: {
						name: personPhotoRef.name,
						fullPath: personPhotoRef.fullPath,
						size: person.photo.size,
						type: person.photo.type,
						bucket: personPhotoRef.bucket,
						url: url,
					}})
				})
			} else {
				return Object.assign(storedPerson, updatedPersonBase)
			}
		})
		.then((modifiedPerson) => {
			updatedPerson = modifiedPerson
			return ref.child(`feed/people/${person.personId}`).update(updatedPerson) // saving new person to firebase
		})
		.then(() => resolve(updatedPerson))
		.catch((err) => err)
	})
}

function updatedPersonMatchesExistingPerson (people, person) {
	return new Promise((resolve, reject) => {
		Object.keys(people).some((personId) => {
			const newName = `${person.firstName} ${person.lastName}`
			const currentName = `${people[personId].firstName} ${people[personId].lastName}`
			if (newName.toLowerCase() === currentName.toLowerCase()) resolve(currentName)
		})
		resolve(undefined)
	})
}

export function getPeopleBound (cb, errorCB) { // this version is for the feed, its data is bounded to firebase
	ref.child('feed/people').on('value', (snapshot) => {
		const people = snapshot.val() || {}
		cb(people)
	})
}

export function getPerson (personId, cb, errorCB) {
	ref.child(`feed/people/${personId}`).once('value', (snapshot) => {
		const person = snapshot.val() || {}
		cb(person)
	})
}

function getPersonPromise (personId) {
	return ref.child(`feed/people/${personId}`).once('value', (snapshot) => Promise.resolve(snapshot))
	.catch((err) => err)
}
// END People related Firebase API Calls
// START Items related Firebase API Calls
export function saveNewItem (items, item, uid, hardware) {
	return new Promise((resolve, reject) => {
		let newItem
		const itemId = ref.child('feed/items').push().key
		const itemPhotoRef = item.photo.name ? imagesRef.child(`hardwares/${item.photo.name}`) : undefined
		verifyNewItem(items, item)
		.then((isVerified) => {
			return itemPhotoRef !== undefined
			? itemPhotoRef.put(item.photo) // Store photo to firebase
			: undefined
		})
		.then((photoSnapshot) => {
			const newItemBase = {
				itemId: itemId,
				serial: item.serial,
				dateCreated: new Date().toString(),
				createdBy: uid,
				dateLastUpdated: new Date().toString(),
				purchasedDate: item.purchasedDate.toString(),
				personId: item.personId,
				hardwareId: item.hardwareId,
				note: item.note,
				collapsed: true,
				hasSubContent: determineItemHasSubContent(item, hardware.description),
			}
			if (photoSnapshot === undefined) {
				return Object.assign(newItemBase, {photo: {
					name: '',
					fullPath: '',
					size: '',
					type: '',
					bucket: '',
					url: '',
				}})
			} else {
				itemPhotoRef.getDownloadURL()
				.then((url) => {
					return Object.assign(newItemBase, {photo: {
						name: itemPhotoRef.name,
						fullPath: itemPhotoRef.fullPath,
						size: item.photo.size,
						type: item.photo.type,
						bucket: itemPhotoRef.bucket,
						url: url,
					}})
				})
			}
		})
		.then((newItem) => {
			ref.child(`feed/items/${itemId}`).set(newItem)
			resolve(newItem)
		})
		.catch((err) => {
			console.warn(err)
			reject('Error in saveNewItem, ', err)
		})
	})
}

function verifyNewItem (items, item) {
	return new Promise((resolve, reject) => {
		if (items) {
			Object.keys(items).forEach((itemId) => {
				const newSerial = item.serial.toString()
				const currentSerial = items[itemId].serial.toString()
				if (newSerial.toLowerCase() === currentSerial.toLowerCase()) {
					reject(`Sorry, but the serial number, ${item.serial} is already in use.`)
				}
			})
		}
		resolve(true)
	})
}

export function saveUpdatedItem (items, item, uid, hardware) {
	return new Promise((resolve, reject) => {
		let updatedItem
		let storedItem
		const itemPhotoRef = item.photo.name !== undefined ? imagesRef.child(`items/${item.photo.name}`) : undefined // the photo is a required property on hardware. However, if there isn't a new photo being submitted with the updated hardware, then photo.name will be undefined.
		const updatedItemBase = {
			itemId: item.itemId,
			serial: item.serial,
			createdBy: uid,
			dateLastUpdated: new Date().toString(),
			purchasedDate: item.purchasedDate.toString(),
			personId: item.personId,
			hardwareId: item.hardwareId,
			note: item.note,
			collapsed: true,
			hasSubContent: determineItemHasSubContent(item, hardware.description),
		}
		return getItemPromise(item.itemId)
		.then((storedItemInFB) => {
			storedItem = storedItemInFB.val()
			return testIfSerialExists(items, item)
		})
		.then((existingSerial) => {
			const storedSerial = `${storedItem.serial}`
			if (existingSerial !== undefined &&
				storedSerial.toLowerCase() !== existingSerial.toLowerCase()) { // if there is a existingSerial, then the new serial for the item we're editing is already in use. As such, we have to check if it's matching against the stored version of itself, or a different serial. The former is okay, the latter we want to prevent.
				const errorMessage = `Sorry, but the serial number, ${existingSerial} is already registered.`
				reject(errorMessage)
				throw new Error(errorMessage)
			} else { return true }
		})
		.then((isVerified) => {
			if (itemPhotoRef) {
				return itemPhotoRef.put(item.photo) // Store photo to firebase
			} else { return undefined } // is updating existing item, and does not have an updated photo
		})
		.then((photoSnapshot) => {
			if (itemPhotoRef !== undefined || photoSnapshot !== undefined) { // new photo has been stored
				itemPhotoRef.getDownloadURL()
				.then((url) => {
					return Object.assign(storedItem, updatedItemBase, { photo: {
						name: itemPhotoRef.name,
						fullPath: itemPhotoRef.fullPath,
						size: item.photo.size,
						type: item.photo.type,
						bucket: itemPhotoRef.bucket,
						url: url
					}})
				})
			} else {
				return Object.assign(storedItem, updatedItemBase)
			}
		})
		.then((modifiedItem) => {
			updatedItem = modifiedItem
			return ref.child(`feed/items/${updatedItem.itemId}`).update(updatedItem)
		})
		.then(() => resolve(updatedItem))
		.catch((err) => err)
	})
}

function testIfSerialExists (items, item) {
	return new Promise((resolve, reject) => {
		Object.keys(items).some((itemId) => {
			const newSerial = `${item.serial}`
			const currentSerial = `${items[itemId].serial}`
			if (newSerial.toLowerCase() === currentSerial.toLowerCase()) resolve(currentSerial)
		})
		resolve(undefined)
	})
}

export function getItemsBound (cb, errorCB) { // this version is for the feed, its data is bounded to firebase
	ref.child('feed/items').on('value', (snapshot) => {
		const items = snapshot.val() || {}
		const sortedItemIds = Object.keys(items).sort((a, b) => items[b].dateCreated - items[a].dateCreated)
		cb({items, sortedItemIds})
	})
}

function getItemPromise (itemId) {
	return ref.child(`feed/items/${itemId}`).once('value', (snapshot) => Promise.resolve(snapshot))
	.catch((err) => err)
}
// END Items related Firebase API Calls
