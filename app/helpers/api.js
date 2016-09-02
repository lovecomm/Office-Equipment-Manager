import { ref, imagesRef } from 'config/constants'

export function saveHardware (hardware, uid) {
	const hardwareId = ref.child('feed/hardware').push().key
	const hardwarePhotoRef = imagesRef.child(`hardware/${hardware.photo.name}`) // Create a reference to hardware image in firebase

	hardwarePhotoRef.put(hardware.photo) // Store photo to firebase

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
		},
		dateCreated: Date.now(),
		dateLastUpdated: Date.now(),
	}

	return ref.child(`feed/hardware/${hardwareId}`).set({...newHardware, hardwareId}) // saving hardware to firebase
		.then(() => ({...newHardware, hardwareId}))
}

export function savePeople (person, uid) {
	const personId = ref.child('feed/people').push().key
	const personPhotoRef = imagesRef.child(`people/${person.photo.name}`) // Get ref for person photo

	personPhotoRef.put(person.photo) // saving person photo to firebase

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
		},
		dateCreated: Date.now(),
		dateLastUpdated: Date.now(),
	}

	return ref.child(`feed/people/${personId}`).set({...newPerson, personId}) // saving person to firebase
		.then(() => ({...newPerson, personId}))
}

function getItems (cb, errorCB) {
	ref.child('feed/people').on('value', (snapshot) => {
		const items = snapshot.val() || {}
		const sortedItemIds = Object.keys(items).sort((a, b) => items[b].dateCreated - items[a].dateCreated)
		cb({items, sortedItemIds})
	}, errorCB)
}

function getPeople (cb, errorCB) {
	ref.child('feed/people').on('value', (snapshot) => {
		const people = snapshot.val() || {}
		const sortedPeopleIds = Object.keys(people).sort((a, b) => people[b].dateCreated - people[a].dateCreated)
		cb({people, sortedPeopleIds})
	}, errorCB)
}

export function listenToFeed (cb, errorCB) {
	getItems(({items, sortedItemIds}) => {
		getPeople(({people, sortedPeopleIds}) => cb({items, sortedItemIds, people, sortedPeopleIds}))
	})
}