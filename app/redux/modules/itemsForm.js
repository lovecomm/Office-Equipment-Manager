import { saveItems } from 'helpers/api'

const ADD_ITEMS = 'ADD_ITEMS'
const OPEN_ITEMS_FORM = 'OPEN_ITEMS_FORM'
const CLOSE_ITEMS_FORM = 'CLOSE_ITEMS_FORM'
const UPDATE_FIRST_NAME_TEXT = 'UPDATE_FIRST_NAME_TEXT'
const UPDATE_LAST_NAME_TEXT = 'UPDATE_LAST_NAME_TEXT'
const UPDATE_EMAIL_TEXT = 'UPDATE_EMAIL_TEXT'
const UPDATE_PHOTO = 'UPDATE_PHOTO'

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

export function updateFirstNameText (firstNameText) {
	return {
		type: UPDATE_FIRST_NAME_TEXT,
		firstNameText,
	}
}

export function updateLastNameText (lastNameText) {
	return {
		type: UPDATE_LAST_NAME_TEXT,
		lastNameText,
	}
}

export function updateEmailText (emailText) {
	return {
		type: UPDATE_EMAIL_TEXT,
		emailText,
	}
}

export function updatePhoto (photo) {
	return {
		type: UPDATE_PHOTO,
		photo,
	}
}

function addItems (items) {
	return {
		type: ADD_ITEMS,
		items,
	}
}

export function itemsFanout (items) {
	return function (dispatch, getState) {
		const uid = getState().users.authedId
		saveItems(items, { uid: uid })
		.then((itemsWithId) => {
			dispatch(addItems(itemsWithId))
			dispatch(closeItemsForm())
		})
		.catch((err) => {
			console.warn('Error in itemsFanout', err)
		})
	}
}

// REDUCERS
const initialState = {
	firstNameText: '',
	lastNameText: '',
	emailText: '',
	photo: {},
	photoNameText: '',
	isOpen: false,
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
			firstNameText: '',
			lastNameText: '',
			emailText: '',
			photo: {},
			photoNameText: '',
			isOpen: false,
		}
	case UPDATE_FIRST_NAME_TEXT:
		return {
			...state,
			firstNameText: action.firstNameText,
		}
	case UPDATE_LAST_NAME_TEXT:
		return {
			...state,
			lastNameText: action.lastNameText,
		}
	case UPDATE_EMAIL_TEXT:
		return {
			...state,
			emailText: action.emailText,
		}
	case UPDATE_PHOTO:
		return {
			...state,
			photo: action.photo,
			photoNameText: action.photo.name,
		}
	case ADD_ITEMS:
		return {
			...state,
			[action.items.itemsId]: action.items,
		}
	default :
		return state
	}
}
