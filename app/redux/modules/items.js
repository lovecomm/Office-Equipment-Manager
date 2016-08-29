// import { saveItems } from 'helpers/api'

const ADD_ITEM = 'ADD_ITEM'
const OPEN_ITEMS_FORM = 'OPEN_ITEMS_FORM'
const CLOSE_ITEMS_FORM = 'CLOSE_ITEMS_FORM'
const UPDATE_ITEM_ID_TEXT = 'UPDATE_ITEM_ID_TEXT'
const UPDATE_PURCHASED_AT_DATE = 'UPDATE_PURCHASED_AT_DATE'
const UPDATE_FORM_NOTES = 'UPDATE_FORM_NOTES'
const UPDATE_FORM_PHOTOS = 'UPDATE_FORM_PHOTOS'
const FETCHING_ITEMS = 'FETCHING_ITEMS'
const FETCHING_ITEMS_ERROR = 'FETCHING_ITEMS_ERROR'
const FETCHING_ITEMS_SUCCESS = 'FETCHING_ITEMS_SUCCESS'
const REMOVE_FETCHING_ITEMS = 'REMOVE_FETCHING_ITEMS'

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
		type: UPDATE_ITEM_ID_TEXT,
		itemId,
	}
}

export function updatePurchasedAtDate (purchasedAtDate) {
	return {
		type: UPDATE_PURCHASED_AT_DATE,
		purchasedAtDate,
	}
}

export function updateFormNotes (formNotes) {
	return {
		type: UPDATE_FORM_NOTES,
		formNotes,
	}
}

export function updateFormPhotos (formPhotos) {
	return {
		type: UPDATE_FORM_PHOTOS,
		formPhotos,
	}
}

function fetchingItems () {
	return {
		type: FETCHING_ITEMS,
	}
}

function fetchingItemsError (error) {
	return {
		type: FETCHING_ITEMS_ERROR,
		error: error,
	}
}

export function fetchingItemsSuccess (uid, user, timestamp) {
	return {
		type: FETCHING_ITEMS_SUCCESS,
		uid,
		user,
		timestamp,
	}
}

export function removeFetchingItems () {
	return {
		type: REMOVE_FETCHING_ITEMS,
	}
}

function addItem (item, timestamp) {
	return {
		type: ADD_ITEM,
		item,
		timestamp,
	}
}

export function itemsFanout (items) {
	return function (dispatch, getState) {
		// const uid = getState().users.authedId
		// saveItems(items, { uid: uid })
		// .then((itemsWithId) => {
		// 	dispatch(addItem(itemsWithId))
		// 	dispatch(closeItemsForm())
		// })
		// .catch((err) => {
		// 	console.warn('Error in itemsFanout', err)
		// })
	}
}

// REDUCERS
const initialItemsFormState = {
	isOpen: false,
	purchasedAtDate: '',
	itemId: '',
	itemPersonId: '',
	itemHardwareId: '',
	notes: {},
	photos: {},
	photoNames: {},
}

function itemsForm (state = initialItemsFormState, action) {
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
	case UPDATE_ITEM_ID_TEXT:
		return {
			...state,
			itemId: action.itemId,
		}
	case UPDATE_PURCHASED_AT_DATE:
		return {
			...state,
			purchasedAtDate: action.purchasedAtDate,
		}
	case UPDATE_FORM_PHOTOS:
		return {
			...state,
			photos: action.photos,
			photoNames: action.photoNames,
		}
	case UPDATE_FORM_NOTES:
		return {
			...state,
			notes: action.notes,
		}
	default :
		return state
	}
}

const initialItemState = {
	lastUpdated: Date.now(),
	info: {
		itemId: '',
		purchasedAtDate: '',
		assignedAtDate: '',
		viability: '',
		photos: {},
		notes: {},
	},
}

function item (state = initialItemState, action) {
	switch (action.type) {
	case ADD_ITEM:
		return {
			...state,
			[action.itemId]: {
				info: action.item,
				lastUpdated: action.timestamp,
			},
		}
	default :
		return state
	}
}

const initialState = {
	isFetching: false,
	error: '',
	lastUpdated: Date.now(),
	form: initialItemsFormState,
}

export default function items (state = initialState, action) {
	switch (action.type) {
	case OPEN_ITEMS_FORM:
	case CLOSE_ITEMS_FORM:
	case UPDATE_ITEM_ID_TEXT:
	case UPDATE_PURCHASED_AT_DATE:
	case UPDATE_FORM_PHOTOS:
	case UPDATE_FORM_NOTES:
		return {
			...state,
			error: '',
			lastUpdated: Date.now(),
			form: itemsForm(state[action.form], action),
		}
	// case FETCHING_ITEMS:
	// 	return {
	// 		...state,
	// 		isFetching: true,
	// 	}
	// case FETCHING_ITEMS_ERROR:
	// 	return {
	// 		...state,
	// 		isFetching: false,
	// 		error: action.error,
	// 	}
	// case FETCHING_ITEMS_SUCCESS:
	// case ADD_ITEM:
	// 	return action.item === null
	// 	? {
	// 		...state,
	// 		isFetching: false,
	// 		error: '',
	// 	}
	// 	: {
	// 		...state,
	// 		items: item(state[action.item], action),
	// 	}
	default :
		return state
	}
}
