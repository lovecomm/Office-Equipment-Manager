const ADD_PEOPLE_TO_TREE = 'ADD_PEOPLE_TO_TREE'

// ACTIONS
export function addPeopleToTree (people) {
	return {
		type: ADD_PEOPLE_TO_TREE,
		people,
	}
}

// REDUCERS
const initialState = {
	lastUpdated: new Date(),
}

export default function people (state = initialState, action) {
	switch (action.type) {
	case ADD_PEOPLE_TO_TREE:
		return {
			...state,
			...action.people,
		}
	default:
		return state
	}
}
