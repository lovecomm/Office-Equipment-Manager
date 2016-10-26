import { saveNewItem, saveUpdatedItem } from 'helpers/api'
import { addNewItemToFeed } from './feed'
// import { updateItemInFeed } from './items'

const OPEN_ITEM_FORM = 'OPEN_ITEM_FORM'
const CLOSE_ITEM_FORM = 'CLOSE_ITEM_FORM'
const UPDATE_ITEM_FORM_SERIAL = 'UPDATE_ITEM_FORM_SERIAL'
const UPDATE_ITEM_FORM_PURCHASED_DATE = 'UPDATE_ITEM_FORM_PURCHASED_DATE'
const UPDATE_ITEM_FORM_NOTE = 'UPDATE_ITEM_FORM_NOTE'
const UPDATE_ITEM_FORM_PHOTO = 'UPDATE_ITEM_FORM_PHOTO'
const UPDATE_ITEM_FORM_PERSON = 'UPDATE_ITEM_FORM_PERSON'
const UPDATE_ITEM_FORM_PERSON_ID = 'UPDATE_ITEM_FORM_PERSON_ID'
const UPDATE_ITEM_FORM_HARDWARE = 'UPDATE_ITEM_FORM_HARDWARE'
const UPDATE_ITEM_FORM_HARDWARE_ID = 'UPDATE_ITEM_FORM_HARDWARE_ID'
const UPDATE_ITEM_FORM_ERROR = 'UPDATE_ITEM_FORM_ERROR'
const UPDATE_ITEM_FORM_IS_SUBMITTING = 'UPDATE_ITEM_FORM_IS_SUBMITTING'
const UPDATE_ITEM_FORM_ITEM_ID = 'UPDATE_ITEM_FORM_ITEM_ID'
const UPDATE_ITEM_FORM_PHOTO_NAME = 'UPDATE_ITEM_FORM_PHOTO_NAME'
const UPDATE_ITEM_FORM_EDITING = 'UPDATE_ITEM_FORM_EDITING'

// ACTIONS
function activateCurrentItem (dispatch, getState, itemId) {
	return new Promise((resolve, reject) => {
		const item = getState().items[itemId]
		const person = getState().peopleFeed.people[item.personId]
		const hardware = getState().hardwares[item.hardwareId]
		dispatch(updateItemFormEditing())
		dispatch(updateItemFormItemId(item.itemId))
		dispatch(updateItemFormSerial(item.serial))
		dispatch(updateItemFormPurchasedDate(new Date(item.purchasedDate))) // purchasedDate is stored as string, coverting it back to date here.
		dispatch(updateItemFormNote(item.note))
		dispatch(updateItemFormPersonId(item.personId))
		dispatch(updateItemFormHardwareId(item.hardwareId))
		dispatch(updateItemFormPerson(`${person.firstName} ${person.lastName}`))
		dispatch(updateItemFormHardware(`${hardware.make} ${hardware.model}`))
		if (item.photo !== {} && item.photo !== undefined && item.photo.name !== undefined) dispatch(updateItemFormPhotoName(item.photo.name))
		resolve(true)
	})
}

export function initiateItemForm (itemId) {
	return function (dispatch, getState) {
		activateCurrentItem(dispatch, getState, itemId)
		.then(() => {
			dispatch(openItemForm())
		})
		.catch((err) => console.warn(`Error in initiateItemForm: ${err}`))
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

export function updateItemFormIsSubmitting (isSubmitting) {
	return {
		type: UPDATE_ITEM_FORM_IS_SUBMITTING,
		isSubmitting,
	}
}

function updateItemFormEditing () {
	return {
		type: UPDATE_ITEM_FORM_EDITING,
	}
}

function updateItemFormItemId (itemId) {
	return {
		type: UPDATE_ITEM_FORM_ITEM_ID,
		itemId,
	}
}

export function updateItemFormSerial (serial) {
	return {
		type: UPDATE_ITEM_FORM_SERIAL,
		serial,
	}
}

export function updateItemFormPurchasedDate (purchasedDate) {
	return {
		type: UPDATE_ITEM_FORM_PURCHASED_DATE,
		purchasedDate,
	}
}

export function updateItemFormNote (note) {
	return {
		type: UPDATE_ITEM_FORM_NOTE,
		note,
	}
}

export function updateItemFormPhoto (photo) {
	return {
		type: UPDATE_ITEM_FORM_PHOTO,
		photo,
	}
}

function updateItemFormPhotoName (photoName) {
	return {
		type: UPDATE_ITEM_FORM_PHOTO_NAME,
		photoName,
	}
}

function updateItemFormPerson (person) {
	return {
		type: UPDATE_ITEM_FORM_PERSON,
		person,
	}
}

function updateItemFormPersonId (personId) {
	return {
		type: UPDATE_ITEM_FORM_PERSON_ID,
		personId,
	}
}

export function updateItemFormPersonInfo (personId) {
	return function (dispatch, getState) {
		const person = getState().peopleFeed.people[personId]
		const personName = `${person.firstName} ${person.lastName}`
		dispatch(updateItemFormPerson(personName))
		dispatch(updateItemFormPersonId(personId))
	}
}

function updateItemFormHardware (hardware) {
	return {
		type: UPDATE_ITEM_FORM_HARDWARE,
		hardware,
	}
}

export function updateItemFormHardwareId (hardwareId) {
	return {
		type: UPDATE_ITEM_FORM_HARDWARE_ID,
		hardwareId,
	}
}

export function updateItemFormHardwareInfo (hardwareId) {
	return function (dispatch, getState) {
		const hardware = getState().hardwares[hardwareId]
		const hardwareName = `${hardware.make} ${hardware.model}`
		dispatch(updateItemFormHardware(hardwareName))
		dispatch(updateItemFormHardwareId(hardwareId))
	}
}

function updateItemFormError (error) {
	return {
		type: UPDATE_ITEM_FORM_ERROR,
		error,
	}
}

export function newItemFanout (item) {
	return function (dispatch, getState) {
		const associatedHardware = getState().hardwares[item.hardwareId]
		saveNewItem(getState().items, item, getState().users.authedId, associatedHardware)
		.then((itemWithId) => {
			dispatch(addNewItemToFeed(itemWithId.itemId))
			dispatch(closeItemForm())
		})
		.catch((err) => dispatch(updateItemFormError(err.toString())))
	}
}

export function updateItemFanout (item) {
	return function (dispatch, getState) {
		const associatedHardware = getState().hardwares[item.hardwareId]
		saveUpdatedItem(getState().items, item, getState().users.authedId, associatedHardware)
		.then((itemWithId) => dispatch(closeItemForm()))
		.catch((err) => dispatch(updateItemFormError(err.toString())))
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
	isSubmitting: false,
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
		return initialState
	case UPDATE_ITEM_FORM_SERIAL:
		return {
			...state,
			serial: action.serial,
		}
	case UPDATE_ITEM_FORM_PURCHASED_DATE:
		return {
			...state,
			purchasedDate: action.purchasedDate,
		}
	case UPDATE_ITEM_FORM_PHOTO:
		return {
			...state,
			photo: action.photo,
			photoName: action.photo.name,
		}
	case UPDATE_ITEM_FORM_PHOTO_NAME:
		return {
			...state,
			photoName: action.photoName,
		}
	case UPDATE_ITEM_FORM_NOTE:
		return {
			...state,
			note: action.note,
		}
	case UPDATE_ITEM_FORM_PERSON:
		return {
			...state,
			person: action.person,
		}
	case UPDATE_ITEM_FORM_PERSON_ID:
		return {
			...state,
			personId: action.personId,
		}
	case UPDATE_ITEM_FORM_HARDWARE:
		return {
			...state,
			hardware: action.hardware,
		}
	case UPDATE_ITEM_FORM_HARDWARE_ID:
		return {
			...state,
			hardwareId: action.hardwareId,
		}
	case UPDATE_ITEM_FORM_ITEM_ID:
		return {
			...state,
			itemId: action.itemId,
		}
	case UPDATE_ITEM_FORM_ERROR:
		return {
			...state,
			error: action.error,
		}
	case UPDATE_ITEM_FORM_EDITING:
		return {
			...state,
			editing: true,
		}
	case UPDATE_ITEM_FORM_IS_SUBMITTING:
		return {
			...state,
			isSubmitting: action.isSubmitting,
		}
	default:
		return state
	}
}
