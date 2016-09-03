// import { saveItems } from 'helpers/api'

const OPEN_ITEMS_FORM = 'OPEN_ITEMS_FORM'
const CLOSE_ITEMS_FORM = 'CLOSE_ITEMS_FORM'
const UPDATE_ITEMS_ITEM_ID_TEXT = 'UPDATE_ITEMS_ITEM_ID_TEXT'
const UPDATE_ITEMS_PURCHASED_AT_DATE = 'UPDATE_ITEMS_PURCHASED_AT_DATE'
const UPDATE_ITEMS_FORM_NOTES = 'UPDATE_ITEMS_FORM_NOTES'
const UPDATE_ITEMS_FORM_PHOTOS = 'UPDATE_ITEMS_FORM_PHOTOS'
const UPDATE_ITEM_PERSON = 'UPDATE_ITEM_PERSON'
const UPDATE_ITEM_HARDWARE = 'UPDATE_ITEM_HARDWARE'

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

export function updateItemId (itemId) {
	return {
		type: UPDATE_ITEMS_ITEM_ID_TEXT,
		itemId,
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

export function updateFormPhotos (photos) {
	return {
		type: UPDATE_ITEMS_FORM_PHOTOS,
		photos,
	}
}

function updateItemPerson (itemPerson) {
	return {
		type: UPDATE_ITEM_PERSON,
		itemPerson,
	}
}

export function updateItemPersonId (itemPersonId) {
	return function (dispatch, getState) {
		const person = getState().people[itemPersonId]
		const personName = `${person.firstName} ${person.lastName}`
		dispatch(updateItemPerson(personName))
	}
}

function updateItemHardware (itemHardware) {
	return {
		type: UPDATE_ITEM_HARDWARE,
		itemHardware,
	}
}

export function updateItemHardwareId (itemHardwareId) {
	return function (dispatch, getState) {
		const hardware = getState().hardware[itemHardwareId]
		const hardwareName = `${hardware.make} ${hardware.model}`
		dispatch(updateItemHardware(hardwareName))
	}
}

export function itemsFanout (items) {
// 	return function (dispatch, getState) {
// 		// const uid = getState().users.authedId
// 		// saveItems(items, { uid: uid })
// 		// .then((itemsWithId) => {
// 		// 	dispatch(addItem(itemsWithId))
// 		// 	dispatch(closeItemsForm())
// 		// })
// 		// .catch((err) => {
// 		// 	console.warn('Error in itemsFanout', err)
// 		// })
// 	}
}

// REDUCERS
const initialState = {
	isOpen: false,
	purchasedAtDate: '',
	itemId: '',
	itemPerson: '',
	itemHardware: '',
	notes: '',
	photos: {},
	photoNames: {},
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
			itemId: '',
			itemPerson: '',
			itemHardware: '',
			notes: '',
			photos: {},
			photoNames: {},
		}
	case UPDATE_ITEMS_ITEM_ID_TEXT:
		return {
			...state,
			itemId: action.itemId,
		}
	case UPDATE_ITEMS_PURCHASED_AT_DATE:
		return {
			...state,
			purchasedAtDate: action.purchasedAtDate,
		}
	case UPDATE_ITEMS_FORM_PHOTOS:
		return {
			...state,
			photos: action.photos,
			photoNames: action.photoNames,
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
	case UPDATE_ITEM_HARDWARE:
		return {
			...state,
			itemHardware: action.itemHardware,
		}
	default:
		return state
	}
}
