import { savePerson } from 'helpers/api'

const ADD_PEOPLE = 'ADD_PEOPLE'
const OPEN_PERSON_FORM = 'OPEN_PERSON_FORM'
const CLOSE_PERSON_FORM = 'CLOSE_PERSON_FORM'
const UPDATE_FIRST_NAME = 'UPDATE_FIRST_NAME'
const UPDATE_LAST_NAME = 'UPDATE_LAST_NAME'
const UPDATE_PERSON_ID = 'UPDATE_PERSON_ID'
const UPDATE_ERROR = 'UPDATE_ERROR'
const UPDATE_EDITING = 'UPDATE_EDITING'

// ACTIONS
export function openPersonForm () {
	return {
		type: OPEN_PERSON_FORM,
	}
}

export function closePersonForm () {
	return {
		type: CLOSE_PERSON_FORM,
	}
}

function updatePersonId (personId) {
	return {
		type: UPDATE_PERSON_ID,
		personId,
	}
}

export function updateFirstName (firstName) {
	return {
		type: UPDATE_FIRST_NAME,
		firstName,
	}
}

export function updateLastName (lastName) {
	return {
		type: UPDATE_LAST_NAME,
		lastName,
	}
}

function updateError (error) {
	return {
		type: UPDATE_ERROR,
		error,
	}
}

function updateEditing () {
	return {
		type: UPDATE_EDITING,
	}
}

function addPerson (people) {
	return {
		type: ADD_PEOPLE,
		people,
	}
}

function activateCurrentPerson (dispatch, getState, personId) {
	return new Promise((resolve, reject) => {
		const person = getState().people[personId]
		dispatch(updatePersonId(person.personId))
		dispatch(updateFirstName(person.firstName))
		dispatch(updateLastName(person.lastName))
		dispatch(updateEditing())
		resolve(true)
	})
}

export function initiatePersonForm (personId) {
	return function (dispatch, getState) {
		activateCurrentPerson(dispatch, getState, personId)
		.then(() => {
			dispatch(openPersonForm())
		})
	}
}

export function personFanout (person) {
	return function (dispatch, getState) {
		const uid = getState().users.authedId
		savePerson(person, { uid: uid })
		.then((personWithId) => {
			dispatch(addPerson(personWithId))
			dispatch(closePersonForm())
		})
		.catch((error) => {
			dispatch(updateError(error.toString()))
		})
	}
}

// REDUCERS
const initialState = {
	personId: '',
	firstName: '',
	lastName: '',
	isOpen: false,
	error: '',
	editing: false,
}

export default function personForm (state = initialState, action) {
	switch (action.type) {
	case OPEN_PERSON_FORM:
		return {
			...state,
			isOpen: true,
		}
	case CLOSE_PERSON_FORM:
		return {
			personId: '',
			firstName: '',
			lastName: '',
			isOpen: false,
			error: '',
			editing: false,
		}
	case UPDATE_PERSON_ID:
		return {
			...state,
			personId: action.personId,
		}
	case UPDATE_FIRST_NAME:
		return {
			...state,
			firstName: action.firstName,
		}
	case UPDATE_LAST_NAME:
		return {
			...state,
			lastName: action.lastName,
		}
	case UPDATE_EDITING:
		return {
			...state,
			editing: true,
		}
	case ADD_PEOPLE:
		return {
			...state,
			[action.people.peopleId]: action.people,
		}
	case UPDATE_ERROR:
		return {
			...state,
			error: action.error,
		}
	default :
		return state
	}
}
