import { ref, imagesRef, storageRef } from 'config/constants'

// Get firebase imagesRef
export function firebaseHref (fullPath) {
	return storageRef.child(fullPath).getDownloadURL()
	.then((url) => {
		return url
	}).catch(function (error) {
		console.warn(error)
	})
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
		}, (error) => console.warn(error))
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
		return photoSnapshot
		? firebaseHref(hardwarePhotoRef.fullPath) // is new hardware, or updating existing hardware with a new photo
		: undefined // is updating existing hardware, and does not have an updated photo
	})
	.then((url) => {
		if (url && !hardware.editing) { // it's a new hardware
			return Object.assign(newHardwareBase, {
				photo: {
					name: hardwarePhotoRef.name,
					fullPath: hardwarePhotoRef.fullPath,
					size: hardware.photo.size,
					type: hardware.photo.type,
					bucket: hardwarePhotoRef.bucket,
					url: url,
				},
				dateCreated: new Date().toString(),
			})
		} else { // updating existing hardware
			let newHardware
			const newSubContentStatus = hardware.description !== ''
			getHardware(hardwareId, (originalHardware) => {
				const photo = (url === undefined ? originalHardware.photo : {
					name: hardwarePhotoRef.name,
					fullPath: hardwarePhotoRef.fullPath,
					size: hardware.photo.size,
					type: hardware.photo.type,
					bucket: hardwarePhotoRef.bucket,
					url: url,
				})
				newHardware = Object.assign(originalHardware, newHardwareBase, photo)
				updateItemHasSubContentDB(hardwareId, newSubContentStatus) // if there wasn't a hardware description before, but was updated to have one, we want to let all related items to know. We do this because each item has a bool value that indicates if it has subcontent to be displayed. If it does the item is clickable, and when clicked displays that subcontent
			}, (err) => console.error(err))
			return newHardware
		}
	})
	.then((newHardware) => {
		return ref.child(`feed/hardwares/${hardwareId}`).set(newHardware) // saving hardwares to firebase
		.then(() => (newHardware))
	})
}

function updateItemHasSubContentDB (hardwareId, newSubContentStatus) {
	getItems(({items, sortedItemIds}) => {
		// loop through each item. Update the ones that match the hardwareId to haveSubContent = true
		sortedItemIds.forEach((itemId) => {
			if (items[itemId].hardwareId === hardwareId) {
				return ref.child(`feed/items/${itemId}`).update({hasSubContent: newSubContentStatus}) // saving person to firebase
				.then(() => ({hasSubContent: true}))
			}
		})
	}, (err) => console.error(err))
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
		}, (error) => console.warn(error))
	})
}

export function savePerson (person, uid) {
	const personId = person.editing ? person.personId : ref.child('feed/people').push().key
	return verifyPerson(person)
	.then(() => {
		const personBase = {
			personId,
			firstName: person.firstName,
			lastName: person.lastName,
			createdBy: uid.uid,
			dateLastUpdated: new Date().toString(),
		}
		if (!person.editing) {
			const newPerson = {
				...personBase,
				dateCreated: new Date().toString(),
			}
			return ref.child(`feed/people/${personId}`).set({...newPerson}) // saving person to firebase
				.then(() => ({...newPerson}))
		} else {
			return ref.child(`feed/people/${personId}`).update({...personBase}) // saving person to firebase
				.then(() => ({...personBase}))
		}
	})
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
						}, (err) => console.error(err))
					}
				}
			}
			// Mark as verified if email and fullname is not in use
			resolve(true)
		}, (error) => console.error(error))
	})
}

export function saveItem (item, uid) {
	const isBeingEdited = item.itemId !== ''
	const itemId = isBeingEdited ? item.itemId : ref.child('feed/items').push().key
	return verifyItem(item, isBeingEdited)
	.then(() => {
		return new Promise((resolve, reject) => {
			getHardware(item.hardwareId, (hardware) => {
				let newItem = {
					itemId: itemId,
					serial: item.serial,
					purchasedDate: item.purchasedDate.toString(),
					personId: item.personId,
					hardwareId: item.hardwareId,
					note: item.note,
					collapsed: true,
					hasSubContent: (item.note !== '' || item.photo.size !== undefined || hardware.description !== ''),
					createdBy: uid.uid,
					dateCreated: new Date().toString(),
					dateLastUpdated: new Date().toString(),
				}
				if (item.photo.size) { // if size exists, photo exists
					const itemPhotoRef = imagesRef.child(`items/${item.photo.name}`) // Get ref for person photo
					resolve(itemPhotoRef.put(item.photo) // saving person photo to firebase
					.then((photoSnapshot) => {
						return firebaseHref(itemPhotoRef.fullPath).then((url) => {
							const photo = {
								name: itemPhotoRef.name,
								fullPath: itemPhotoRef.fullPath,
								size: item.photo.size,
								type: item.photo.type,
								bucket: itemPhotoRef.bucket,
								url: url,
							}
							if (isBeingEdited) {
								return ref.child(`feed/items/${itemId}`).update({...newItem, photo}) // saving new item to firebase
									.then(() => ({...newItem, photo}))
							} else {
								return ref.child(`feed/items/${itemId}`).set({...newItem, photo}) // saving new item to firebase
									.then(() => ({...newItem, photo}))
							}
						})
					}))
				} else {
					if (isBeingEdited) {
						return resolve(ref.child(`feed/items/${itemId}`).update({...newItem}) // saving new item to firebase
							.then(() => ({...newItem})))
					} else {
						return resolve(ref.child(`feed/items/${itemId}`).set({...newItem}) // saving new item to firebase
							.then(() => ({...newItem})))
					}
				}
			}, (err) => console.warn(err))
		})
	})
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
				})
			}, (err) => console.error(err))
		})
	case 'hardwares':
		return ref.child(`feed/hardwares/${dataId}`).remove()
		.then(() => {
			getItems(({items}) => {
				for (const itemId in items) {
					if (items[itemId].hardwareId === dataId) {
						ref.child(`feed/items/${itemId}`).remove() // delete all items that use this hardware
					}
				}
			}, (err) => console.error(err))
		})
	default: // items
		return ref.child(`feed/items/${dataId}`).remove()
	}
}

