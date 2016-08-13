import { ref, firebaseAuth } from 'config/constants'

export default function auth (email, password) {
	return firebaseAuth().signInWithEmailAndPassword(email, password)
		.catch(function (error) {
			const errorCode = error.code
			const errorMessage = error.message
			return { error: `${errorCode}: ${errorMessage}`	}
		})
}

export function checkIfAuthed (store) {
	// Ignore firebase for now.
	return store.getState().isAuthed
}
