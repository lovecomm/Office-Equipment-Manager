// import { saveItems } from 'helpers/api'

const OPEN_ITEMS_FORM = 'OPEN_ITEMS_FORM'
const CLOSE_ITEMS_FORM = 'CLOSE_ITEMS_FORM'
const UPDATE_ITEMS_ITEM_ID_TEXT = 'UPDATE_ITEMS_ITEM_ID_TEXT'
const UPDATE_ITEMS_PURCHASED_AT_DATE = 'UPDATE_ITEMS_PURCHASED_AT_DATE'
const UPDATE_ITEMS_FORM_NOTES = 'UPDATE_ITEMS_FORM_NOTES'
const UPDATE_ITEMS_FORM_PHOTOS = 'UPDATE_ITEMS_FORM_PHOTOS'

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

export function updateFormNotes (formNotes) {
	return {
		type: UPDATE_ITEMS_FORM_NOTES,
		formNotes,
	}
}

export function updateFormPhotos (formPhotos) {
	return {
		type: UPDATE_ITEMS_FORM_PHOTOS,
		formPhotos,
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
	itemPersonId: '',
	itemHardwareId: '',
	notes: {},
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
			itemId: '',
			purchasedAtDate: '',
			isOpen: false,
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
	default:
		return state
	}
}
