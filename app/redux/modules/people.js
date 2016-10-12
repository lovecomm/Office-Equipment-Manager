const ADD_PEOPLE_TO_FEED = 'ADD_PEOPLE_TO_FEED'
const UPDATE_PERSON_COLLAPSED = 'UPDATE_PERSON_COLLAPSED'

// ACTIONS
export function prepPeopleForFeed (people) {
	return function (dispatch, getState) {
		return new Promise((resolve, reject) => {
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

export function handleCollapsed (personId, collapsed) {
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
	case UPDATE_PERSON_COLLAPSED:
		return {
			...state,
			[action.personId]: person(state[action.personId], action),
		}
	default:
		return state
	}
}
