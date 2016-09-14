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

function verifyHardware (aHardware) {
	return new Promise((resolve, reject) => {
		getHardware((hardware) => {
			for (const hardwareId in hardware) {
				// Test for Make & Model duplicate
				if (`${hardware[hardwareId].make} ${hardware[hardwareId].model}`.toUpperCase()	===
				`${aHardware.make} ${aHardware.model}`.toUpperCase()) {
					reject(`Sorry, but the hardware, ${aHardware.make} ${aHardware.model} is already registered.`)
				}
			}
			// Mark as verified if email and fullname is not in use
			resolve(true)
		}, (error) => console.warn(error))
	})
}

export function saveHardware (hardware, uid) {
	const hardwareId = ref.child('feed/hardware').push().key
	const hardwarePhotoRef = imagesRef.child(`hardware/${hardware.photo.name}`) // Create a reference to hardware image in firebase
	return verifyHardware(hardware)
	.then((isVerified) => {
		if (isVerified) {
			return hardwarePhotoRef.put(hardware.photo) // Store photo to firebase
			.then((photoSnapshot) => {
				return firebaseHref(hardwarePhotoRef.fullPath).then((url) => {
					const newHardware = {
						make: hardware.make,
						model: hardware.model,
						description: hardware.description,
						photo: {
							name: hardwarePhotoRef.name,
							fullPath: hardwarePhotoRef.fullPath,
							size: hardware.photo.size,
							type: hardware.photo.type,
							bucket: hardwarePhotoRef.bucket,
							url: url,
						},
						isComputer: hardware.isComputer,
						dateCreated: new Date().toString(),
						dateLastUpdated: new Date().toString(),
						createdBy: uid.uid,
					}

					return ref.child(`feed/hardware/${hardwareId}`).set({...newHardware, hardwareId}) // saving hardware to firebase
						.then(() => ({...newHardware, hardwareId}))
				})
			})
		}
	})
}

function verifyPerson (person) {
	return new Promise((resolve, reject) => {
		getPeople((people) => {
			for (const peopleId in people) {
				// Test for full name duplicate
				if (`${people[peopleId].firstName} ${people[peopleId].lastName}`.toUpperCase()	===
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
	.then((isVerified) => {
		if (verifyPerson) {
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
						getSingleItem(item.itemId, (storedItem) => {
							storedItem.serial !== item.serial
							? reject(`Sorry, but the serial number, ${item.serial} is already in use.`)
							: resolve(true)
						}, (err) => console.warn(err))
					}
				}
			}
			// Mark as verified if email and fullname is not in use
			resolve(true)
		}, (error) => console.warn(error))
	})
}

export function saveItem (item, uid) {
	const isBeingEdited = item.itemId !== ''
	const itemId = isBeingEdited ? item.itemId : ref.child('feed/items').push().key
	return verifyItem(item, isBeingEdited)
	.then((isVerified) => {
		if (isVerified) {
			return new Promise((resolve, reject) => {
				getSingleHardware(item.itemHardwareId, (hardware) => {
					let newItem = {
						itemId: itemId,
						serial: item.serial,
						purchasedAtDate: item.purchasedAtDate.toString(),
						itemPersonId: item.itemPersonId,
						itemHardwareId: item.itemHardwareId,
						notes: item.notes,
						collapsed: true,
						hasSubContent: (item.notes !== '' || item.photo.size !== undefined || hardware.description !== ''),
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
							resolve(ref.child(`feed/items/${itemId}`).update({...newItem}) // saving new item to firebase
								.then(() => ({...newItem})))
						} else {
							resolve(ref.child(`feed/items/${itemId}`).set({...newItem}) // saving new item to firebase
								.then(() => ({...newItem})))
						}
					}
				}, (err) => console.warn(err))
			})
		}
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

function getSingleItem (itemId, cb, errorCB) {
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

function getHardware (cb, errorCB) {
	ref.child('feed/hardware').on('value', (snapshot) => {
		const hardware = snapshot.val() || {}
		cb(hardware)
	}, errorCB)
}

function getSingleHardware (hardwareId, cb, errorCB) {
	ref.child(`feed/hardware/${hardwareId}`).on('value', (snapshot) => {
		const hardware = snapshot.val() || {}
		cb(hardware)
	}, errorCB)
}

export function listenToFeed (cb, errorCB) {
	getItems(({items, sortedItemIds}) => {
		getPeople((people) => {
			getHardware((hardware) => cb({
				items,
				sortedItemIds,
				people,
				hardware,
			}))
		})
	})
}
// END Getting Data from Firebase
