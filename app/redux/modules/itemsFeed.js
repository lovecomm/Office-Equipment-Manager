import { getUrl } from 'helpers/api'
import { getSortedFeedIds } from 'helpers/sorting'
import { buildFilterOptions } from 'helpers/filtering'

const UPDATE_ITEMS_FEED_ITEMS = 'UPDATE_ITEMS_FEED_ITEMS'
const UPDATE_ITEMS_FEED_INITIAL_FETCH = 'UPDATE_ITEMS_FEED_INITIAL_FETCH'
const UPDATE_ITEM_PHOTO_URL = 'UPDATE_ITEM_PHOTO_URL'
const UPDATE_ITEM_COLLAPSED = 'UPDATE_ITEM_COLLAPSED'
const ADD_ITEMS_FILTER_OPTIONS = 'ADD_ITEMS_FILTER_OPTIONS'
const UPDATE_ITEMS_FILTER_NAME = 'UPDATE_ITEMS_FILTER_NAME'
const RESET_IS_FILTERING_ITEMS = 'RESET_IS_FILTERING_ITEMS'
const UPDATE_ITEMS_SORT_ORDER = 'UPDATE_ITEMS_SORT_ORDER'
const UPDATE_ITEMS_SORT_STATUS = 'UPDATE_ITEMS_SORT_STATUS'
const UPDATE_ITEMS_FEED_IDS = 'UPDATE_ITEMS_FEED_IDS'

// THUNKS & HELPERS
export function prepItemsForFeed (items) {
	return function (dispatch, getState) {
		return new Promise((resolve, reject) => {
			dispatch(updateItemsFeedItems(items, Object.keys(items)))
			dispatch(sortItemsFeedBy('serial'))
			if (getState().itemsFeed.initialFetch === true) dispatch(updateItemsFeedInitialFetch(false))
			resolve()
		})
		.catch((err) => `Error in prepItemsForFeed, ${err}`)
	}
}


export function setFilterOptions (buildOptions) {
	return function (dispatch, getState) {
		if (buildOptions) {
			buildFilterOptions(getState().itemsFeed.items, 'item', ['serial'])
			.then((filterOptions) => dispatch(addItemsFilterOptions(filterOptions)))
		} else {
			dispatch(addItemsFilterOptions({}))
		}
	}
}

export function handleItemCollapsed (itemId, collapsed) {
	return function (dispatch, getState) {
		return new Promise((resolve, reject) => {
			Object.keys(getState().itemsFeed.items).forEach((itemId) => {
				dispatch(updateItemCollapsed(itemId, true))
			})
			resolve()
		})
		.then(() => dispatch(updateItemCollapsed(itemId, collapsed)))
		.catch((err) => `Error in handleItemCollapsed, ${err}`)
	}
}

// START FILTER FUNCTIONS
export function updateAndHandleItemsFilter (filterId) {
	return function (dispatch, getState) {
		const item = getState().itemsFeed.items[filterId]
		dispatch(updateItemsFilterName(`${item.serial}`))
		dispatch(updateItemsFeedIds(filterId))
	}
}

export function disableIsFilteringItems () {
	return function (dispatch, getState) {
		dispatch(updateItemsFeedIds(Object.keys(getState().itemsFeed.items)))
		dispatch(sortItemsFeedBy(getState().itemsFeed.sorting.sortStatus))
		dispatch(resetIsFilteringItems())
	}
}
// END FILTER FUNCTIONS
// START SORTING FUNCTIONS
export function reverseItemsSortOrder () {
	return function (dispatch, getState) {
		dispatch(applyNewItemsSortOrder())
		.then(() => dispatch(sortItemsFeedBy(getState().itemsFeed.sorting.sortStatus)))
	}
}

function applyNewItemsSortOrder () {
	return function (dispatch, getState) {
		return new Promise(function (resolve, reject) {
			if (getState().itemsFeed.sorting.sortOrder === 'dec') {
				resolve(dispatch(updateItemsSortOrder('asc')))
			} else {
				resolve(dispatch(updateItemsSortOrder('dec')))
			}
		})
		.catch((err) => `Error in applyNewItemsSortOrder, ${err}`)
	}
}

export function sortItemsFeedBy (sortStatus) {
	return function (dispatch, getState) {
		dispatch(updateItemsSortStatus(sortStatus))
		getSortedFeedIds(getState().itemsFeed, 'items', sortStatus)
		.then((sortedFeedIds) => dispatch(updateItemsFeedIds(sortedFeedIds)))
	}
}
// END SORTING FUNCTIONS

// ACTIONS
function updateItemsFeedIds (feedIds) {
	return {
		type: UPDATE_ITEMS_FEED_IDS,
		feedIds,
	}
}

function resetIsFilteringItems () {
	return {
		type: RESET_IS_FILTERING_ITEMS,
	}
}

function updateItemsFilterName (name) {
	return {
		type: UPDATE_ITEMS_FILTER_NAME,
		name,
	}
}

function addItemsFilterOptions (options) {
	return {
		type: ADD_ITEMS_FILTER_OPTIONS,
		options,
	}
}

function updateItemsSortStatus (sortStatus) {
	return {
		type: UPDATE_ITEMS_SORT_STATUS,
		sortStatus,
	}
}

function updateItemsSortOrder (sortOrder) {
	return {
		type: UPDATE_ITEMS_SORT_ORDER,
		sortOrder,
	}
}

function updateItemsFeedItems (items, feedIds) {
	return {
		type: UPDATE_ITEMS_FEED_ITEMS,
		items,
		feedIds,
	}
}

function updateItemsFeedInitialFetch (initialFetch) {
	return {
		type: UPDATE_ITEMS_FEED_INITIAL_FETCH,
		initialFetch,
	}
}

function updateItemPhotoUrl (itemId, photoUrl) {
	return {
		type: UPDATE_ITEM_PHOTO_URL,
		itemId,
		photoUrl,
	}
}

function updateItemCollapsed (itemId, collapsed) {
	return {
		type: UPDATE_ITEM_COLLAPSED,
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

const initialItemState = {
	itemId: '',
	serial: '',
	hardwareId: '',
	personId: '',
	hasSubContent: false,
	note: '',
	photo: {},
	purchaseDate: '',
	createdBy: '',
	dateCreated: '',
	dateLastUpdated: '',
	collapsed: true,
}

function item (state = initialItemState, action) {
	switch (action.type) {
	case UPDATE_ITEM_COLLAPSED:
		return {
			...state,
			collapsed: action.collapsed,
		}
	case UPDATE_ITEM_PHOTO_URL:
		return {
			...state,
			photo: photoItem(state.photo, action),
		}
	default:
		return state
	}
}

function filterItems (state, action) {
	switch (action.type) {
	case ADD_ITEMS_FILTER_OPTIONS:
		return {
			...state,
			options: action.options,
		}
	case UPDATE_ITEMS_FILTER_NAME:
		return {
			...state,
			isFiltering: true,
			name: action.name,
		}
	case RESET_IS_FILTERING_ITEMS: {
		return initialState.filter
	}
	default:
		return state
	}
}

function sortingItems (state, action) {
	switch (action.type) {
	case UPDATE_ITEMS_SORT_STATUS:
		return {
			...state,
			sortStatus: action.sortStatus,
		}
	case UPDATE_ITEMS_SORT_ORDER:
		return {
			...state,
			sortOrder: action.sortOrder,
		}
	default:
		return state
	}
}

const initialState = {
	initialFetch: true,
	feedIds: [],
	items: {},
	filter: {
		isFiltering: false,
		options: {},
		filterType: '',
		name: '',
	},
	sorting: {
		sortStatus: 'make',
		sortOrder: 'asc',
	},
}

export default function itemsFeed (state = initialState, action) {
	switch (action.type) {
	case UPDATE_ITEMS_FEED_INITIAL_FETCH:
		return {
			...state,
			initialFetch: action.initialFetch,
		}
	case UPDATE_ITEMS_FEED_ITEMS:
		return {
			...state,
			items: action.items,
			feedIds: action.feedIds,
		}
	case UPDATE_ITEMS_FEED_IDS:
		return {
			...state,
			feedIds: action.feedIds,
		}
	case UPDATE_ITEM_PHOTO_URL:
	case UPDATE_ITEM_COLLAPSED:
		return {
			...state,
			items: {
				...state.items,
				[action.itemId]: item(state.items[action.itemId], action),
			},
		}
	case ADD_ITEMS_FILTER_OPTIONS:
	case UPDATE_ITEMS_FILTER_NAME:
	case RESET_IS_FILTERING_ITEMS:
		return {
			...state,
			filter: filterItems(state.filter, action),
		}
	case UPDATE_ITEMS_SORT_ORDER:
	case UPDATE_ITEMS_SORT_STATUS:
		return {
			...state,
			sorting: sortingItems(state.sorting, action),
		}
	default:
		return state
	}
}
