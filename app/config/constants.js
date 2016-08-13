import firebase from 'firebase'

const config = {
	apiKey: 'AIzaSyA4AJblcbzujdSNmffpLimkNGxHG-aXkPA',
	authDomain: 'equipment-manager-5a647.firebaseapp.com',
	databaseURL: 'https://equipment-manager-5a647.firebaseio.com',
	storageBucket: 'equipment-manager-5a647.appspot.com',
}

firebase.initializeApp(config)

export const ref = firebase.database().ref()
export const firebaseAuth = firebase.auth
