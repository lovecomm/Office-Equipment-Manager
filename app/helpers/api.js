import { ref } from 'config/constants'

export function saveHardware (hardware) {
	const hardwareId = ref.child('items/hardware').push().key
	ref.child(`items/hardware/${hardwareId}`).set({...hardware, hardwareId})
		.then(() => ({...hardware, hardwareId}))
}
