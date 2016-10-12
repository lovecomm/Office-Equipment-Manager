import { getUrl } from 'helpers/api'

const ADD_PEOPLE_TO_FEED = 'ADD_PEOPLE_TO_FEED'
const UPDATE_PERSON_COLLAPSED = 'UPDATE_PERSON_COLLAPSED'
const UPDATE_PERSON_PHOTO_URL = 'UPDATE_PERSON_PHOTO_URL'

// ACTIONS
export function prepPeopleForFeed (people) {
	return function (dispatch, getState) {
		return new Promise((resolve, reject) => {
			dispatch(getPeopleUrlFromFirebase(people))
			dispatch(addPersonToFeed(people))
			resolve()
		})
	}
}

function addPersonToFeed (people) {
	return {
		type: ADD_PEOPLE_TO_FEED,
		people,
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

function updatePersonPhotoUrl (personId, photoUrl) {
	return {
		type: UPDATE_PERSON_PHOTO_URL,
		personId,
		photoUrl,
	}
}

export function handlePersonCollapsed (personId, collapsed) {
	return function (dispatch, getState) {
		return new Promise((resolve, reject) => {
			Object.keys(getState().people).forEach((personId) => {
				dispatch(updatePersonCollapsed(personId, true))
			})
			resolve()
		})
		.then(() => dispatch(updatePersonCollapsed(personId, collapsed)))
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

const initialState = {}

export default function people (state = initialState, action) {
	switch (action.type) {
	case ADD_PEOPLE_TO_FEED:
		return {
			...state,
			...action.people,
		}
	case UPDATE_PERSON_PHOTO_URL:
	case UPDATE_PERSON_COLLAPSED:
		return {
			...state,
			[action.personId]: person(state[action.personId], action),
		}
	default:
		return state
	}
}
