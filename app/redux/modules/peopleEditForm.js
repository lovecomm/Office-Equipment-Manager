import { savePeople } from 'helpers/api'

const SAVE_EDITED_PERSON = 'SAVE_EDITED_PERSON'
const OPEN_PEOPLE_EDIT_FORM = 'OPEN_PEOPLE_EDIT_FORM'
const CLOSE_PEOPLE_EDIT_FORM = 'CLOSE_PEOPLE_EDIT_FORM'
const UPDATE_EDIT_FORM_FIRST_NAME_TEXT = 'UPDATE_EDIT_FORM_FIRST_NAME_TEXT'
const UPDATE_EDIT_FORM_LAST_NAME_TEXT = 'UPDATE_EDIT_FORM_LAST_NAME_TEXT'
const UPDATE_PEOPLE_EDIT_FORM_PERSON_ID = 'UPDATE_PEOPLE_EDIT_FORM_PERSON_ID'
const UPDATE_PEOPLE_EDIT_FORM_ERROR = 'UPDATE_PEOPLE_EDIT_FORM_ERROR'

// ACTIONS
function activateCurrentPerson (dispatch, getState, personId) {
	return new Promise((resolve, reject) => {
		const person = getState().people[personId]
		dispatch(updatePeopleEditFormPersonId(person.personId))
		dispatch(updateEditFormFirstNameText(person.firstName))
		dispatch(updateEditFormLastNameText(person.lastName))
		resolve(true)
	})
}

export function initiatePeopleEditForm (personId) {
	return function (dispatch, getState) {
		activateCurrentPerson(dispatch, getState, personId)
		.then(() => {
			dispatch(openPeopleEditForm())
		})
	}
}

export function openPeopleEditForm () {
	return {
		type: OPEN_PEOPLE_EDIT_FORM,
	}
}

export function closePeopleEditForm () {
	return {
		type: CLOSE_PEOPLE_EDIT_FORM,
	}
}

function updatePeopleEditFormPersonId (personId) {
	return {
		type: UPDATE_PEOPLE_EDIT_FORM_PERSON_ID,
		personId,
	}
}

export function updateEditFormFirstNameText (firstNameText) {
	return {
		type: UPDATE_EDIT_FORM_FIRST_NAME_TEXT,
		firstNameText,
	}
}

export function updateEditFormLastNameText (lastNameText) {
	return {
		type: UPDATE_EDIT_FORM_LAST_NAME_TEXT,
		lastNameText,
	}
}

function updatePeopleEditFormError (error) {
	return {
		type: UPDATE_PEOPLE_EDIT_FORM_ERROR,
		error,
	}
}

function saveEditedPerson (person) {
	return {
		type: SAVE_EDITED_PERSON,
		person,
	}
}

export function peopleEditFanout (person) {
	return function (dispatch, getState) {
		const uid = getState().users.authedId
		savePeople(person, { uid: uid })
		.then((personWithId) => {
			dispatch(saveEditedPerson(personWithId))
			dispatch(closePeopleEditForm())
		})
		.catch((error) => {
			dispatch(updatePeopleEditFormError(error.toString()))
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
}

export default function peopleEditForm (state = initialState, action) {
	switch (action.type) {
	case OPEN_PEOPLE_EDIT_FORM:
		return {
			...state,
			isOpen: true,
		}
	case CLOSE_PEOPLE_EDIT_FORM:
		return {
			personId: '',
			firstNameText: '',
			lastNameText: '',
			isOpen: false,
			error: '',
		}
	case UPDATE_PEOPLE_EDIT_FORM_PERSON_ID:
		return {
			...state,
			personId: action.personId,
		}
	case UPDATE_EDIT_FORM_FIRST_NAME_TEXT:
		return {
			...state,
			firstNameText: action.firstNameText,
		}
	case UPDATE_EDIT_FORM_LAST_NAME_TEXT:
		return {
			...state,
			lastNameText: action.lastNameText,
		}
	case SAVE_EDITED_PERSON:
		return {
			...state,
			[action.person.personId]: action.person,
		}
	case UPDATE_PEOPLE_EDIT_FORM_ERROR:
		return {
			...state,
			error: action.error,
		}
	default :
		return state
	}
}
