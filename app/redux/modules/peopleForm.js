import { savePeople } from 'helpers/api'

const ADD_PEOPLE = 'ADD_PEOPLE'
const OPEN_PEOPLE_FORM = 'OPEN_PEOPLE_FORM'
const CLOSE_PEOPLE_FORM = 'CLOSE_PEOPLE_FORM'
const UPDATE_PEOPLE_FIRST_NAME_TEXT = 'UPDATE_PEOPLE_FIRST_NAME_TEXT'
const UPDATE_PEOPLE_LAST_NAME_TEXT = 'UPDATE_PEOPLE_LAST_NAME_TEXT'
const UPDATE_PEOPLE_EMAIL_TEXT = 'UPDATE_PEOPLE_EMAIL_TEXT'
const UPDATE_PEOPLE_PHOTO = 'UPDATE_PEOPLE_PHOTO'
const UPDATE_PEOPLE_FORM_ERROR = 'UPDATE_PEOPLE_FORM_ERROR'

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

export function updateEmailText (emailText) {
	return {
		type: UPDATE_PEOPLE_EMAIL_TEXT,
		emailText,
	}
}

export function updatePhoto (photo) {
	return {
		type: UPDATE_PEOPLE_PHOTO,
		photo,
	}
}

function updatePeopleFormError (error) {
	return {
		type: UPDATE_PEOPLE_FORM_ERROR,
		error
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
	emailText: '',
	photo: {},
	photoNameText: '',
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
			emailText: '',
			photo: {},
			photoNameText: '',
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
	case UPDATE_PEOPLE_EMAIL_TEXT:
		return {
			...state,
			emailText: action.emailText,
		}
	case UPDATE_PEOPLE_PHOTO:
		return {
			...state,
			photo: action.photo,
			photoNameText: action.photo.name,
		}
	case ADD_PEOPLE:
		return {
			...state,
			[action.people.peopleId]: action.people,
		}
	case UPDATE_PEOPLE_FORM_ERROR:
		return {
			...state,
			error: action.error
		}
	default :
		return state
	}
}
