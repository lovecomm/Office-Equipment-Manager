import { getUrl } from 'helpers/api'
import { getSortedFeedIds } from 'helpers/sorting'
import { buildFilterOptions } from 'helpers/filtering'

const UPDATE_HARDWARES_FEED_HARDWARES = 'UPDATE_HARDWARES_FEED_HARDWARES'
const UPDATE_HARDWARES_FEED_INITIAL_FETCH = 'UPDATE_HARDWARES_FEED_INITIAL_FETCH'
const UPDATE_HARDWARE_PHOTO_URL = 'UPDATE_HARDWARE_PHOTO_URL'
const UPDATE_HARDWARE_COLLAPSED = 'UPDATE_HARDWARE_COLLAPSED'
const ADD_HARDWARES_FILTER_OPTIONS = 'ADD_HARDWARES_FILTER_OPTIONS'
const UPDATE_HARDWARES_FILTER_NAME = 'UPDATE_HARDWARES_FILTER_NAME'
const RESET_IS_FILTERING_HARDWARES = 'RESET_IS_FILTERING_HARDWARES'
const UPDATE_HARDWARES_SORT_ORDER = 'UPDATE_HARDWARES_SORT_ORDER'
const UPDATE_HARDWARES_SORT_STATUS = 'UPDATE_HARDWARES_SORT_STATUS'
const UPDATE_HARDWARES_FEED_IDS = 'UPDATE_HARDWARES_FEED_IDS'

// THUNKS & HELPERS
export function prepHardwaresForFeed (hardwares) {
	return function (dispatch, getState) {
		return new Promise((resolve, reject) => {
			dispatch(updateHardwaresFeedHardwares(hardwares))
			dispatch(updateHardwaresFeedIds(Object.keys(hardwares)))
			dispatch(sortHardwaresFeedBy('make'))
			if (getState().hardwaresFeed.initialFetch === true) dispatch(updateHardwaresFeedInitialFetch(false))
			resolve()
		})
		.catch((err) => `Error in prepHardwaresForFeed, ${err}`)
	}
}

export function setFilterOptions (buildOptions) {
	return function (dispatch, getState) {
		if (buildOptions) {
			buildFilterOptions(getState().hardwaresFeed.hardwares, 'hardware', ['make', 'model'])
			.then((filterOptions) => dispatch(addHardwaresFilterOptions(filterOptions)))
		} else {
			dispatch(addHardwaresFilterOptions({}))
		}
	}
}

export function handleHardwareCollapsed (hardwareId, collapsed) {
	return function (dispatch, getState) {
		return new Promise((resolve, reject) => {
			Object.keys(getState().hardwaresFeed.hardwares).forEach((hardwareId) => {
				dispatch(updateHardwareCollapsed(hardwareId, true))
			})
			resolve()
		})
		.then(() => dispatch(updateHardwareCollapsed(hardwareId, collapsed)))
		.catch((err) => `Error in handleHardwareCollapsed, ${err}`)
	}
}

// START FILTER FUNCTIONS
export function updateAndHandleHardwaresFilter (filterId) {
	return function (dispatch, getState) {
		const hardware = getState().hardwaresFeed.hardwares[filterId]
		dispatch(updateHardwaresFilterName(`${hardware.make} ${hardware.model}`))
		dispatch(updateHardwaresFeedIds(filterId))
	}
}

export function disableIsFilteringHardwares () {
	return function (dispatch, getState) {
		// dispatch(setFilterOptions(false))
		dispatch(updateHardwaresFeedIds(Object.keys(getState().hardwaresFeed.hardwares)))
		dispatch(sortHardwaresFeedBy(getState().hardwaresFeed.sorting.sortStatus))
		dispatch(resetIsFilteringHardwares())
		
	}
}
// END FILTER FUNCTIONS
// START SORTING FUNCTIONS
export function reverseHardwaresSortOrder () {
	return function (dispatch, getState) {
		dispatch(applyNewHardwaresSortOrder())
		.then(() => dispatch(sortHardwaresFeedBy(getState().hardwaresFeed.sorting.sortStatus)))
	}
}

function applyNewHardwaresSortOrder () {
	return function (dispatch, getState) {
		return new Promise(function (resolve, reject) {
			if (getState().hardwaresFeed.sorting.sortOrder === 'dec') {
				resolve(dispatch(updateHardwaresSortOrder('asc')))
			} else {
				resolve(dispatch(updateHardwaresSortOrder('dec')))
			}
		})
		.catch((err) => `Error in applyNewHardwaresSortOrder, ${err}`)
	}
}

export function sortHardwaresFeedBy (sortStatus) {
	return function (dispatch, getState) {
		dispatch(updateHardwaresSortStatus(sortStatus))
		getSortedFeedIds(getState().hardwaresFeed, 'hardwares', sortStatus)
		.then((sortedFeedIds) => dispatch(updateHardwaresFeedIds(sortedFeedIds)))
	}
}
// END SORTING FUNCTIONS

// ACTIONS
function updateHardwaresFeedIds (feedIds) {
	return {
		type: UPDATE_HARDWARES_FEED_IDS,
		feedIds,
	}
}

function resetIsFilteringHardwares () {
	return {
		type: RESET_IS_FILTERING_HARDWARES,
	}
}

function updateHardwaresFilterName (name) {
	return {
		type: UPDATE_HARDWARES_FILTER_NAME,
		name,
	}
}

function addHardwaresFilterOptions (options) {
	return {
		type: ADD_HARDWARES_FILTER_OPTIONS,
		options,
	}
}

function updateHardwaresSortStatus (sortStatus) {
	return {
		type: UPDATE_HARDWARES_SORT_STATUS,
		sortStatus,
	}
}

function updateHardwaresSortOrder (sortOrder) {
	return {
		type: UPDATE_HARDWARES_SORT_ORDER,
		sortOrder,
	}
}

function updateHardwaresFeedHardwares (hardwares) {
	return {
		type: UPDATE_HARDWARES_FEED_HARDWARES,
		hardwares,
	}
}

function updateHardwaresFeedInitialFetch (initialFetch) {
	return {
		type: UPDATE_HARDWARES_FEED_INITIAL_FETCH,
		initialFetch,
	}
}

function updateHardwarePhotoUrl (hardwareId, photoUrl) {
	return {
		type: UPDATE_HARDWARE_PHOTO_URL,
		hardwareId,
		photoUrl,
	}
}

function updateHardwareCollapsed (hardwareId, collapsed) {
	return {
		type: UPDATE_HARDWARE_COLLAPSED,
		hardwareId,
		collapsed,
	}
}

// REDUCERS
const initialHardwarePhotoState = {
	bucket: '',
	fullPath: '',
	name: '',
	size: 0,
	type: '',
	url: '',
}

function photoHardware (state = initialHardwarePhotoState, action) {
	switch (action.type) {
	case UPDATE_HARDWARE_PHOTO_URL:
		return {
			...state,
			url: action.photoUrl,
		}
	default:
		return state
	}
}

const initialHardwareState = {
	hardwareId: '',
	make: '',
	model: '',
	createdBy: '',
	dateCreated: '',
	dateLastUpdated: '',
	collapsed: true,
}

function hardware (state = initialHardwareState, action) {
	switch (action.type) {
	case UPDATE_HARDWARE_COLLAPSED:
		return {
			...state,
			collapsed: action.collapsed,
		}
	case UPDATE_HARDWARE_PHOTO_URL:
		return {
			...state,
			photo: photoHardware(state.photo, action),
		}
	default:
		return state
	}
}

function filterHardwares (state, action) {
	switch (action.type) {
	case ADD_HARDWARES_FILTER_OPTIONS:
		return {
			...state,
			options: action.options,
		}
	case UPDATE_HARDWARES_FILTER_NAME:
		return {
			...state,
			isFiltering: true,
			name: action.name,
		}
	case RESET_IS_FILTERING_HARDWARES: {
		return initialState.filter
	}
	default:
		return state
	}
}

function sortingHardwares (state, action) {
	switch (action.type) {
	case UPDATE_HARDWARES_SORT_STATUS:
		return {
			...state,
			sortStatus: action.sortStatus,
		}
	case UPDATE_HARDWARES_SORT_ORDER:
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
	hardwares: {},
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

export default function hardwaresFeed (state = initialState, action) {
	switch (action.type) {
	case UPDATE_HARDWARES_FEED_INITIAL_FETCH:
		return {
			...state,
			initialFetch: action.initialFetch,
		}
	case UPDATE_HARDWARES_FEED_HARDWARES:
		return {
			...state,
			hardwares: action.hardwares,
		}
	case UPDATE_HARDWARES_FEED_IDS:
		return {
			...state,
			feedIds: action.feedIds,
		}
	case UPDATE_HARDWARE_PHOTO_URL:
	case UPDATE_HARDWARE_COLLAPSED:
		return {
			...state,
			hardwares: {
				...state.hardwares,
				[action.hardwareId]: hardware(state.hardwares[action.hardwareId], action),
			},
		}
	case ADD_HARDWARES_FILTER_OPTIONS:
	case UPDATE_HARDWARES_FILTER_NAME:
	case RESET_IS_FILTERING_HARDWARES:
		return {
			...state,
			filter: filterHardwares(state.filter, action),
		}
	case UPDATE_HARDWARES_SORT_ORDER:
	case UPDATE_HARDWARES_SORT_STATUS:
		return {
			...state,
			sorting: sortingHardwares(state.sorting, action),
		}
	default:
		return state
	}
}
