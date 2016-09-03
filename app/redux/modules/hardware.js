const ADD_HARDWARE_TO_FEED = 'ADD_HARDWARE_TO_FEED'

// ACTIONS
export function addHardwareToFeed (hardware) {
	return {
		type: ADD_HARDWARE_TO_FEED,
		hardware,
	}
}

// REDUCERS
const initialState = {}

export default function hardware (state = initialState, action) {
	switch (action.type) {
	case ADD_HARDWARE_TO_FEED:
		return {
			...state,
			...action.hardware,
		}
	default:
		return state
	}
}
