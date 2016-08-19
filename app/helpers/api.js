import { ref, imagesRef } from 'config/constants'

export function saveHardware (hardware, uid) {
	const hardwareId = ref.child('items/hardware').push().key
	const hardwarePhotoRef = imagesRef.child(`hardware/${hardware.photoInfo.name}`) // Create a reference to hardware image in firebase

	hardwarePhotoRef.put(hardware.photoInfo) // Store photo to firebase

	const newHardware = {
		make: hardware.make,
		model: hardware.model,
		description: hardware.description,
		photoInfo: {
			name: hardwarePhotoRef.name,
			fullPath: hardwarePhotoRef.fullPath,
			bucket: hardwarePhotoRef.bucket,
		},
		dateCreated: Date.now(),
		dateLastUpdated: Date.now(),
	}

	return ref.child(`items/hardware/${hardwareId}`).set({...newHardware, hardwareId})
		.then(() => ({...newHardware, hardwareId}))
}
