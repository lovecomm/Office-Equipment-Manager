import { ref, imagesRef } from 'config/constants'

// Get firebase imagesRef
export function getUrl (imageFolder, photoName) {
	return imagesRef.child(`${imageFolder}/${photoName}`).getDownloadURL()
	.then((url) => url)
	.catch((err) => `Error in getUrl: ${err}`)
}

function verifyHardware (hardware, editing) {
	return new Promise((resolve, reject) => {
		getHardwares((hardwares) => {
			for (const hardwareId in hardwares) {
				// Test for Make & Model duplicate
				if (!editing &&
					`${hardwares[hardwareId].make} ${hardwares[hardwareId].model}`.toUpperCase()	===
					`${hardware.make} ${hardware.model}`.toUpperCase()) {
					reject(`Sorry, but the hardware, ${hardware.make} ${hardware.model} is already registered.`)
				}
			}
			// Mark as verified if email and fullname is not in use
			resolve(true)
		}, (err) => console.error(`Error in verifyHardware: ${err}`))
	})
}

export function saveHardware (hardware, uid) {
	const hardwareId = hardware.editing ? hardware.hardwareId : ref.child('feed/hardwares').push().key
	const hardwarePhotoRef = hardware.photo.name !== undefined ? imagesRef.child(`hardwares/${hardware.photo.name}`) : undefined // Create a reference to hardware image in firebase
	const newHardwareBase = {
		hardwareId: hardwareId,
		make: hardware.make,
		model: hardware.model,
		description: hardware.description,
		isComputer: hardware.isComputer,
		dateLastUpdated: new Date().toString(),
		createdBy: uid.uid,
	}
	return verifyHardware(hardware, hardware.editing)
	.then(() => {
		if (hardwarePhotoRef) {
			return hardwarePhotoRef.put(hardware.photo) // Store photo to firebase
		} else { return undefined } // is updating existing hardware, and does not have an updated photo
	})
	.then((photoSnapshot) => {
		if (photoSnapshot.downloadURL && !hardware.editing) { // it's a new hardware
			return Object.assign(newHardwareBase, {
				photo: {
					name: hardwarePhotoRef.name,
					fullPath: hardwarePhotoRef.fullPath,
					size: hardware.photo.size,
					type: hardware.photo.type,
					bucket: hardwarePhotoRef.bucket,
					url: '', // URLs expire, so we get it each time the app loads, then store it in the redux tree
				},
				dateCreated: new Date().toString(),
			})
		} else { // updating existing hardware
			let newHardware
			const newSubContentStatus = hardware.description !== ''
			getHardware(hardwareId, (originalHardware) => {
				const photo = (hardware.photo.name === undefined ? originalHardware.photo : {
					name: hardwarePhotoRef.name,
					fullPath: hardwarePhotoRef.fullPath,
					size: hardware.photo.size,
					type: hardware.photo.type,
					bucket: hardwarePhotoRef.bucket,
					url: '', // URLs expire, so we get it each time the app loads, then store it in the redux tree
				})
				newHardware = Object.assign(originalHardware, newHardwareBase, photo)
				updateItemHasSubContentDB(hardwareId, newSubContentStatus) // if there wasn't a hardware description before, but was updated to have one, we want to let all related items to know. We do this because each item has a bool value that indicates if it has subcontent to be displayed. If it does the item is clickable, and when clicked displays that subcontent
			}, (err) => console.error(`Error in getHardware call within saveHardware: ${err}`))
			return newHardware
		}
	})
	.then((newHardware) => {
		return ref.child(`feed/hardwares/${hardwareId}`).set(newHardware) // saving hardwares to firebase
		.then(() => (newHardware))
	})
	.catch((err) => `Error in saveHardware: ${err}`)
}

function updateItemHasSubContentDB (hardwareId, newSubContentStatus) {
	getItems(({items, sortedItemIds}) => {
		// loop through each item. Update the ones that match the hardwareId to haveSubContent = true
		sortedItemIds.forEach((itemId) => {
			if (items[itemId].hardwareId === hardwareId) {
				return ref.child(`feed/items/${itemId}`).update({hasSubContent: newSubContentStatus}) // saving person to firebase
				.then(() => ({hasSubContent: true}))
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
		getHardware(item.hardwareId, (hardware) => {
			const newItemBase = {
				itemId: itemId,
				serial: item.serial,
				purchasedDate: item.purchasedDate.toString(),
				personId: item.personId,
				hardwareId: item.hardwareId,
				note: item.note,
				collapsed: true,
				hasSubContent: (item.note !== '' || item.photo.size !== undefined || hardware.description !== ''),
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
		} else { return Object.assign(newItemBase, {photo: {}}) }
	})
	.then((newItemBaseWithPhoto) => {
		newItem = newItemBaseWithPhoto
		return item.editing
		? (() => {
			getItem(itemId, (originalItem) => {
				return ref.child(`feed/items/${itemId}`).update(Object.assign(originalItem, newItem)) // updating edited item
			}, (err) => console.error(`Error in updating new item, api.js, within .then((newItemBaseWithPhoto)): ${err}`))
		})() // saving updated item to firebase
		: ref.child(`feed/items/${itemId}`).set(Object.assign(newItem, {
			dateCreated: new Date().toString(),
		})) // saving new item to firebase
	})
	.then(() => (newItem))
	.catch((err) => `Error in saveItem: ${err}`)
}

// START Getting Data from Firebase
function getItems (cb, errorCB) {
	ref.child('feed/items').on('value', (snapshot) => {
		const items = snapshot.val() || {}
		const sortedItemIds = Object.keys(items).sort((a, b) => items[b].dateCreated - items[a].dateCreated)
		cb({items, sortedItemIds})
	}, errorCB)
}

function getItem (itemId, cb, errorCB) {
	ref.child(`feed/items/${itemId}`).on('value', (snapshot) => {
		const item = snapshot.val() || {}
		cb(item)
	}, errorCB)
}

function getPeople (cb, errorCB) {
	ref.child('feed/people').on('value', (snapshot) => {
		const people = snapshot.val() || {}
		cb(people)
	}, errorCB)
}

export function getPerson (personId, cb, errorCB) {
	ref.child(`feed/people/${personId}`).on('value', (snapshot) => {
		const person = snapshot.val() || {}
		cb(person)
	}, errorCB)
}

function getHardwares (cb, errorCB) {
	ref.child('feed/hardwares').on('value', (snapshot) => {
		const hardware = snapshot.val() || {}
		cb(hardware)
	}, errorCB)
}

function getHardware (hardwareId, cb, errorCB) {
	ref.child(`feed/hardwares/${hardwareId}`).on('value', (snapshot) => {
		const hardware = snapshot.val() || {}
		cb(hardware)
	}, errorCB)
}

export function listenToFeed (cb, errorCB) {
	getItems(({items, sortedItemIds}) => {
		getPeople((people) => {
			getHardwares((hardwares) => cb({
				items,
				sortedItemIds,
				people,
				hardwares,
			}))
		})
	})
}
// END Getting Data from Firebase

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

