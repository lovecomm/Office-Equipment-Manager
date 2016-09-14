import { savePeople } from 'helpers/api'

const ADD_PEOPLE = 'ADD_PEOPLE'
const OPEN_PEOPLE_FORM = 'OPEN_PEOPLE_FORM'
const CLOSE_PEOPLE_FORM = 'CLOSE_PEOPLE_FORM'
const UPDATE_PEOPLE_FIRST_NAME_TEXT = 'UPDATE_PEOPLE_FIRST_NAME_TEXT'
const UPDATE_PEOPLE_LAST_NAME_TEXT = 'UPDATE_PEOPLE_LAST_NAME_TEXT'
const UPDATE_PEOPLE_PERSON_ID = 'UPDATE_PEOPLE_PERSON_ID'
const UPDATE_PEOPLE_FORM_ERROR = 'UPDATE_PEOPLE_FORM_ERROR'
const UPDATE_PEOPLE_FORM_EDITING = 'UPDATE_PEOPLE_FORM_EDITING'

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

function updatePeoplePersonId (personId) {
	return {
		type: UPDATE_PEOPLE_PERSON_ID,
		personId,
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

function updatePeopleFormEditing () {
	return {
		type: UPDATE_PEOPLE_FORM_EDITING,
	}
}

function addPeople (people) {
	return {
		type: ADD_PEOPLE,
		people,
	}
}

function activateCurrentPerson (dispatch, getState, personId) {
	return new Promise((resolve, reject) => {
		const person = getState().people[personId]
		dispatch(updatePeoplePersonId(person.personId))
		dispatch(updateFirstNameText(person.firstName))
		dispatch(updateLastNameText(person.lastName))
		dispatch(updatePeopleFormEditing())
		resolve(true)
	})
}

export function initiatePeopleForm (personId) {
	console.log('in initiatePeopleForm')
	return function (dispatch, getState) {
		activateCurrentPerson(dispatch, getState, personId)
		.then(() => {
			dispatch(openPeopleForm())
		})
	}
}

export function peopleFanout (person) {
	return function (dispatch, getState) {
		const uid = getState().users.authedId
		savePeople(person, { uid: uid })
		.then((personWithId) => {
			dispatch(addPeople(personWithId))
			dispatch(closePeopleForm())
		})
		.catch((error) => {
			dispatch(updatePeopleFormError(error.toString()))
		})
	}
}

// REDUCERS
const initialState = {
	personId: '',
	firstNameText: '',
	lastNameText: '',
	isOpen: false,
	error: '',
	editing: false,
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
			personId: '',
			firstNameText: '',
			lastNameText: '',
			isOpen: false,
			error: '',
			editing: false,
		}
	case UPDATE_PEOPLE_PERSON_ID:
		return {
			...state,
			personId: action.personId,
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
	case UPDATE_PEOPLE_FORM_EDITING:
		return {
			...state,
			editing: true,
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
