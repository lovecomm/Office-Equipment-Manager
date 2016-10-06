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
		const hardwareId = ref.child('feed/hardwares').push().key
		const hardwarePhotoRef = imagesRef.child(`hardwares/${hardware.photo.name}`)
		verifyNewHardware(hardwares, hardware)
		.then((isVerified) => {
			return hardwarePhotoRef.put(hardware.photo) // Store photo to firebase
		})
		.then((photoSnapshot) => {
			const newHardware = {
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
			ref.child(`feed/hardwares/${hardwareId}`).set(newHardware) // saving hardwares to firebase
			resolve(newHardware)
		})
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

export function saveUpdatedHardware (hardwares, hardware, uid) {
	return new Promise((resolve, reject) => {
		const hardwarePhotoRef = hardware.photo.name !== undefined ? imagesRef.child(`hardwares/${hardware.photo.name}`) : undefined // the photo is a required property on hardware. However, if there isn't a new photo being submitted with the updated hardware, then photo.name will be undefined.
		let storedHardware
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
			return updatedHardwareMatchesExistingHardware(hardwares, hardware)
		})
		.then((matchedMakeAndModel) => {
			return matchedMakeAndModel !== undefined ? matchedMakeAndModel : undefined
		})
		.then((matchedMakeAndModel) => {
			if (matchedMakeAndModel !== undefined) {
				const storedMakeAndModel = `${storedHardware.make} ${storedHardware.model}`.toLowerCase()
				if (storedMakeAndModel !== matchedMakeAndModel) {
					reject(`Sorry, but the hardware, ${matchedMakeAndModel} is already registered.`)
					throw new Error(`Sorry, but the hardware, ${matchedMakeAndModel} is already registered.`)
				} else { return true }
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
		.then((updatedHardware) => {
			return ref.child(`feed/hardwares/${updatedHardware.hardwareId}`).update(updatedHardware) // updating hardware in firebase
			.then(() => resolve(updatedHardware))
		})
		.catch((err) => err)
	})
}

function updatedHardwareMatchesExistingHardware (hardwares, hardware) {
	return new Promise((resolve, reject) => {
		Object.keys(hardwares).some((hardwareId) => {
			const newMakeAndModel = `${hardware.make} ${hardware.model}`.toLowerCase()
			const currenMakeAndModel = `${hardwares[hardwareId].make} ${hardwares[hardwareId].model}`.toLowerCase()
			if (newMakeAndModel === currenMakeAndModel) {
				resolve(currenMakeAndModel)
			}
		})
		resolve(undefined)
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
// END People related Firebase API Calls


function updateItemHasSubContentDB (hardwareId, hardwareDescription) {
	let newSubContentStatus
	getItems(({items, sortedItemIds}) => {
		// loop through each item. Update the ones that match the hardwareId to haveSubContent = true
		sortedItemIds.forEach((itemId) => {
			if (items[itemId].hardwareId === hardwareId) {
				newSubContentStatus = determineItemHasSubContent(items[itemId], hardwareDescription)
				return ref.child(`feed/items/${itemId}`).update({hasSubContent: newSubContentStatus})
				.then(() => newSubContentStatus) // update hasSubContent status in firebase
				.catch((err) => `Error in ref.child call within updateItemHasSubContentDB: ${err}`)
			}
		})
	}, (err) => `Error in getItems call within updateItemHasSubContentDB: ${err}`)
}

function verifyPerson (person) {
	return new Promise((resolve, reject) => {
		getPeople((people) => {
			for (const personId in people) {
				// Test for full name duplicate
				if (`${people[personId].firstName} ${people[personId].lastName}`.toUpperCase()	===
				`${person.firstName} ${person.lastName}`.toUpperCase()) {
					reject(`Sorry, but the name, ${person.firstName} ${person.lastName} is already in use by another person.`)
				}
			}
			// Mark as verified if email and fullname is not in use
			resolve(true)
		}, (err) => console.error(`Error in getPeople call within verifyPerson: ${err}`))
	})
}

export function savePerson (person, uid) {
	const personId = person.editing ? person.personId : ref.child('feed/people').push().key
	let newPerson
	return verifyPerson(person)
	.then(() => {
		const personBase = {
			personId,
			firstName: person.firstName,
			lastName: person.lastName,
			createdBy: uid.uid,
			dateLastUpdated: new Date().toString(),
		}
		if (person.editing) {
			newPerson = personBase
			return ref.child(`feed/people/${personId}`).update(personBase) // saving edited person to firebase
		} else {
			newPerson = Object.assign(personBase, {
				dateCreated: new Date().toString(),
			})
			return ref.child(`feed/people/${personId}`).set(newPerson) // saving new person to firebase
		}
	})
	.then(() => (newPerson))
	.catch((err) => `Error in savePerson: ${err}`)
}

function verifyItem (item, isBeingEdited) {
	return new Promise((resolve, reject) => {
		getItems(({items, sortedItemIds}) => {
			for (const itemId in items) {
				// Test for Make & Model duplicate
				if (`${items[itemId].serial}`.toUpperCase()	=== `${item.serial}`.toUpperCase()) {
					if (!isBeingEdited) {
						reject(`Sorry, but the serial number, ${item.serial} is already in use.`)
					} else { // we want the user to be able to edit an item, without changing the serial number of that item.
						getItem(item.itemId, (storedItem) => {
							storedItem.serial !== item.serial
							? reject(`Sorry, but the serial number, ${item.serial} is already in use.`)
							: resolve(true)
						}, (err) => reject(`Error in getItem call, within getItems call, within verifyItem: ${err}`))
					}
				}
			}
			// Mark as verified if email and fullname is not in use
			resolve(true)
		}, (err) => console.error(`Error in getItems call within verifyItem: ${err}`))
	})
}

function getNewItemBase (item, itemId, uid) {
	return new Promise((resolve, reject) => {
		console.log('getnNewItemBase, item', item)
		getHardware(item.hardwareId, (hardware) => {
			console.log('getnNewItemBase within getHardware, item', item)
			const newItemBase = {
				itemId: itemId,
				serial: item.serial,
				purchasedDate: item.purchasedDate.toString(),
				personId: item.personId,
				hardwareId: item.hardwareId,
				note: item.note,
				collapsed: true,
				hasSubContent: determineItemHasSubContent(item, hardware.description),
				createdBy: uid.uid,
				dateLastUpdated: new Date().toString(),
			}
			resolve(newItemBase)
		}, (err) => reject(err))
	})
}

function storeNewItemPhoto (photo) {
	return new Promise((resolve, reject) => {
		const itemPhotoRef = imagesRef.child(`items/${photo.name}`) // Get ref for person photo
		return itemPhotoRef.put(photo) // saving person photo to firebase
		.then((photoSnapshot) => resolve({photoSnapshot, itemPhotoRef}))
		.catch((err) => `Error in storeNewItemPhoto: ${err}`)
	})
}

export function saveItem (item, uid) {
	const itemId = item.editing ? item.itemId : ref.child('feed/items').push().key
	let newItem
	return verifyItem(item, item.editing)
	.then(() => {
		return getNewItemBase(item, itemId, uid)
	})
	.then((newItemBase) => {
		if (item.photo.size) { // if this is true, then a new photo will have been attached to a new item, or an edited item
			return storeNewItemPhoto(item.photo)
			.then(({photoSnapshot, itemPhotoRef}) => {
				const photo = {
					name: itemPhotoRef.name,
					fullPath: itemPhotoRef.fullPath,
					size: item.photo.size,
					type: item.photo.type,
					bucket: itemPhotoRef.bucket,
					url: photoSnapshot.downloadURL,
				}
				return Object.assign(newItemBase, {photo: photo})
			})
		} else {
			return Object.assign(newItemBase, {photo: {}})
		}
	})
	.then((newItemBaseWithPhoto) => {
		newItem = newItemBaseWithPhoto
		if (item.editing) {
			getItem(itemId, (originalItem) => {
				return ref.child(`feed/items/${itemId}`).update(Object.assign(originalItem, newItem)) // updating edited item
			}, (err) => console.error(`Error in updating new item, api.js, within .then((newItemBaseWithPhoto)): ${err}`))
		} else {
			return ref.child(`feed/items/${itemId}`).set(Object.assign(newItem, {
				dateCreated: new Date().toString(),
			})) // saving new item to firebase
		}
	})
	.then(() => {
		return newItem
	})
	.catch((err) => `Error in saveItem: ${err}`)
}




// START Getting Data from Firebase
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

function getItem (itemId, cb, errorCB) {
	ref.child(`feed/items/${itemId}`).once('value', (snapshot) => {
		const item = snapshot.val() || {}
		cb(item)
	}, errorCB)
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
