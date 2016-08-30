// import { saveItems } from 'helpers/api'

const ADD_ITEM = 'ADD_ITEM'
const FETCHING_ITEMS = 'FETCHING_ITEMS'
const FETCHING_ITEMS_ERROR = 'FETCHING_ITEMS_ERROR'
const FETCHING_ITEMS_SUCCESS = 'FETCHING_ITEMS_SUCCESS'
const REMOVE_FETCHING_ITEMS = 'REMOVE_FETCHING_ITEMS'

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
}

export default function items (state = initialState, action) {
	switch (action.type) {
	case FETCHING_ITEMS:
		return {
			...state,
			isFetching: true,
		}
	case FETCHING_ITEMS_ERROR:
		return {
			...state,
			isFetching: false,
			error: action.error,
		}
	case FETCHING_ITEMS_SUCCESS:
	case ADD_ITEM:
		return action.item === null
		? {
			...state,
			isFetching: false,
			error: '',
		}
		: {
			...state,
			items: item(state[action.item], action),
		}
	default :
		return state
	}
}
