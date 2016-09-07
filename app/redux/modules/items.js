const ADD_ITEMS_TO_FEED = 'ADD_ITEMS_TO_FEED'
const UPDATE_COLLAPSED = 'UPDATE_COLLAPSED'

export function addItemsToFeed (items) {
	return {
		type: ADD_ITEMS_TO_FEED,
		items,
	}
}

export function handleCollapsed () {
	return function (dispatch, state) {
		console.log('state')
	}
}

function updateCollapsed (item, collapsed) {
	return {
		type: UPDATE_COLLAPSED,
		item,
		collapsed,
	}
}

// REDUCERS
const initialItemState = {}

function item (state = initialItemState, action) {
	switch (action.type) {
	case UPDATE_COLLAPSED:
		return {
			...state,
			[action.item.itemId]: {
				collapsed: action.collapsed,
			},
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
	case UPDATE_COLLAPSED:
		return {
			...state,
			items: item(state[action.item], action),
		}
	default :
		return state
	}
}
