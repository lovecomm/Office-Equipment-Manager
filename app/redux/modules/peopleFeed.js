import { getUrl } from 'helpers/api'
import { getSortedFeedIds } from 'helpers/sorting'
import { buildFilterOptions } from 'helpers/filtering'

const UPDATE_PEOPLE_FEED_PEOPLE = 'UPDATE_PEOPLE_FEED_PEOPLE'
const UPDATE_PEOPLE_FEED_INITIAL_FETCH = 'UPDATE_PEOPLE_FEED_INITIAL_FETCH'
const UPDATE_PERSON_PHOTO_URL = 'UPDATE_PERSON_PHOTO_URL'
const UPDATE_PERSON_COLLAPSED = 'UPDATE_PERSON_COLLAPSED'
const ADD_PEOPLE_FILTER_OPTIONS = 'ADD_PEOPLE_FILTER_OPTIONS'
const UPDATE_PEOPLE_FILTER_NAME = 'UPDATE_PEOPLE_FILTER_NAME'
const UPDATE_IS_FILTERING_PEOPLE = 'UPDATE_IS_FILTERING_PEOPLE'
const UPDATE_PEOPLE_SORT_ORDER = 'UPDATE_PEOPLE_SORT_ORDER'
const UPDATE_PEOPLE_SORT_STATUS = 'UPDATE_PEOPLE_SORT_STATUS'
const UPDATE_PEOPLE_FEED_IDS = 'UPDATE_PEOPLE_FEED_IDS'

// THUNKS & HELPERS
export function prepPeopleForFeed (people, items) {
	return function (dispatch, getState) {
		return new Promise((resolve, reject) => {
			dispatch(updatePeopleFeedPeople(people))
			dispatch(updatePeopleFeedIds(Object.keys(people)))
			dispatch(sortPeopleFeedBy('firstName'))
			buildFilterOptions(people, 'person', ['firstName', 'lastName'])
			.then((filterOptions) => dispatch(addPeopleFilterOptions(filterOptions)))
			dispatch(getPeopleUrlFromFirebase(people))
			if (getState().peopleFeed.initialFetch === true) dispatch(updatePeopleFeedInitialFetch(false))
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
export function updateAndHandlePeopleFilter (filterId) {
	return function (dispatch, getState) {
		const person = getState().peopleFeed.people[filterId]
		dispatch(updatePeopleFilterName(`${person.firstName} ${person.lastName}`))
		dispatch(updatePeopleFeedIds([filterId]))
	}
}

export function disableIsFilteringPeople () {
	return function (dispatch, getState) {
		dispatch(updatePeopleFeedIds(Object.keys(getState().peopleFeed.people)))
		dispatch(sortPeopleFeedBy(getState().peopleFeed.sorting.sortStatus))
		dispatch(updateIsFilteringPeople())
	}
}
// END FILTER FUNCTIONS
// START SORTING FUNCTIONS
export function reversePeopleSortOrder () {
	return function (dispatch, getState) {
		dispatch(applyNewPeopleSortOrder())
		.then(() => dispatch(sortPeopleFeedBy(getState().peopleFeed.sorting.sortStatus)))
	}
}

function applyNewPeopleSortOrder () {
	return function (dispatch, getState) {
		return new Promise(function (resolve, reject) {
			if (getState().peopleFeed.sorting.sortOrder === 'dec') {
				resolve(dispatch(updatePeopleSortOrder('asc')))
			} else {
				resolve(dispatch(updatePeopleSortOrder('dec')))
			}
		})
	}
}

export function sortPeopleFeedBy (sortStatus) {
	return function (dispatch, getState) {
		dispatch(updatePeopleSortStatus(sortStatus))
		getSortedFeedIds(getState().peopleFeed, 'people', sortStatus)
		.then((sortedFeedIds) => dispatch(updatePeopleFeedIds(sortedFeedIds)))
	}
}
// END SORTING FUNCTIONS

// ACTIONS
function updatePeopleFeedIds (feedIds) {
	return {
		type: UPDATE_PEOPLE_FEED_IDS,
		feedIds,
	}
}

function updateIsFilteringPeople () {
	return {
		type: UPDATE_IS_FILTERING_PEOPLE,
	}
}

function updatePeopleFilterName (name) {
	return {
		type: UPDATE_PEOPLE_FILTER_NAME,
		name,
	}
}

function addPeopleFilterOptions (options) {
	return {
		type: ADD_PEOPLE_FILTER_OPTIONS,
		options,
	}
}

function updatePeopleSortStatus (sortStatus) {
	return {
		type: UPDATE_PEOPLE_SORT_STATUS,
		sortStatus,
	}
}

function updatePeopleSortOrder (sortOrder) {
	return {
		type: UPDATE_PEOPLE_SORT_ORDER,
		sortOrder,
	}
}

function updatePeopleFeedPeople (people) {
	return {
		type: UPDATE_PEOPLE_FEED_PEOPLE,
		people,
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
	personId: '',
	firstName: '',
	lastName: '',
	createdBy: '',
	dateCreated: '',
	dateLastUpdated: '',
	itemIds: {},
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
	case UPDATE_PEOPLE_FILTER_NAME:
		return {
			...state,
			isFiltering: true,
			name: action.name,
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
	switch (action.type) {
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
	default:
		return state
	}
}

const initialState = {
	initialFetch: true,
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
	case UPDATE_PEOPLE_FEED_INITIAL_FETCH:
		return {
			...state,
			initialFetch: action.initialFetch,
		}
	case UPDATE_PEOPLE_FEED_PEOPLE:
		return {
			...state,
			people: action.people,
		}
	case UPDATE_PEOPLE_FEED_IDS:
		return {
			...state,
			feedIds: action.feedIds,
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
	case UPDATE_PEOPLE_FILTER_NAME:
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
