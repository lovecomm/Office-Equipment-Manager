import firebase from 'firebase'
import { config } from 'config/conf'

firebase.initializeApp(config)

export const ref = firebase.database().ref()
export const firebaseAuth = firebase.auth
export const storageRef = firebase.storage().ref()
export const imagesRef = storageRef.child('images')
