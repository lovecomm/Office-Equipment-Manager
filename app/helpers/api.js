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

export function saveHardware (hardware, uid) {
	const hardwareId = ref.child('feed/hardware').push().key
	const hardwarePhotoRef = imagesRef.child(`hardware/${hardware.photo.name}`) // Create a reference to hardware image in firebase
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
			}

			return ref.child(`feed/hardware/${hardwareId}`).set({...newHardware, hardwareId}) // saving hardware to firebase
				.then(() => ({...newHardware, hardwareId}))
		})
	})
}

export function savePeople (person, uid) {
	const personId = ref.child('feed/people').push().key
	const personPhotoRef = imagesRef.child(`people/${person.photo.name}`) // Get ref for person photo

	return personPhotoRef.put(person.photo) // saving person photo to firebase
	.then((photoSnapshot) => {
		return firebaseHref(personPhotoRef.fullPath).then((url) => {
			const newPerson = {
				firstName: person.firstName,
				lastName: person.lastName,
				email: person.email,
				photo: {
					name: personPhotoRef.name,
					fullPath: personPhotoRef.fullPath,
					size: person.photo.size,
					type: person.photo.type,
					bucket: personPhotoRef.bucket,
					url: url,
				},
				dateCreated: new Date().toString(),
				dateLastUpdated: new Date().toString(),
			}
			return ref.child(`feed/people/${personId}`).set({...newPerson, personId}) // saving person to firebase
				.then(() => ({...newPerson, personId}))
		})
	})
}

export function saveItem (item, uid) {
	const itemId = ref.child('feed/items').push().key
	return new Promise((resolve, reject) => {
		getSingleHardware(item.itemHardwareId, (hardware) => {
			let newItem = {
				serial: item.serial,
				purchasedAtDate: item.purchasedAtDate.toString(),
				itemPersonId: item.itemPersonId,
				itemHardwareId: item.itemHardwareId,
				notes: item.notes,
				collapsed: true,
				hasSubContent: (item.notes !== '' && item.photo.size !== undefined && hardware.description !== ''),
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
						return ref.child(`feed/items/${itemId}`).set({...newItem, photo, itemId}) // saving item to firebase
							.then(() => ({...newItem, photo, itemId}))
					})
				}))
			} else {
				resolve(ref.child(`feed/items/${itemId}`).set({...newItem, itemId}) // saving item to firebase
					.then(() => ({...newItem, itemId})))
			}
		}, (err) => console.warn(err))
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
