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

export function deleteData (dataType, dataId) {
	switch (dataType) {
	case 'people':
		return ref.child(`feed/people/${dataId}`).remove() // remove person, but need to assign all associated items to INVENTORY
		.then(() => {
			getItems(({items}) => {
				getPeople((people) => {
					for (const personId in people) {
						if (people[personId].firstName === 'INVENTORY') {
							for (const itemId in items) {
								if (items[itemId].personId === dataId) {
									return ref.child(`feed/items/${itemId}`).update({personId: personId}) // update the item to be INVENTORY (still considered a person) if the user assigned to it is deleted
								}
							}
						}
					}
				}, (err) => console.error(`Error in getPeople call within deleteData: ${err}`))
			}, (err) => console.error(`Error in getItems call within deleteData: ${err}`))
		})
		.catch((err) => `Error in deleteData, case 'people': ${err}`)
	case 'hardwares':
		return ref.child(`feed/hardwares/${dataId}`).remove()
		.then(() => {
			getItems(({items}) => {
				for (const itemId in items) {
					if (items[itemId].hardwareId === dataId) {
						ref.child(`feed/items/${itemId}`).remove() // delete all items that use this hardware
					}
				}
			}, (err) => console.error(`Error in getItems call within deleteData, case 'hardwares': ${err}`))
		})
		.catch((err) => `Error in deleteData, case 'hardwares': ${err}`)
	default: // items
		return ref.child(`feed/items/${dataId}`).remove()
		.catch((err) => `Error in deleteData, case 'default' - items: ${err}`)
	}
}
// END General Firebase API Calls



// START Hardwares related Firebase API Calls
export function saveNewHardware (hardwares, hardware, uid) {
	return new Promise((resolve, reject) => {
		let newHardware
		const hardwareId = ref.child('feed/hardwares').push().key
		const hardwarePhotoRef = imagesRef.child(`hardwares/${hardware.photo.name}`)
		verifyNewHardware(hardwares, hardware)
		.then((isVerified) => {
			return hardwarePhotoRef.put(hardware.photo) // Store photo to firebase
		})
		.then((photoSnapshot) => {
			const createdHardware = {
				hardwareId: hardwareId,
				dateCreated: new Date().toString(),
				dateLastUpdated: new Date().toString(),
				make: hardware.make,
				model: hardware.model,
				description: hardware.description,
				isComputer: hardware.isComputer,
				createdBy: uid,
				photo: {
					name: hardwarePhotoRef.name,
					fullPath: hardwarePhotoRef.fullPath,
					size: hardware.photo.size,
					type: hardware.photo.type,
					bucket: hardwarePhotoRef.bucket,
					url: '', // Firebase URLs expire, so we get it each time the app loads, then store it in the redux tree
				},
			}
			newHardware = createdHardware
			return ref.child(`feed/hardwares/${hardwareId}`).set(newHardware) // saving hardwares to firebase
		})
		.then(() => resolve(newHardware))
		.catch((err) => reject(err))
	})
}

function verifyNewHardware (hardwares, hardware) {
	return new Promise((resolve, reject) => {
		Object.keys(hardwares).forEach((hardwareId) => {
			const newMakeAndModel = `${hardware.make} ${hardware.model}`.toLowerCase()
			const currenMakeAndModel = `${hardwares[hardwareId].make} ${hardwares[hardwareId].model}`.toLowerCase()
			if (newMakeAndModel === currenMakeAndModel) reject(`Sorry, but the hardware, ${newMakeAndModel} is already registered.`)
		})
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
				return Object.assign(storedHardware, updatedHardwareBase, { photo: {
					name: hardwarePhotoRef.name,
					fullPath: hardwarePhotoRef.fullPath,
					size: hardware.photo.size,
					type: hardware.photo.type,
					bucket: hardwarePhotoRef.bucket,
					url: '',
				}})
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

function getHardwaresBound (cb, errorCB) { // this version is for the feed, its data is bound to firebase
	ref.child('feed/hardwares').on('value', (snapshot) => {
		const hardware = snapshot.val() || {}
		cb(hardware)
	}, errorCB)
}

function getHardware (hardwareId, cb, errorCB) { // NOTE: this should eventually be replaced with getHardwarePromise`
	ref.child(`feed/hardwares/${hardwareId}`).once('value', (snapshot) => {
		const hardware = snapshot.val() || {}
		cb(hardware)
	}, errorCB)
}

function getHardwarePromise (hardwareId) {
	return ref.child(`feed/hardwares/${hardwareId}`).once('value', (snapshot) => Promise.resolve(snapshot))
	.catch((err) => err)
}
// END Hardwares related Firebase API Calls



// START People related Firebase API Calls
export function saveNewPerson (people, person, uid) {
	return new Promise((resolve, reject) => {
		let newPerson
		const personId = ref.child('feed/people').push().key
		return verifyNewPerson(people, person)
		.then((isVerified) => {
			newPerson = {
				personId,
				dateCreated: new Date().toString(),
				createdBy: uid,
				dateLastUpdated: new Date().toString(),
				firstName: person.firstName,
				lastName: person.lastName,
			}
			return ref.child(`feed/people/${personId}`).set(newPerson) // saving new person to firebase
		})
		.then(() => resolve(newPerson))
		.catch((err) => `Error in savePerson: ${err}`)
	})
}

function verifyNewPerson (people, person) {
	return new Promise((resolve, reject) => {
		Object.keys(people).forEach((personId) => {
			const newName = `${person.firstName} ${person.lastName}`.toLowerCase()
			const currentName = `${people[personId].firstName} ${people[personId].lastName}`.toLowerCase()
			if (newName === currentName) reject(`Sorry, but the person, ${currentName} is already registered.`)
		})
		resolve(true)
	})
}

export function saveUpdatedPerson (people, person, uid) {
	return new Promise((resolve, reject) => {
		let storedPerson
		let updatedPerson
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
			updatedPerson = {
				personId: person.personId,
				dateCreated: new Date().toString(),
				createdBy: uid,
				dateLastUpdated: new Date().toString(),
				firstName: person.firstName,
				lastName: person.lastName,
			}
			return ref.child(`feed/people/${person.personId}`).set(updatedPerson) // saving new person to firebase
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

function getPeople (cb, errorCB) {
	ref.child('feed/people').once('value', (snapshot) => {
		const people = snapshot.val() || {}
		cb(people)
	}, errorCB)
}

function getPeopleBound (cb, errorCB) { // this version is for the feed, its data is bounded to firebase
	ref.child('feed/people').on('value', (snapshot) => {
		const people = snapshot.val() || {}
		cb(people)
	}, errorCB)
}

export function getPerson (personId, cb, errorCB) {
	ref.child(`feed/people/${personId}`).once('value', (snapshot) => {
		const person = snapshot.val() || {}
		cb(person)
	}, errorCB)
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
				return Object.assign(newItemBase, {photo: {
					name: itemPhotoRef.name,
					fullPath: itemPhotoRef.fullPath,
					size: item.photo.size,
					type: item.photo.type,
					bucket: itemPhotoRef.bucket,
					url: '', // Firebase URLs expire, so we get it each time the app loads, then store it in the redux tree
				}})
			}
		})
		.then((createdItem) => {
			newItem = createdItem
			return ref.child(`feed/items/${itemId}`).set(newItem)
		})
		.then(() => resolve(newItem))
		.catch((err) => err)
	})
}

function verifyNewItem (items, item) {
	return new Promise((resolve, reject) => {
		Object.keys(items).forEach((itemId) => {
			const newSerial = item.serial.toString()
			const currentSerial = items[itemId].serial.toString()
			if (newSerial.toLowerCase() === currentSerial.toLowerCase()) {
				reject(`Sorry, but the serial number, ${item.serial} is already in use.`)
			}
		})
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
				return Object.assign(storedItem, updatedItemBase, { photo: {
					name: itemPhotoRef.name,
					fullPath: itemPhotoRef.fullPath,
					size: item.photo.size,
					type: item.photo.type,
					bucket: itemPhotoRef.bucket,
					url: '', // Firebase URLs expire, so we get it each time the app loads, then store it in the redux tree
				}})
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

function getItems (cb, errorCB) {
	ref.child('feed/items').once('value', (snapshot) => {
		const items = snapshot.val() || {}
		const sortedItemIds = Object.keys(items).sort((a, b) => items[b].dateCreated - items[a].dateCreated)
		cb({items, sortedItemIds})
	}, errorCB)
}

function getItemsBound (cb, errorCB) { // this version is for the feed, its data is bounded to firebase
	ref.child('feed/items').on('value', (snapshot) => {
		const items = snapshot.val() || {}
		const sortedItemIds = Object.keys(items).sort((a, b) => items[b].dateCreated - items[a].dateCreated)
		cb({items, sortedItemIds})
	}, errorCB)
}

function getItemPromise (itemId) {
	return ref.child(`feed/items/${itemId}`).once('value', (snapshot) => Promise.resolve(snapshot))
	.catch((err) => err)
}

function getItem (itemId, cb, errorCB) {
	ref.child(`feed/items/${itemId}`).once('value', (snapshot) => {
		const item = snapshot.val() || {}
		cb(item)
	}, errorCB)
}
// END Items related Firebase API Calls
