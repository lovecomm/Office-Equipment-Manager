import { addListener } from 'redux/modules/listeners'
import { listenToFeed, deleteData } from 'helpers/api'
import { prepItemsForFeed } from 'redux/modules/items'
import { prepPeopleForFeed } from 'redux/modules/people'
import { prepHardwaresForFeed } from 'redux/modules/hardwares'

const SETTING_FEED_LISTENER = 'SETTING_FEED_LISTENER'
const SETTING_FEED_LISTENER_ERROR = 'SETTING_FEED_LISTENER_ERROR'
const SETTING_FEED_LISTENER_SUCCESS_ITEMS = 'SETTING_FEED_LISTENER_SUCCESS_ITEMS'
const SETTING_FEED_LISTENER_SUCCESS_PEOPLE = 'SETTING_FEED_LISTENER_SUCCESS_PEOPLE'
const SETTING_FEED_LISTENER_SUCCESS_HARDWARE = 'SETTING_FEED_LISTENER_SUCCESS_HARDWARE'
const ADD_NEW_ITEM_TO_FEED = 'ADD_NEW_ITEM_TO_FEED'
const UPDATE_SORT_STATUS = 'UPDATE_SORT_STATUS'
const UPDATE_SORT_ORDER = 'UPDATE_SORT_ORDER'
const	ADD_FILTER_OPTIONS = 'ADD_FILTER_OPTIONS'
const UPDATE_FILTER_NAME_AND_TYPE = 'UPDATE_FILTER_NAME_AND_TYPE'
const UPDATE_IS_FILTERING = 'UPDATE_IS_FILTERING'
const UPDATE_CONFIRM_DELETE_ACTIVE = 'UPDATE_CONFIRM_DELETE_ACTIVE'
const UPDATE_TO_DELETE_ID = 'UPDATE_TO_DELETE_ID'
const UPDATE_TO_DELETE_TYPE = 'UPDATE_TO_DELETE_TYPE'
const UPDATE_ACTIVE_CARDS = 'UPDATE_ACTIVE_CARDS'

// ACTIONS
export function updateActiveCards (newCardType) {
	return {
		type: UPDATE_ACTIVE_CARDS,
		newCardType,
	}
}

export function updateConfirmDeleteActive (confirmDeleteActive) {
	return {
		type: UPDATE_CONFIRM_DELETE_ACTIVE,
		confirmDeleteActive,
	}
}

function updateToDeleteId (toDeleteId) {
	return {
		type: UPDATE_TO_DELETE_ID,
		toDeleteId,
	}
}

function updateToDeleteType (toDeleteType) {
	return {
		type: UPDATE_TO_DELETE_TYPE,
		toDeleteType,
	}
}

export function initiateDeleteData (dataType, dataId) {
	return function (dispatch, getState) {
		dispatch(updateConfirmDeleteActive(true))
		dispatch(updateToDeleteId(dataId))
		dispatch(updateToDeleteType(dataType))
	}
}

export function confirmDeleteData () {
	return function (dispatch, getState) {
		const dataType = getState().feed.toDeleteType
		const dataId = getState().feed.toDeleteId
		const items = getState().items
		// Delete from Firebase Storage
		deleteData(dataType, dataId, items, getState().people)
		// Delete from Redux state tree
		switch (dataType) {
		case 'people':
			buildFilterOptions(dispatch, getState)
			break
		case 'hardwares':
			const newHardwareItemIds = getState().feed.itemIds.filter((itemId) => {
				return items[itemId].hardwareId !== dataId
			})
			dispatch(settingFeedListenerSuccessItems(newHardwareItemIds))
			buildFilterOptions(dispatch, getState)
			break
		default: // items
			const newItemIds = getState().feed.itemIds.filter((id) => {
				return id !== dataId
			})
			dispatch(settingFeedListenerSuccessItems(newItemIds))
			buildFilterOptions(dispatch, getState)
		}
	}
}

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

function settingFeedListenerSuccessItems (itemIds) {
	return {
		type: SETTING_FEED_LISTENER_SUCCESS_ITEMS,
		itemIds,
	}
}

function settingFeedListenerSuccessPeople (personIds) {
	return {
		type: SETTING_FEED_LISTENER_SUCCESS_PEOPLE,
		personIds,
	}
}

function settingFeedListenerSuccessHardware (hardwareIds) {
	return {
		type: SETTING_FEED_LISTENER_SUCCESS_HARDWARE,
		hardwareIds,
	}
}

export function addNewItemToFeed (itemId) {
	return {
		type: ADD_NEW_ITEM_TO_FEED,
		itemId,
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
		dispatch(addListener('hardwares'))
		listenToFeed(({
			items,
			sortedItemIds,
			people,
			hardwares,
		}) => {
			dispatch(prepHardwaresForFeed(hardwares))
			.then(() => dispatch(prepPeopleForFeed(people)))
			.then(() => dispatch(prepItemsForFeed(items)))
			.then(() => {
				buildFilterOptions(dispatch, getState)
				if (initialFetch === true) {
					dispatch(settingFeedListenerSuccessItems(sortedItemIds))
					dispatch(settingFeedListenerSuccessPeople(getSortedPeopleIds(people)))
					dispatch(settingFeedListenerSuccessHardware(getSortedHardwareIds(hardwares)))
				}
				initialFetch = false
			})
		}, (error) => dispatch(settingFeedListenerError(error)))
	}
}

function getSortedPeopleIds (people) {
	let sortedPersonIds = []
	Object.keys(people).forEach((personId) => sortedPersonIds.push(personId))
	return sortedPersonIds
}

function getSortedHardwareIds (hardwares) {
	let sortedHardwareIds = []
	Object.keys(hardwares).forEach((hardwareId) => sortedHardwareIds.push(hardwareId))
	return sortedHardwareIds
}

function getActiveItems (getState, sortStatus) {
	return new Promise((resolve, reject) => {
		let items = getState().items
		let activeIds = getState().feed.itemIds
		let itemsArray = []
		if (sortStatus === 'peopleLastName' || sortStatus === 'peopleFirstName') {
			const people = getState().people
			for (let i in activeIds) {
				const itemId = activeIds[i]
				for (let i in items) {
					const item = items[i]
					if (item.itemId === itemId) {
						const person = people[item.personId]
						itemsArray.push([itemId, person])
					}
				}
			}
		} else if (sortStatus === 'hardwares') {
			const hardwares = getState().hardwares
			for (let i in activeIds) {
				const itemId = activeIds[i]
				for (let i in items) {
					const item = items[i]
					if (item.itemId === itemId) {
						const hardware = hardwares[item.hardwareId]
						itemsArray.push([itemId, hardware])
					}
				}
			}
		} else { // sort status === 'items'
			for (let i in activeIds) {
				const itemId = activeIds[i]
				itemsArray.push([itemId, items[itemId]])
			}
		}
		resolve(itemsArray)
	})
}

function applySortStatusByDate (dispatch, getState, sortStatus) {
	dispatch(updateSortStatus(sortStatus))
	getActiveItems(getState, sortStatus)
	.then((itemsArray) => {
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
		dispatch(settingFeedListenerSuccessItems(sortedIds))
	})
}

export function sortFeedCreationDate () {
	return function (dispatch, getState) {
		applySortStatusByDate(dispatch, getState, 'dateCreated')
	}
}

export function sortFeedPurchaseDate () {
	return function (dispatch, getState) {
		applySortStatusByDate(dispatch, getState, 'purchasedDate')
	}
}

function applySortStatusPeople (dispatch, getState, sortStatus, name) {
	dispatch(updateSortStatus(sortStatus))
	getActiveItems(getState, sortStatus)
	.then((itemsArray) => {
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
		dispatch(settingFeedListenerSuccessItems(sortedIds))
	})
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
	getActiveItems(getState, sortStatus)
	.then((itemsArray) => {
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
		dispatch(settingFeedListenerSuccessItems(sortedIds))
	})
}

export function sortFeedHardware () {
	return function (dispatch, getState) {
		applySortStatusHardware(dispatch, getState, 'hardwares')
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
			if (sortStatus === 'purchasedDate' || sortStatus === 'dateCreated') {
				applySortStatusByDate(dispatch, getState, sortStatus)
			} else if (sortStatus === 'hardwares') {
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

function restoreAllItemsToFeed (dispatch, getState) {
	return new Promise((resolve, reject) => {
		const items = getState().items
		const itemsArray = []
		for (const itemId in items) { itemsArray.push(itemId)	}
		dispatch(settingFeedListenerSuccessItems(itemsArray))
		resolve()
	})
}

export function disableIsFiltering () {
	return function (dispatch, getState) {
		restoreAllItemsToFeed(dispatch, getState)
		.then(() => {
			dispatch(updateIsFiltering())
			switch (getState().feed.sortStatus) {
			case 'purchasedDate':
				applySortStatusByDate(dispatch, getState, 'purchasedDate')
				return
			case 'peopleLastName':
				applySortStatusPeople(dispatch, getState, 'peopleLastName', 'lastName')
				return
			case 'peopleFirstName':
				applySortStatusPeople(dispatch, getState, 'peoplefirstName', 'firstName')
				return
			case 'hardwares':
				applySortStatusHardware(dispatch, getState, 'hardwares')
				return
			default: // dateCreated
				applySortStatusByDate(dispatch, getState, 'dateCreated')
				return
			}
		})
	}
}

function updateIsFiltering () {
	return {
		type: UPDATE_IS_FILTERING,
	}
}

function filterByItem (dispatch, getState, itemId) {
	dispatch(settingFeedListenerSuccessItems([itemId]))
}

function filterByPerson (dispatch, getState, personId) {
	const items = getState().items
	const sortedIds = []
	for (let item in items) {
		items[item].personId === personId ? sortedIds.push(item) : ''
	}
	dispatch(settingFeedListenerSuccessItems(sortedIds))
}

function filterByHardware (dispatch, getState, hardwareId) {
	const items = getState().items
	const sortedIds = []
	for (let item in items) {
		items[item].hardwareId === hardwareId ? sortedIds.push(item) : ''
	}
	dispatch(settingFeedListenerSuccessItems(sortedIds))
}

export function updateAndHandleFilter (nameId) {
	return function (dispatch, getState) {
		return findFilterNameAndType(getState, nameId)
		.then(({name, filterType}) => {
			dispatch(updateFilterName(name, filterType))
			switch (filterType) {
			case 'people':
				filterByPerson(dispatch, getState, nameId[0])
				return
			case 'hardwares':
				filterByHardware(dispatch, getState, nameId[0])
				return
			default:
				filterByItem(dispatch, getState, nameId[0])
				return
			}
		})
	}
}

function findFilterNameAndType (getState, nameId) {
	return new Promise((resolve, reject) => {
		const items = getState().items
		const people = getState().people
		const hardwares = getState().hardwares
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
		for (const i in hardwares) {
			if (hardwares[i].hardwareId === nameId[0]) {
				resolve({ filterType: 'hardwares', name: `${hardwares[i].make} ${hardwares[i].model}` })
			}
		}
	})
}

export function buildFilterOptions (dispatch, getState) {
	const items = getState().items
	const sortedItems = getState().feed.itemIds
	const people = getState().people
	const hardwares = getState().hardwares
	let options = {}
	if (sortedItems.length === 0) { // when the app first loads, it won't have the sortedIds yet. However, when we do things like delete items, we want this list to be based on those sorted items that are getting updated after something is deleted.
		for (const i in items) {
			const item = items[i]
			options = {
				...options,
				[item.itemId]: `${item.serial}`,
			}
		}
	} else {
		sortedItems.forEach((itemId) => {
			options = {
				...options,
				[itemId]: items[itemId].serial,
			}
		})
	}
	for (const i in people) {
		const person = people[i]
		options = {
			...options,
			[person.personId]: `${person.firstName} ${person.lastName}`,
		}
	}
	for (const i in hardwares) {
		const hardware = hardwares[i]
		options = {
			...options,
			[hardware.hardwareId]: `${hardware.make} ${hardware.model}`,
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
	activeCards: 'items',
	itemIds: [],
	personIds: [],
	hardwareIds: [],
	sortStatus: 'dateCreated',
	sortOrder: 'asc',
	filter: {
		isFiltering: false,
		options: {},
		filterType: '',
		name: '',
	},
	confirmDeleteActive: false,
	toDeleteType: '',
	toDeleteId: '',
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
	case SETTING_FEED_LISTENER_SUCCESS_ITEMS:
		return {
			...state,
			isFetching: false,
			error: '',
			itemIds: action.itemIds,
		}
	case SETTING_FEED_LISTENER_SUCCESS_PEOPLE: {
		return {
			...state,
			personIds: action.personIds,
		}
	}
	case SETTING_FEED_LISTENER_SUCCESS_HARDWARE: {
		return {
			...state,
			hardwareIds: action.hardwareIds,
		}
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
	case UPDATE_CONFIRM_DELETE_ACTIVE:
		return {
			...state,
			confirmDeleteActive: action.confirmDeleteActive,
		}
	case UPDATE_TO_DELETE_TYPE:
		return {
			...state,
			toDeleteType: action.toDeleteType,
		}
	case UPDATE_TO_DELETE_ID:
		return {
			...state,
			toDeleteId: action.toDeleteId,
		}
	case UPDATE_ACTIVE_CARDS:
		return {
			...state,
			activeCards: action.newCardType,
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
