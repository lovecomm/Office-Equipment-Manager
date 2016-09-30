const ADD_ITEMS_TO_FEED = 'ADD_ITEMS_TO_FEED'
const UPDATE_COLLAPSED = 'UPDATE_COLLAPSED'
const COLLAPSE_ITEM = 'COLLAPSE_ITEM'
const UPDATE_ITEM_PERSONID = 'UPDATE_ITEM_PERSONID'
const UPDATE_ITEM_IN_FEED = 'UPDATE_ITEM_IN_FEED'

export function addItemsToFeed (items) {
	return {
		type: ADD_ITEMS_TO_FEED,
		items,
	}
}

export function updateItemInFeed (itemId, item) {
	return {
		type: UPDATE_ITEM_IN_FEED,
		itemId,
		item,
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
	console.log('in updateItemsPersonId', itemId, personId)
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
const initialItemState = {}

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
	case UPDATE_ITEM_IN_FEED:
		return {
			...state,
			[action.itemId]: action.item,
		}
	case COLLAPSE_ITEM:
	case UPDATE_ITEM_PERSONID:
	case UPDATE_COLLAPSED:
		return {
			...state,
			[action.itemId]: item(state[action.itemId], action),
		}
	default :
		return state
	}
}
