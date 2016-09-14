import { saveItem } from 'helpers/api'
import { addNewItemToFeed } from './feed'

const OPEN_ITEM_FORM = 'OPEN_ITEM_FORM'
const CLOSE_ITEM_FORM = 'CLOSE_ITEM_FORM'
const UPDATE_SERIAL = 'UPDATE_SERIAL'
const UPDATE_PURCHASED_DATE = 'UPDATE_PURCHASED_DATE'
const UPDATE_NOTE = 'UPDATE_NOTE'
const UPDATE_PHOTO = 'UPDATE_PHOTO'
const UPDATE_PERSON = 'UPDATE_PERSON'
const UPDATE_PERSON_ID = 'UPDATE_PERSON_ID'
const UPDATE_HARDWARE = 'UPDATE_HARDWARE'
const UPDATE_HARDWARE_ID = 'UPDATE_HARDWARE_ID'
const UPDATE_ERROR = 'UPDATE_ERROR'
const UPDATE_ITEM_ID = 'UPDATE_ITEM_ID'
const UPDATE_PHOTO_NAME = 'UPDATE_PHOTO_NAME'
const UPDATE_EDITING = 'UPDATE_EDITING'
const ADD_ITEM = 'ADD_ITEM'

// ACTIONS
function activateCurrentItem (dispatch, getState, itemId) {
	return new Promise((resolve, reject) => {
		const item = getState().items[itemId]
		dispatch(updateEditing())
		dispatch(updateItemId(item.itemId))
		dispatch(updateSerial(item.serial))
		dispatch(updatePurchasedDate(new Date(item.purchasedDate))) // purchasedDate is stored as string, coverting it back to date here.
		dispatch(updateNote(item.note))
		dispatch(updatePerson(item.personId))
		dispatch(updateHardware(item.hardwareId))
		item.photo !== undefined ? dispatch(updatePhotoName(item.photo.name)) : ''
		resolve(true)
	})
}

export function initiateItemForm (itemId) {
	return function (dispatch, getState) {
		activateCurrentItem(dispatch, getState, itemId)
		.then(() => {
			dispatch(openItemForm())
		})
		.catch((err) => console.warn(err))
	}
}

export function openItemForm () {
	return {
		type: OPEN_ITEM_FORM,
	}
}

export function closeItemForm () {
	return {
		type: CLOSE_ITEM_FORM,
	}
}

function updateEditing () {
	return {
		type: UPDATE_EDITING,
	}
}

function updateItemId (itemId) {
	return {
		type: UPDATE_ITEM_ID,
		itemId,
	}
}

export function updateSerial (serial) {
	return {
		type: UPDATE_SERIAL,
		serial,
	}
}

export function updatePurchasedDate (purchasedDate) {
	return {
		type: UPDATE_PURCHASED_DATE,
		purchasedDate,
	}
}

export function updateNote (note) {
	return {
		type: UPDATE_NOTE,
		note,
	}
}

export function updatePhoto (photo) {
	return {
		type: UPDATE_PHOTO,
		photo,
	}
}

function updatePhotoName (photoName) {
	return {
		type: UPDATE_PHOTO_NAME,
		photoName,
	}
}

function updatePerson (person) {
	return {
		type: UPDATE_PERSON,
		person,
	}
}

function updatePersonId (personId) {
	return {
		type: UPDATE_PERSON_ID,
		personId,
	}
}

export function updatePersonInfo (personId) {
	return function (dispatch, getState) {
		const person = getState().people[personId]
		const personName = `${person.firstName} ${person.lastName}`
		dispatch(updatePerson(personName))
		dispatch(updatePersonId(personId))
	}
}

function updateHardware (hardware) {
	return {
		type: UPDATE_HARDWARE,
		hardware,
	}
}

export function updateHardwareId (hardwareId) {
	return {
		type: UPDATE_HARDWARE_ID,
		hardwareId,
	}
}

export function updateHardwareInfo (hardwareId) {
	return function (dispatch, getState) {
		const hardware = getState().hardware[hardwareId]
		const hardwareName = `${hardware.make} ${hardware.model}`
		dispatch(updateHardware(hardwareName))
		dispatch(updateHardwareId(hardwareId))
	}
}

function updateError (error) {
	return {
		type: UPDATE_ERROR,
		error,
	}
}

function addItem (item) {
	return {
		type: ADD_ITEM,
		item,
	}
}

export function itemFanout (item) {
	return function (dispatch, getState) {
		const uid = getState().users.authedId
		saveItem(item, {uid: uid}) // add item to firebase
		.then((itemWithId) => {
			dispatch(addItem(itemWithId)) // add to redux store
			dispatch(addNewItemToFeed(itemWithId.itemId, itemWithId))
			dispatch(closeItemForm())
		})
		.catch((error) => {
			dispatch(updateError(error.toString()))
		})
	}
}

// REDUCERS
const initialState = {
	itemId: '',
	isOpen: false,
	purchasedDate: '',
	serial: '',
	person: '',
	personId: '',
	hardware: '',
	hardwareId: '',
	note: '',
	photo: {},
	photoName: '',
	error: '',
	editing: false,
}

export default function itemForm (state = initialState, action) {
	switch (action.type) {
	case OPEN_ITEM_FORM:
		return {
			...state,
			isOpen: true,
		}
	case CLOSE_ITEM_FORM:
		return {
			itemId: '',
			isOpen: false,
			purchasedDate: '',
			serial: '',
			person: '',
			personId: '',
			hardware: '',
			hardwareId: '',
			note: '',
			photo: {},
			photoName: '',
			error: '',
			editing: false,
		}
	case UPDATE_SERIAL:
		return {
			...state,
			serial: action.serial,
		}
	case UPDATE_PURCHASED_DATE:
		return {
			...state,
			purchasedDate: action.purchasedDate,
		}
	case UPDATE_PHOTO:
		return {
			...state,
			photo: action.photo,
			photoName: action.photo.name,
		}
	case UPDATE_PHOTO_NAME:
		return {
			...state,
			photoName: action.photoName,
		}
	case UPDATE_NOTE:
		return {
			...state,
			note: action.note,
		}
	case UPDATE_PERSON:
		return {
			...state,
			person: action.person,
		}
	case UPDATE_PERSON_ID:
		return {
			...state,
			personId: action.personId,
		}
	case UPDATE_HARDWARE:
		return {
			...state,
			hardware: action.hardware,
		}
	case UPDATE_HARDWARE_ID:
		return {
			...state,
			hardwareId: action.hardwareId,
		}
	case UPDATE_ITEM_ID:
		return {
			...state,
			itemId: action.itemId,
		}
	case UPDATE_ERROR:
		return {
			...state,
			error: action.error,
		}
	case UPDATE_EDITING:
		return {
			...state,
			editing: true,
		}
	case ADD_ITEM:
		return {
			...state,
			[action.item.itemId]: action.item,
		}
	default:
		return state
	}
}
