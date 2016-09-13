import { savePeople } from 'helpers/api'

const ADD_PEOPLE = 'ADD_PEOPLE'
const OPEN_PEOPLE_FORM = 'OPEN_PEOPLE_FORM'
const CLOSE_PEOPLE_FORM = 'CLOSE_PEOPLE_FORM'
const UPDATE_PEOPLE_FIRST_NAME_TEXT = 'UPDATE_PEOPLE_FIRST_NAME_TEXT'
const UPDATE_PEOPLE_LAST_NAME_TEXT = 'UPDATE_PEOPLE_LAST_NAME_TEXT'
const UPDATE_PEOPLE_FORM_ERROR = 'HARDWARE'

// ACTIONS
export function openPeopleForm () {
	return {
		type: OPEN_PEOPLE_FORM,
	}
}

export function closePeopleForm () {
	return {
		type: CLOSE_PEOPLE_FORM,
	}
}

export function updateFirstNameText (firstNameText) {
	return {
		type: UPDATE_PEOPLE_FIRST_NAME_TEXT,
		firstNameText,
	}
}

export function updateLastNameText (lastNameText) {
	return {
		type: UPDATE_PEOPLE_LAST_NAME_TEXT,
		lastNameText,
	}
}

function updatePeopleFormError (error) {
	return {
		type: UPDATE_PEOPLE_FORM_ERROR,
		error,
	}
}

function addPeople (people) {
	return {
		type: ADD_PEOPLE,
		people,
	}
}

export function peopleFanout (people) {
	return function (dispatch, getState) {
		const uid = getState().users.authedId
		savePeople(people, { uid: uid })
		.then((peopleWithId) => {
			dispatch(addPeople(peopleWithId))
			dispatch(closePeopleForm())
		})
		.catch((error) => {
			dispatch(updatePeopleFormError(error))
		})
	}
}

// REDUCERS
const initialState = {
	firstNameText: '',
	lastNameText: '',
	isOpen: false,
	error: '',
}

export default function peopleForm (state = initialState, action) {
	switch (action.type) {
	case OPEN_PEOPLE_FORM:
		return {
			...state,
			isOpen: true,
		}
	case CLOSE_PEOPLE_FORM:
		return {
			firstNameText: '',
			lastNameText: '',
			isOpen: false,
			error: '',
		}
	case UPDATE_PEOPLE_FIRST_NAME_TEXT:
		return {
			...state,
			firstNameText: action.firstNameText,
		}
	case UPDATE_PEOPLE_LAST_NAME_TEXT:
		return {
			...state,
			lastNameText: action.lastNameText,
		}
	case ADD_PEOPLE:
		return {
			...state,
			[action.people.peopleId]: action.people,
		}
	case UPDATE_PEOPLE_FORM_ERROR:
		return {
			...state,
			error: action.error,
		}
	default :
		return state
	}
}
