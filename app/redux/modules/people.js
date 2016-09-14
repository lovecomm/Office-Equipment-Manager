const ADD_PEOPLE_TO_FEED = 'ADD_PEOPLE_TO_FEED'

// ACTIONS
export function addPersonToFeed (people) {
	return {
		type: ADD_PEOPLE_TO_FEED,
		people,
	}
}

// REDUCERS
const initialState = {}

export default function people (state = initialState, action) {
	switch (action.type) {
	case ADD_PEOPLE_TO_FEED:
		return {
			...state,
			...action.people,
		}
	default:
		return state
	}
}
