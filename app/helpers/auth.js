import { ref, firebaseAuth } from 'config/constants'

export default function auth (email, password) {
	return firebaseAuth().signInWithEmailAndPassword(email, password)
}

export function checkIfAuthed (store) {
	return store.getState().users.isAuthed === true
}

export function logout () {
	return firebaseAuth().signOut()
}

export function saveUser (user) {
	return ref.child(`users/${user.uid}`) // ref is the root of your database... calling .child() will nest itself in the database
		.set(user) // Saves to the location specified in the child() params
		.then(() => user) // just passing user back after this is done, making it easier for chaining
}
