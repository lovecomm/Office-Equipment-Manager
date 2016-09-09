import { addListener } from 'redux/modules/listeners'
import { listenToFeed } from 'helpers/api'
import { addItemsToFeed } from 'redux/modules/items'
import { addPeopleToFeed } from 'redux/modules/people'
import { addHardwareToFeed } from 'redux/modules/hardware'

const SETTING_FEED_LISTENER = 'SETTING_FEED_LISTENER'
const SETTING_FEED_LISTENER_ERROR = 'SETTING_FEED_LISTENER_ERROR'
const SETTING_FEED_LISTENER_SUCCESS = 'SETTING_FEED_LISTENER_SUCCESS'
const ADD_NEW_ITEM_TO_FEED = 'ADD_NEW_ITEM_TO_FEED'
const UPDATE_SORT_STATUS = 'UPDATE_SORT_STATUS'
const UPDATE_SORT_ORDER = 'UPDATE_SORT_ORDER'
const	ADD_FILTER_OPTIONS = 'ADD_FILTER_OPTIONS'
const UPDATE_FILTER_NAME_AND_TYPE = 'UPDATE_FILTER_NAME_AND_TYPE'
const UPDATE_IS_FILTERING = 'UPDATE_IS_FILTERING'

// ACTIONS
function settingFeedListener () {
	return {
		type: SETTING_FEED_LISTENER,
	}
}

function settingFeedListenerError (error) {
	console.warn(error)
	return {
		type: SETTING_FEED_LISTENER_ERROR,
		error: 'Error fetching feeds.',
	}
}

function settingFeedListenerSuccess (itemIds) {
	return {
		type: SETTING_FEED_LISTENER_SUCCESS,
		itemIds,
	}
}

export function addNewItemToFeed (itemId, item) {
	return {
		type: ADD_NEW_ITEM_TO_FEED,
		itemId,
		item,
	}
}

function updateSortOrder (sortOrder) {
	return {
		type: UPDATE_SORT_ORDER,
		sortOrder,
	}
}

function updateSortStatus (sortStatus) {
	return {
		type: UPDATE_SORT_STATUS,
		sortStatus,
	}
}

export function setAndHandleFeedListener () {
	let initialFetch = true
	return function (dispatch, getState) {
		if (getState().listeners.feed === true) {
			return
		}
		dispatch(settingFeedListener())
		dispatch(addListener('feed'))
		dispatch(addListener('people'))
		dispatch(addListener('hardware'))
		listenToFeed(({
			items,
			sortedItemIds,
			people,
			hardware,
		}) => {
			dispatch(addItemsToFeed(items))
			dispatch(addPeopleToFeed(people))
			dispatch(addHardwareToFeed(hardware))
			buildFilterOptions(dispatch, items, people, hardware)
			if (initialFetch === true) {
				dispatch(settingFeedListenerSuccess(sortedItemIds))
			}
			initialFetch = false
		}, (error) => dispatch(settingFeedListenerError(error)))
	}
}

function applySortStatusByDate (dispatch, getState, sortStatus) {
	dispatch(updateSortStatus(sortStatus))
	const items = getState().items
	const itemsArray = []
	for (let item in items) {
		itemsArray.push([item, items[item]])
	}
	if (getState().feed.sortOrder === 'asc') {
		itemsArray.sort(function (a, b) {
			const itemA = new Date(a[1][sortStatus])
			const itemB = new Date(b[1][sortStatus])
			if (itemA > itemB) {
				return 1
			} else if (itemA < itemB) {
				return -1
			} else {
				return 0
			}
		})
	} else { // getState().feed.sortOrder === 'dec'
		itemsArray.sort(function (a, b) {
			const itemA = new Date(a[1][sortStatus])
			const itemB = new Date(b[1][sortStatus])
			if (itemA < itemB) {
				return 1
			} else if (itemA > itemB) {
				return -1
			} else {
				return 0
			}
		})
	}
	const sortedIds = itemsArray.map((item) => item[0])
	dispatch(settingFeedListenerSuccess(sortedIds))
}

export function sortFeedCreationDate () {
	return function (dispatch, getState) {
		applySortStatusByDate(dispatch, getState, 'dateCreated')
	}
}

export function sortFeedPurchaseDate () {
	return function (dispatch, getState) {
		applySortStatusByDate(dispatch, getState, 'purchasedAtDate')
	}
}

function applySortStatusPeople (dispatch, getState, sortStatus, name) {
	dispatch(updateSortStatus(sortStatus))
	const items = getState().items
	const people = getState().people
	const itemsArray = []
	for (let item in items) {
		const person = people[[items[item]][0].itemPersonId]
		itemsArray.push([item, person])
	}
	if (getState().feed.sortOrder === 'asc') {
		itemsArray.sort(function (a, b) {
			const itemA = a[1][name]
			const itemB = b[1][name]
			if (itemA > itemB) {
				return 1
			} else if (itemA < itemB) {
				return -1
			} else {
				return 0
			}
		})
	} else { // getState().feed.sortOrder === 'dec'
		itemsArray.sort(function (a, b) {
			const itemA = a[1][name]
			const itemB = b[1][name]
			if (itemA < itemB) {
				return 1
			} else if (itemA > itemB) {
				return -1
			} else {
				return 0
			}
		})
	}
	const sortedIds = itemsArray.map((item) => item[0])
	dispatch(settingFeedListenerSuccess(sortedIds))
}

export function sortFeedLastName () {
	return function (dispatch, getState) {
		applySortStatusPeople(dispatch, getState, 'peopleLastName', 'lastName')
	}
}

export function sortFeedFirstName () {
	return function (dispatch, getState) {
		applySortStatusPeople(dispatch, getState, 'peopleFirstName', 'firstName')
	}
}

function applySortStatusHardware (dispatch, getState, sortStatus) {
	dispatch(updateSortStatus(sortStatus))
	const items = getState().items
	const hardwares = getState().hardware
	const itemsArray = []
	for (let item in items) {
		const hardware = hardwares[[items[item]][0].itemHardwareId]
		itemsArray.push([item, hardware])
	}
	if (getState().feed.sortOrder === 'asc') {
		itemsArray.sort(function (a, b) {
			const itemA = `${a[1].make} ${a[1].model}`
			const itemB = `${b[1].make} ${b[1].model}`
			if (itemA > itemB) {
				return 1
			} else if (itemA < itemB) {
				return -1
			} else {
				return 0
			}
		})
	} else { // getState().feed.sortOrder === 'dec'
		itemsArray.sort(function (a, b) {
			const itemA = `${a[1].make} ${a[1].model}`
			const itemB = `${b[1].make} ${b[1].model}`
			if (itemA < itemB) {
				return 1
			} else if (itemA > itemB) {
				return -1
			} else {
				return 0
			}
		})
	}
	const sortedIds = itemsArray.map((item) => item[0])
	dispatch(settingFeedListenerSuccess(sortedIds))
}

export function sortFeedHardware () {
	return function (dispatch, getState) {
		applySortStatusHardware(dispatch, getState, 'hardware')
	}
}

export function applyNewSortOrder (dispatch, getState) {
	return new Promise(function (resolve, reject) {
		if (getState().feed.sortOrder === 'dec') {
			resolve(dispatch(updateSortOrder('asc')))
		} else {
			resolve(dispatch(updateSortOrder('dec')))
		}
	})
}

export function changeSortOrder () {
	return function (dispatch, getState) {
		applyNewSortOrder(dispatch, getState)
		.then(() => {
			const sortStatus = getState().feed.sortStatus
			if (sortStatus === 'purchasedAtDate' || sortStatus === 'dateCreated') {
				applySortStatusByDate(dispatch, getState, sortStatus)
			} else if (sortStatus === 'hardware') {
				applySortStatusHardware(dispatch, getState, sortStatus)
			} else if (sortStatus === 'peopleLastName') {
				applySortStatusPeople(dispatch, getState, sortStatus, 'lastName')
			} else if (sortStatus === 'peopleFirstName') {
				applySortStatusPeople(dispatch, getState, sortStatus, 'firstName')
			}
		})
	}
}

function addFilterOptions (options) {
	return {
		type: ADD_FILTER_OPTIONS,
		options,
	}
}

function updateFilterName (name, filterType) {
	return {
		type: UPDATE_FILTER_NAME_AND_TYPE,
		name,
		filterType,
	}
}

export function disableIsFiltering () {
	return function (dispatch, getState) {
		dispatch(updateIsFiltering())
		switch (getState().feed.sortStatus) {
		case 'purchasedAtDate':
			applySortStatusByDate(dispatch, getState, 'purchasedAtDate')
			return
		case 'peopleLastName':
			applySortStatusPeople(dispatch, getState, 'peopleLastName', 'lastName')
			return
		case 'peopleFirstName':
			applySortStatusPeople(dispatch, getState, 'peoplefirstName', 'firstName')
			return
		case 'hardware':
			applySortStatusHardware(dispatch, getState, 'hardware')
			return
		default: // dateCreated
			applySortStatusByDate(dispatch, getState, 'dateCreated')
			return
		}
	}
}

function updateIsFiltering () {
	return {
		type: UPDATE_IS_FILTERING,
	}
}

function filterByItem (dispatch, getState, itemId) {
	dispatch(settingFeedListenerSuccess([itemId]))
}

function filterByPerson (dispatch, getState, personId) {
	const items = getState().items
	const sortedIds = []
	for (let item in items) {
		items[item].itemPersonId === personId ? sortedIds.push(item) : ''
	}
	dispatch(settingFeedListenerSuccess(sortedIds))
}

function filterByHardware (dispatch, getState, hardwareId) {
	const items = getState().items
	const sortedIds = []
	for (let item in items) {
		items[item].itemHardwareId === hardwareId ? sortedIds.push(item) : ''
	}
	dispatch(settingFeedListenerSuccess(sortedIds))
}

export function updateAndHandleFilter (nameId) {
	return function (dispatch, getState) {
		return findFilterNameAndType(getState, nameId)
		.then(({name, filterType}) => {
			dispatch(updateFilterName(name, filterType))
			switch (filterType) {
			case 'people':
				filterByPerson(dispatch, getState, nameId[0])
			case 'hardware':
				filterByHardware(dispatch, getState, nameId[0])
			default:
				filterByItem(dispatch, getState, nameId[0])
			}
		})
	}
}

function findFilterNameAndType (getState, nameId) {
	return new Promise((resolve, reject) => {
		const items = getState().items
		const people = getState().people
		const hardware = getState().hardware
		for (const i in items) {
			if (items[i].itemId === nameId[0]) {
				resolve({ filterType: 'item', name: items[i].serial })
			}
		}
		for (const i in people) {
			if (people[i].personId === nameId[0]) {
				resolve({ filterType: 'people', name: `${people[i].firstName} ${people[i].lastName}` })
			}
		}
		for (const i in hardware) {
			if (hardware[i].hardwareId === nameId[0]) {
				resolve({ filterType: 'hardware', name: `${hardware[i].make} ${hardware[i].model}` })
			}
		}
	})
}

function buildFilterOptions (dispatch, items, people, hardware) {
	let options = {}
	for (const i in items) {
		const item = items[i]
		options = {
			...options,
			[item.itemId]: `${item.serial}`,
		}
	}
	for (const i in people) {
		const person = people[i]
		options = {
			...options,
			[person.personId]: `${person.firstName} ${person.lastName}`,
		}
	}
	for (const i in hardware) {
		const aHardware = hardware[i]
		options = {
			...options,
			[aHardware.hardwareId]: `${aHardware.make} ${aHardware.model}`,
		}
	}
	dispatch(addFilterOptions(options))
}

function filter (state, action) {
	switch (action.type) {
	case ADD_FILTER_OPTIONS:
		return {
			...state,
			options: action.options,
		}
	case UPDATE_FILTER_NAME_AND_TYPE:
		return {
			...state,
			isFiltering: true,
			name: action.name,
			filterType: action.filterType,
		}
	case UPDATE_IS_FILTERING: {
		return {
			...state,
			isFiltering: false,
		}
	}
	default:
		return state
	}
}

// REDUCERS
const initialState = {
	isFetching: false,
	error: '',
	itemIds: [],
	sortStatus: 'dateCreated',
	sortOrder: 'asc',
	filter: {
		isFiltering: false,
		options: {},
		filterType: '',
		name: '',
	},
}

export default function feed (state = initialState, action) {
	switch (action.type) {
	case SETTING_FEED_LISTENER :
		return {
			...state,
			isFetching: true,
		}
	case SETTING_FEED_LISTENER_ERROR:
		return {
			...state,
			isFetching: false,
			error: action.error,
		}
	case SETTING_FEED_LISTENER_SUCCESS:
		return {
			...state,
			isFetching: false,
			error: '',
			itemIds: action.itemIds,
		}
	case UPDATE_SORT_STATUS:
		return {
			...state,
			sortStatus: action.sortStatus,
		}
	case UPDATE_SORT_ORDER:
		return {
			...state,
			sortOrder: action.sortOrder,
		}
	case ADD_NEW_ITEM_TO_FEED:
		return {
			...state,
			itemIds: [action.itemId, ...state.itemIds],
		}
	case ADD_FILTER_OPTIONS:
	case UPDATE_FILTER_NAME_AND_TYPE:
	case UPDATE_IS_FILTERING:
		return {
			...state,
			filter: filter(state.filter, action),
		}
	default:
		return state
	}
}
