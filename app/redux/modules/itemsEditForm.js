import { saveItem } from 'helpers/api'

const OPEN_ITEM_EDIT_FORM = 'OPEN_ITEM_EDIT_FORM'
const CLOSE_ITEM_EDIT_FORM = 'CLOSE_ITEM_EDIT_FORM'
const UPDATE_ITEM_EDIT_FORM_ITEMID = 'UPDATE_ITEM_EDIT_FORM_ITEMID'
const UPDATE_ITEM_EDIT_FORM_SERIAL = 'UPDATE_ITEM_EDIT_FORM_SERIAL'
const UPDATE_ITEM_EDIT_FORM_PURCHASED_AT_DATE = 'UPDATE_ITEM_EDIT_FORM_PURCHASED_AT_DATE'
const UPDATE_ITEM_EDIT_FORM_NOTES = 'UPDATE_ITEM_EDIT_FORM_NOTES'
const UPDATE_ITEM_EDIT_FORM_PHOTO = 'UPDATE_ITEM_EDIT_FORM_PHOTO'
const UPDATE_ITEM_EDIT_FORM_PERSON = 'UPDATE_ITEM_EDIT_FORM_PERSON'
const UPDATE_ITEM_EDIT_FORM_PERSON_ID = 'UPDATE_ITEM_EDIT_FORM_PERSON_ID'
const UPDATE_ITEM_EDIT_FORM_HARDWARE = 'UPDATE_ITEM_EDIT_FORM_HARDWARE'
const UPDATE_ITEM_EDIT_FORM_HARDWARE_ID = 'UPDATE_ITEM_EDIT_FORM_HARDWARE_ID'
const UPDATE_ITEM_EDIT_FORM_ERROR = 'UPDATE_ITEM_EDIT_FORM_ERROR'
const UPDATE_ITEM_EDIT_FORM_PHOTO_NAME = 'UPDATE_ITEM_EDIT_FORM_PHOTO_NAME'
const SAVE_EDITED_ITEM = 'SAVE_EDITED_ITEM'

// ACTIONS
function activateCurrentItem (dispatch, getState, itemId) {
	return new Promise((resolve, reject) => {
		const item = getState().items[itemId]
		dispatch(updateItemEditFormItemId(item.itemId))
		dispatch(updateItemEditFormSerial(item.serial))
		dispatch(updateItemEditFormPurchasedAtDate(new Date(item.purchasedAtDate))) // purchasedAtDate is stored as string, coverting it back to date here.
		dispatch(updateItemEditFormNotes(item.notes))
		dispatch(updateItemEditFormPersonInfo(item.itemPersonId))
		dispatch(updateItemEditFormHardwareInfo(item.itemHardwareId))
		item.photo !== undefined ? dispatch(updateItemEditFormPhotoName(item.photo.name)) : ''
		resolve(true)
	})
}

export function initiateItemsEditForm (itemId) {
	return function (dispatch, getState) {
		activateCurrentItem(dispatch, getState, itemId)
		.then(() => {
			dispatch(openItemEditForm())
		})
		.catch((err) => console.warn(err))
	}
}

function openItemEditForm () {
	return {
		type: OPEN_ITEM_EDIT_FORM,
	}
}

export function closeItemEditForm () {
	return {
		type: CLOSE_ITEM_EDIT_FORM,
	}
}

function updateItemEditFormItemId (itemId) {
	return {
		type: UPDATE_ITEM_EDIT_FORM_ITEMID,
		itemId,
	}
}

export function updateItemEditFormSerial (serial) {
	return {
		type: UPDATE_ITEM_EDIT_FORM_SERIAL,
		serial,
	}
}

export function updateItemEditFormPurchasedAtDate (purchasedAtDate) {
	return {
		type: UPDATE_ITEM_EDIT_FORM_PURCHASED_AT_DATE,
		purchasedAtDate,
	}
}

export function updateItemEditFormNotes (notes) {
	return {
		type: UPDATE_ITEM_EDIT_FORM_NOTES,
		notes,
	}
}

export function updateItemEditFormPhoto (photo) {
	return {
		type: UPDATE_ITEM_EDIT_FORM_PHOTO,
		photo,
	}
}

export function updateItemEditFormPhotoName (photoNames) {
	return {
		type: UPDATE_ITEM_EDIT_FORM_PHOTO_NAME,
		photoNames,
	}
}

function updateItemEditFormPerson (itemPerson) {
	return {
		type: UPDATE_ITEM_EDIT_FORM_PERSON,
		itemPerson,
	}
}

function updateItemEditFormPersonId (itemPersonId) {
	return {
		type: UPDATE_ITEM_EDIT_FORM_PERSON_ID,
		itemPersonId,
	}
}

export function updateItemEditFormPersonInfo (itemPersonId) {
	return function (dispatch, getState) {
		const person = getState().people[itemPersonId]
		const personName = `${person.firstName} ${person.lastName}`
		dispatch(updateItemEditFormPerson(personName))
		dispatch(updateItemEditFormPersonId(itemPersonId))
	}
}

function updateItemEditFormHardware (itemHardware) {
	return {
		type: UPDATE_ITEM_EDIT_FORM_HARDWARE,
		itemHardware,
	}
}

export function updateItemEditFormHardwareId (itemHardwareId) {
	return {
		type: UPDATE_ITEM_EDIT_FORM_HARDWARE_ID,
		itemHardwareId,
	}
}

export function updateItemEditFormHardwareInfo (itemHardwareId) {
	return function (dispatch, getState) {
		const hardware = getState().hardware[itemHardwareId]
		const hardwareName = `${hardware.make} ${hardware.model}`
		dispatch(updateItemEditFormHardware(hardwareName))
		dispatch(updateItemEditFormHardwareId(itemHardwareId))
	}
}

function updateItemEditFormError (error) {
	return {
		type: UPDATE_ITEM_EDIT_FORM_ERROR,
		error,
	}
}

function saveEditedItem (item) {
	return {
		type: SAVE_EDITED_ITEM,
		item,
	}
}

export function itemEditedFanout (item) {
	return function (dispatch, getState) {
		const uid = getState().users.authedId
		saveItem(item, {uid: uid}) // add item to firebase
		.then((itemWithId) => {
			dispatch(saveEditedItem(itemWithId)) // add to redux store
			dispatch(closeItemEditForm())
		})
		.catch((error) => {
			dispatch(updateItemEditFormError(error.toString()))
		})
	}
}

// REDUCERS
const initialState = {
	itemId: '',
	isOpen: false,
	purchasedAtDate: '',
	serial: '',
	itemPerson: '',
	itemPersonId: '',
	itemHardware: '',
	itemHardwareId: '',
	notes: '',
	photo: {},
	photoNames: '',
	error: '',
}

export default function itemsEditForm (state = initialState, action) {
	switch (action.type) {
	case OPEN_ITEM_EDIT_FORM:
		return {
			...state,
			isOpen: true,
		}
	case CLOSE_ITEM_EDIT_FORM:
		return {
			itemId: '',
			isOpen: false,
			purchasedAtDate: '',
			serial: '',
			itemPerson: '',
			itemPersonId: '',
			itemHardware: '',
			itemHardwareId: '',
			notes: '',
			photo: {},
			photoNames: '',
			error: '',
		}
	case UPDATE_ITEM_EDIT_FORM_ITEMID:
		return {
			...state,
			itemId: action.itemId,
		}
	case UPDATE_ITEM_EDIT_FORM_SERIAL:
		return {
			...state,
			serial: action.serial,
		}
	case UPDATE_ITEM_EDIT_FORM_PURCHASED_AT_DATE:
		return {
			...state,
			purchasedAtDate: action.purchasedAtDate,
		}
	case UPDATE_ITEM_EDIT_FORM_PHOTO:
		return {
			...state,
			photo: action.photo,
			photoNames: action.photo.name,
		}
	case UPDATE_ITEM_EDIT_FORM_PHOTO_NAME:
		return {
			...state,
			photoNames: action.photoNames
		}
	case UPDATE_ITEM_EDIT_FORM_NOTES:
		return {
			...state,
			notes: action.notes,
		}
	case UPDATE_ITEM_EDIT_FORM_PERSON:
		return {
			...state,
			itemPerson: action.itemPerson,
		}
	case UPDATE_ITEM_EDIT_FORM_PERSON_ID:
		return {
			...state,
			itemPersonId: action.itemPersonId,
		}
	case UPDATE_ITEM_EDIT_FORM_HARDWARE:
		return {
			...state,
			itemHardware: action.itemHardware,
		}
	case UPDATE_ITEM_EDIT_FORM_HARDWARE_ID:
		return {
			...state,
			itemHardwareId: action.itemHardwareId,
		}
	case UPDATE_ITEM_EDIT_FORM_ERROR:
		return {
			...state,
			error: action.error,
		}
	case SAVE_EDITED_ITEM:
		return {
			...state,
			[action.item.itemId]: action.item,
		}
	default:
		return state
	}
}
