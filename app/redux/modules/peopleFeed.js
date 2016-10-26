import { getUrl } from 'helpers/api'

const ADD_PEOPLE_TO_FEED = 'ADD_PEOPLE_TO_FEED'
const SETTING_FEED_LISTENER_SUCCESS_PEOPLE = 'SETTING_FEED_LISTENER_SUCCESS_PEOPLE'
const UPDATE_PEOPLE_FEED_INITIAL_FETCH = 'UPDATE_PEOPLE_FEED_INITIAL_FETCH'
const UPDATE_PERSON_PHOTO_URL = 'UPDATE_PERSON_PHOTO_URL'
const UPDATE_PERSON_COLLAPSED = 'UPDATE_PERSON_COLLAPSED'
const ADD_PEOPLE_FILTER_OPTIONS = 'ADD_PEOPLE_FILTER_OPTIONS'
const UPDATE_PEOPLE_FILTER_NAME_AND_TYPE = 'UPDATE_PEOPLE_FILTER_NAME_AND_TYPE'
const UPDATE_IS_FILTERING_PEOPLE = 'UPDATE_IS_FILTERING_PEOPLE'
const UPDATE_PEOPLE_SORT_ORDER = 'UPDATE_PEOPLE_SORT_ORDER'
const UPDATE_PEOPLE_SORT_STATUS = 'UPDATE_PEOPLE_SORT_STATUS'

// THUNKS & HELPERS
export function prepPeopleForFeed (people) {
	return function (dispatch, getState) {
		return new Promise((resolve, reject) => {
			dispatch(addPeopleToFeed(people))
			if (getState().peopleFeed.initialFetch === true) {
				dispatch(getPeopleUrlFromFirebase(people))
				dispatch(updatePeopleFeedInitialFetch(false))
			}
			resolve()
		})
	}
}

function getPeopleUrlFromFirebase (people) {
	return function (dispatch, getState) {
		return new Promise((resolve, reject) => {
			Object.keys(people).forEach((personId) => {
				getUrl('people', people[personId].photo.name)
				.then((downloadUrl) => {
					dispatch(updatePersonPhotoUrl(personId, downloadUrl))
				})
			})
			resolve()
		})
	}
}

export function handlePersonCollapsed (personId, collapsed) {
	return function (dispatch, getState) {
		return new Promise((resolve, reject) => {
			Object.keys(getState().peopleFeed.people).forEach((personId) => {
				dispatch(updatePersonCollapsed(personId, true))
			})
			resolve()
		})
		.then(() => dispatch(updatePersonCollapsed(personId, collapsed)))
	}
}

// START FILTER FUNCTIONS
export function updateAndHandlePeopleFilter (nameId) {
	return function (dispatch, getState) {
		// return findFilterNameAndType(getState, nameId)
		// .then(({name, filterType}) => {
		// 	dispatch(updateFilterName(name, filterType))
		// 	filterByPerson(dispatch, getState, nameId[0])
		// })
	}
}

export function disableIsFilteringPeople () {
	return function (dispatch, getState) {
		// restoreAllItemsToFeed(dispatch, getState)
		// .then(() => {
		// 	dispatch(updateIsFiltering())
		// 	switch (getState().feed.sortStatus) {
		// 	case 'purchasedDate':
		// 		applySortStatusByDate(dispatch, getState, 'purchasedDate')
		// 		return
		// 	case 'peopleLastName':
		// 		applySortStatusPeople(dispatch, getState, 'peopleLastName', 'lastName')
		// 		return
		// 	case 'peopleFirstName':
		// 		applySortStatusPeople(dispatch, getState, 'peoplefirstName', 'firstName')
		// 		return
		// 	case 'hardwares':
		// 		applySortStatusHardware(dispatch, getState, 'hardwares')
		// 		return
		// 	default: // dateCreated
		// 		applySortStatusByDate(dispatch, getState, 'dateCreated')
		// 		return
		// 	}
		// })
	}
}
// END FILTER FUNCTIONS
// START SORTING FUNCTIONS
export function changeSortOrder () {
	return function (dispatch, getState) {
		// applyNewSortOrder(dispatch, getState)
		// .then(() => {
		// 	const sortStatus = getState().feed.sortStatus
		// 	if (sortStatus === 'purchasedDate' || sortStatus === 'dateCreated') {
		// 		applySortStatusByDate(dispatch, getState, sortStatus)
		// 	} else if (sortStatus === 'hardwares') {
		// 		applySortStatusHardware(dispatch, getState, sortStatus)
		// 	} else if (sortStatus === 'peopleLastName') {
		// 		applySortStatusPeople(dispatch, getState, sortStatus, 'lastName')
		// 	} else if (sortStatus === 'peopleFirstName') {
		// 		applySortStatusPeople(dispatch, getState, sortStatus, 'firstName')
		// 	}
		// })
	}
}

export function sortFeedCreationDate () {
	return function (dispatch, getState) {
		// applySortStatusByDate(dispatch, getState, 'dateCreated')
	}
}

export function sortFeedLastName () {
	return function (dispatch, getState) {
		// applySortStatusPeople(dispatch, getState, 'peopleLastName', 'lastName')
	}
}

export function sortFeedFirstName () {
	return function (dispatch, getState) {
		// applySortStatusPeople(dispatch, getState, 'peopleFirstName', 'firstName')
	}
}
// END SORTING FUNCTIONS

// ACTIONS
function addPeopleToFeed (people) {
	return {
		type: ADD_PEOPLE_TO_FEED,
		people,
		feedIds: Object.keys(people),
	}
}

function updatePeopleFeedInitialFetch (initialFetch) {
	return {
		type: UPDATE_PEOPLE_FEED_INITIAL_FETCH,
		initialFetch,
	}
}

function updatePersonPhotoUrl (personId, photoUrl) {
	return {
		type: UPDATE_PERSON_PHOTO_URL,
		personId,
		photoUrl,
	}
}

function updatePersonCollapsed (personId, collapsed) {
	return {
		type: UPDATE_PERSON_COLLAPSED,
		personId,
		collapsed,
	}
}

// REDUCERS
const initialPersonPhotoState = {
	bucket: '',
	fullPath: '',
	name: '',
	size: 0,
	type: '',
	url: '',
}

function photoPerson (state = initialPersonPhotoState, action) {
	switch (action.type) {
	case UPDATE_PERSON_PHOTO_URL:
		return {
			...state,
			url: action.photoUrl,
		}
	default:
		return state
	}
}

const initialPersonState = {
	firstName: '',
	lastName: '',
	items: {},
	numberOfItems: 0,
	collapsed: true,
}

function person (state = initialPersonState, action) {
	switch (action.type) {
	case UPDATE_PERSON_COLLAPSED:
		return {
			...state,
			collapsed: action.collapsed,
		}
	case UPDATE_PERSON_PHOTO_URL:
		return {
			...state,
			photo: photoPerson(state.photo, action),
		}
	default:
		return state
	}
}

function filterPeople (state, action) {
	switch (action.type) {
	case ADD_PEOPLE_FILTER_OPTIONS:
		return {
			...state,
			options: action.options,
		}
	case UPDATE_PEOPLE_FILTER_NAME_AND_TYPE:
		return {
			...state,
			isFiltering: true,
			name: action.name,
			filterType: action.filterType,
		}
	case UPDATE_IS_FILTERING_PEOPLE: {
		return {
			...state,
			isFiltering: false,
		}
	}
	default:
		return state
	}
}

function sortingPeople (state, action) {
	switch (action) {
	case UPDATE_PEOPLE_SORT_STATUS:
		return {
			...state,
			sortStatus: action.sortStatus,
		}
	case UPDATE_PEOPLE_SORT_ORDER:
		return {
			...state,
			sortOrder: action.sortOrder,
		}
	}
}

const initialState = {
	initialFetch: true,
	isFetching: false,
	feedIds: [],
	people: {},
	filter: {
		isFiltering: false,
		options: {},
		filterType: '',
		name: '',
	},
	sorting: {
		sortStatus: 'firstName',
		sortOrder: 'asc',
	},
}

export default function peopleFeed (state = initialState, action) {
	switch (action.type) {
	case SETTING_FEED_LISTENER_SUCCESS_PEOPLE:
		return {
			...state,
			isFetching: true,
		}
	case UPDATE_PEOPLE_FEED_INITIAL_FETCH:
		return {
			...state,
			initialFetch: action.initialFetch,
		}
	case ADD_PEOPLE_TO_FEED:
		return {
			...state,
			feedIds: action.feedIds,
			people: action.people,
		}
	case UPDATE_PERSON_PHOTO_URL:
	case UPDATE_PERSON_COLLAPSED:
		return {
			...state,
			people: {
				...state.people,
				[action.personId]: person(state.people[action.personId], action),
			},
		}
	case ADD_PEOPLE_FILTER_OPTIONS:
	case UPDATE_PEOPLE_FILTER_NAME_AND_TYPE:
	case UPDATE_IS_FILTERING_PEOPLE:
		return {
			...state,
			filter: filterPeople(state.filter, action),
		}
	case UPDATE_PEOPLE_SORT_ORDER:
	case UPDATE_PEOPLE_SORT_STATUS:
		return {
			...state,
			sorting: sortingPeople(state.sorting, action),
		}
	default:
		return state
	}
}
