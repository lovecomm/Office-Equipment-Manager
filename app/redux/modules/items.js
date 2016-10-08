import { getUrl } from 'helpers/api'

const ADD_ITEMS_TO_FEED = 'ADD_ITEMS_TO_FEED'
const UPDATE_COLLAPSED = 'UPDATE_COLLAPSED'
const COLLAPSE_ITEM = 'COLLAPSE_ITEM'
const UPDATE_ITEM_PERSONID = 'UPDATE_ITEM_PERSONID'
const UPDATE_ITEM_PHOTO_URL = 'UPDATE_ITEM_PHOTO_URL'

export function prepItemsForFeed (items) {
	return function (dispatch, getState) {
		return new Promise((resolve, reject) => {
			dispatch(getItemUrlFromFirebase(items))
			.then(() => dispatch(addItemsToFeed(items)))
			resolve()
		})
	}
}

function addItemsToFeed (items) {
	return {
		type: ADD_ITEMS_TO_FEED,
		items,
	}
}

function getItemUrlFromFirebase (items) {
	return function (dispatch, getState) {
		return new Promise((resolve, reject) => {
			Object.keys(items).forEach((itemId) => {
				if (items[itemId].photo.name !== '') {
					getUrl('items', items[itemId].photo.name)
					.then((downloadUrl) => {
						dispatch(updateItemPhotoUrl(itemId, downloadUrl))
					})
				}
			})
			resolve()
		})
	}
}

function updateItemPhotoUrl (itemId, photoUrl) {
	return {
		type: UPDATE_ITEM_PHOTO_URL,
		itemId,
		photoUrl,
	}
}

export function handleCollapsed (itemId, collapsed) {
	return function (dispatch, getState) {
		const items = Object.keys(getState().items)
		return new Promise((resolve, reject) => {
			items.forEach((itemId) => {
				dispatch(updateCollapseItem(itemId))
			})
			resolve()
		})
		.then(() => dispatch(updateCollapsed(itemId, collapsed)))
	}
}

export function updateItemsPersonId (itemId, personId) {
	return {
		type: UPDATE_ITEM_PERSONID,
		itemId,
		personId,
	}
}

function updateCollapseItem (itemId) {
	return {
		type: COLLAPSE_ITEM,
		itemId,
	}
}

function updateCollapsed (itemId, collapsed) {
	return {
		type: UPDATE_COLLAPSED,
		itemId,
		collapsed,
	}
}

// REDUCERS
const initialItemPhotoState = {
	bucket: '',
	fullPath: '',
	name: '',
	size: 0,
	type: '',
	url: '',
}

function photoItem (state = initialItemPhotoState, action) {
	switch (action.type) {
	case UPDATE_ITEM_PHOTO_URL:
		return {
			...state,
			url: action.photoUrl,
		}
	default:
		return state
	}
}

// REDUCERS
const initialItemState = {
	collapsed: true,
	createdBy: '',
	dateCreated: '',
	dateLastUpdated: '',
	hardwareId: '',
	hasSubContent: '',
	itemId: '',
	note: '',
	personId: '',
	purchaseDate: '',
	serial: '',
}

function item (state = initialItemState, action) {
	switch (action.type) {
	case COLLAPSE_ITEM:
		return {
			...state,
			collapsed: true,
		}
	case UPDATE_COLLAPSED:
		return {
			...state,
			collapsed: action.collapsed,
		}
	case UPDATE_ITEM_PERSONID:
		return {
			...state,
			personId: action.personId,
		}
	case UPDATE_ITEM_PHOTO_URL: {
		return {
			...state,
			photo: photoItem(state.photo, action),
		}
	}
	default :
		return state
	}
}

const initialState = {}

export default function items (state = initialState, action) {
	switch (action.type) {
	case ADD_ITEMS_TO_FEED:
		return {
			...state,
			...action.items,
		}
	case COLLAPSE_ITEM:
	case UPDATE_ITEM_PERSONID:
	case UPDATE_COLLAPSED:
	case UPDATE_ITEM_PHOTO_URL:
		return {
			...state,
			[action.itemId]: item(state[action.itemId], action),
		}
	default :
		return state
	}
}
