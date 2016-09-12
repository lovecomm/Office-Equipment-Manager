import { saveItem } from 'helpers/api'
import { addNewItemToFeed } from './feed'

const OPEN_ITEMS_FORM = 'OPEN_ITEMS_FORM'
const CLOSE_ITEMS_FORM = 'CLOSE_ITEMS_FORM'
const UPDATE_ITEMS_SERIAL = 'UPDATE_ITEMS_SERIAL'
const UPDATE_ITEMS_PURCHASED_AT_DATE = 'UPDATE_ITEMS_PURCHASED_AT_DATE'
const UPDATE_ITEMS_FORM_NOTES = 'UPDATE_ITEMS_FORM_NOTES'
const UPDATE_ITEMS_FORM_PHOTOS = 'UPDATE_ITEMS_FORM_PHOTOS'
const UPDATE_ITEM_PERSON = 'UPDATE_ITEM_PERSON'
const UPDATE_ITEM_PERSON_ID = 'UPDATE_ITEM_PERSON_ID'
const UPDATE_ITEM_HARDWARE = 'UPDATE_ITEM_HARDWARE'
const UPDATE_ITEM_HARDWARE_ID = 'UPDATE_ITEM_HARDWARE_ID'
const UPDATE_ITEM_FORM_ERROR = 'UPDATE_ITEM_FORM_ERROR'
const ADD_ITEM = 'ADD_ITEM'

// ACTIONS
export function openItemsForm () {
	return {
		type: OPEN_ITEMS_FORM,
	}
}

export function closeItemsForm () {
	return {
		type: CLOSE_ITEMS_FORM,
	}
}

export function updateSerial (serial) {
	return {
		type: UPDATE_ITEMS_SERIAL,
		serial,
	}
}

export function updatePurchasedAtDate (purchasedAtDate) {
	return {
		type: UPDATE_ITEMS_PURCHASED_AT_DATE,
		purchasedAtDate,
	}
}

export function updateFormNotes (notes) {
	return {
		type: UPDATE_ITEMS_FORM_NOTES,
		notes,
	}
}

export function updateFormPhotos (photo) {
	return {
		type: UPDATE_ITEMS_FORM_PHOTOS,
		photo,
	}
}

function updateItemPerson (itemPerson) {
	return {
		type: UPDATE_ITEM_PERSON,
		itemPerson,
	}
}

function updateItemPersonId (itemPersonId) {
	return {
		type: UPDATE_ITEM_PERSON_ID,
		itemPersonId,
	}
}

export function updateItemPersonInfo (itemPersonId) {
	return function (dispatch, getState) {
		const person = getState().people[itemPersonId]
		const personName = `${person.firstName} ${person.lastName}`
		dispatch(updateItemPerson(personName))
		dispatch(updateItemPersonId(itemPersonId))
	}
}

function updateItemHardware (itemHardware) {
	return {
		type: UPDATE_ITEM_HARDWARE,
		itemHardware,
	}
}

export function updateItemHardwareId (itemHardwareId) {
	return {
		type: UPDATE_ITEM_HARDWARE_ID,
		itemHardwareId,
	}
}

export function updateItemHardwareInfo (itemHardwareId) {
	return function (dispatch, getState) {
		const hardware = getState().hardware[itemHardwareId]
		const hardwareName = `${hardware.make} ${hardware.model}`
		dispatch(updateItemHardware(hardwareName))
		dispatch(updateItemHardwareId(itemHardwareId))
	}
}

function updateItemFormError (error) {
	return {
		type: UPDATE_ITEM_FORM_ERROR,
		error,
	}
}

function addItem (item) {
	return {
		type: ADD_ITEM,
		item,
	}
}

export function itemsFanout (item) {
	return function (dispatch, getState) {
		const uid = getState().users.authedId
		saveItem(item, {uid: uid}) // add item to firebase
		.then((itemWithId) => {
			dispatch(addItem(itemWithId)) // add to redux store
			dispatch(addNewItemToFeed(itemWithId.itemId, itemWithId))
			dispatch(closeItemsForm())
		})
		.catch((err) => {
			dispatch(updateItemFormError(err))
		})
	}
}

// REDUCERS
const initialState = {
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

export default function itemsForm (state = initialState, action) {
	switch (action.type) {
	case OPEN_ITEMS_FORM:
		return {
			...state,
			isOpen: true,
		}
	case CLOSE_ITEMS_FORM:
		return {
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
	case UPDATE_ITEMS_SERIAL:
		return {
			...state,
			serial: action.serial,
		}
	case UPDATE_ITEMS_PURCHASED_AT_DATE:
		return {
			...state,
			purchasedAtDate: action.purchasedAtDate,
		}
	case UPDATE_ITEMS_FORM_PHOTOS:
		return {
			...state,
			photo: action.photo,
			photoNames: action.photo.name,
		}
	case UPDATE_ITEMS_FORM_NOTES:
		return {
			...state,
			notes: action.notes,
		}
	case UPDATE_ITEM_PERSON:
		return {
			...state,
			itemPerson: action.itemPerson,
		}
	case UPDATE_ITEM_PERSON_ID:
		return {
			...state,
			itemPersonId: action.itemPersonId,
		}
	case UPDATE_ITEM_HARDWARE:
		return {
			...state,
			itemHardware: action.itemHardware,
		}
	case UPDATE_ITEM_HARDWARE_ID:
		return {
			...state,
			itemHardwareId: action.itemHardwareId,
		}
	case UPDATE_ITEM_FORM_ERROR:
		return {
			...state,
			error: action.error,
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
