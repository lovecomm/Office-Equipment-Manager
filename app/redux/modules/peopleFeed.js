import { getUrl } from 'helpers/api'

const ADD_PEOPLE_TO_FEED = 'ADD_PEOPLE_TO_FEED'
const SETTING_FEED_LISTENER_SUCCESS_PEOPLE = 'SETTING_FEED_LISTENER_SUCCESS_PEOPLE'
const UPDATE_PEOPLE_FEED_INITIAL_FETCH = 'UPDATE_PEOPLE_FEED_INITIAL_FETCH'
const UPDATE_PERSON_PHOTO_URL = 'UPDATE_PERSON_PHOTO_URL'
const UPDATE_PERSON_COLLAPSED = 'UPDATE_PERSON_COLLAPSED'

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

const initialState = {
	initialFetch: true,
	isFetching: false,
	feedIds: [],
	filter: {},
	sorting: {},
	people: {},
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
	default:
		return state
	}
}
