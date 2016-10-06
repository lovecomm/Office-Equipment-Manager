import { saveNewPerson, saveUpdatedPerson } from 'helpers/api'

const PERSON_FORM_ADD_PEOPLE = 'PERSON_FORM_ADD_PEOPLE'
const OPEN_PERSON_FORM = 'OPEN_PERSON_FORM'
const CLOSE_PERSON_FORM = 'CLOSE_PERSON_FORM'
const UPDATE_PERSON_FORM_FIRST_NAME = 'UPDATE_PERSON_FORM_FIRST_NAME'
const UPDATE_PERSON_FORM_LAST_NAME = 'UPDATE_PERSON_FORM_LAST_NAME'
const UPDATE_PERSON_FORM_PERSON_ID = 'UPDATE_PERSON_FORM_PERSON_ID'
const UPDATE_PERSON_FORM_ERROR = 'UPDATE_PERSON_FORM_ERROR'
const UPDATE_PERSON_FORM_EDITING = 'UPDATE_PERSON_FORM_EDITING'

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

function updatePersonFormPersonId (personId) {
	return {
		type: UPDATE_PERSON_FORM_PERSON_ID,
		personId,
	}
}

export function updatePersonFormFirstName (firstName) {
	return {
		type: UPDATE_PERSON_FORM_FIRST_NAME,
		firstName,
	}
}

export function updatePersonFormLastName (lastName) {
	return {
		type: UPDATE_PERSON_FORM_LAST_NAME,
		lastName,
	}
}

function updatePersonFormError (error) {
	return {
		type: UPDATE_PERSON_FORM_ERROR,
		error,
	}
}

function updatePersonFormEditing () {
	return {
		type: UPDATE_PERSON_FORM_EDITING,
	}
}

function PersonFormAddPerson (people) {
	return {
		type: PERSON_FORM_ADD_PEOPLE,
		people,
	}
}

function activateCurrentPerson (dispatch, getState, personId) {
	return new Promise((resolve, reject) => {
		const person = getState().people[personId]
		dispatch(updatePersonFormEditing())
		dispatch(updatePersonFormPersonId(person.personId))
		dispatch(updatePersonFormFirstName(person.firstName))
		dispatch(updatePersonFormLastName(person.lastName))
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

export function newPersonFanout (person) {
	return function (dispatch, getState) {
		saveNewPerson(getState().people, person, getState().users.authedId)
		.then((personWithId) => {
			dispatch(PersonFormAddPerson(personWithId))
			dispatch(closePersonForm())
		})
		.catch((error) => {
			dispatch(updatePersonFormError(error.toString()))
		})
	}
}

export function updatePersonFanout (person) {
	return function (dispatch, getState) {
		saveUpdatedPerson(getState().people, person, getState().users.authedId)
		.then(() => dispatch(closePersonForm()))
		.catch((error) => dispatch(updatePersonFormError(error.toString())))
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
	case UPDATE_PERSON_FORM_PERSON_ID:
		return {
			...state,
			personId: action.personId,
		}
	case UPDATE_PERSON_FORM_FIRST_NAME:
		return {
			...state,
			firstName: action.firstName,
		}
	case UPDATE_PERSON_FORM_LAST_NAME:
		return {
			...state,
			lastName: action.lastName,
		}
	case UPDATE_PERSON_FORM_EDITING:
		return {
			...state,
			editing: true,
		}
	case PERSON_FORM_ADD_PEOPLE:
		return {
			...state,
			[action.people.personId]: action.people,
		}
	case UPDATE_PERSON_FORM_ERROR:
		return {
			...state,
			error: action.error,
		}
	default :
		return state
	}
}
