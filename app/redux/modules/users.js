import auth from 'helpers/auth'

const AUTH_USER = 'AUTH_USER'
const LOGOUT_USER = 'LOGOUT_USER'
const UNAUTH_USER = 'UNAUTH_USER'
const FETCHING_USER = 'FETCHING_USER'
const FETCHING_USER_ERROR = 'FETCHING_USER_ERROR'
const FETCHING_USER_SUCCESS = 'FETCHING_USER_SUCCESS'
const ADD_USER = 'ADD_USER'
const REMOVE_USER = 'REMOVE_USER'

// ACTIONS
function authUser (uid) {
	return {
		type: AUTH_USER,
		uid,
	}
}

function logoutUser (isLoggingOut) {
	return {
		type: LOGOUT_USER,
		isLoggingOut,
	}
}

function unauthUser (isLoggingOut) {
	return {
		type: UNAUTH_USER,
		isLoggingOut,
	}
}

function fetchingUser () {
	return {
		type: FETCHING_USER,
	}
}

function fetchingUserError (error) {
	return {
		type: FETCHING_USER_ERROR,
		error: error,
	}
}

function fetchingUserSuccess (uid, user, timestamp) {
	return {
		type: FETCHING_USER_SUCCESS,
		uid,
		user,
		timestamp,
	}
}

function addUser (uid, user, timestamp) {
	return {
		type: ADD_USER,
		uid,
		user,
		timestamp,
	}
}

function removeUser (uid, timestamp) {
	return {
		type: REMOVE_USER,
		uid,
		timestamp,
	}
}

export function fetchAndHandleAuthedUser (email, password) {
	return function (dispatch) {
		dispatch(fetchingUser())
		return auth(email, password).then((data) => {
			// REVIEW... Why doesn't this promise recognize when auth is returning an error... and then pass that into the .catch?? B/C it doesn't i'm returning on object with an error essage from auth.
			if (data.error !== undefined) {
				dispatch(fetchingUserError(data.error))
			} else {
				const user = data
				dispatch(fetchingUserSuccess(user.uid, user, Date.now()))
				dispatch(authUser(user.uid))
			}
		}).catch((error) => dispatch(fetchingUserError(error)))
	}
}

export function logoutAndUnauth () {
	return function (dispatch) {
		dispatch(logoutUser(true))
		setTimeout(function () {
			dispatch(unauthUser(false))
		}, 4000)
	}
}

// REDUCERS
const initialUserState = {
	lastUpdated: Date.now(),
	info: {
		uid: '',
		name: '',
		email: '',
		password: '',
	},
}

function user (state = initialUserState, action) {
	switch (action.type) {
	case FETCHING_USER_SUCCESS:
	case ADD_USER:
		return {
			...state,
			info: action.user,
			lastUpdated: action.timestamp,
		}
	case REMOVE_USER:
		return {
			...state,
			info: initialUserState.info,
			lastUpdated: action.timestamp,
		}
	default:
		return state
	}
}

const initialState = {
	isFetching: false,
	isAuthed: false,
	isLoggingOut: false,
	error: '',
	authedId: '',
}

export default function users (state = initialState, action) {
	switch (action.type) {
	case AUTH_USER:
		return {
			...state,
			isAuthed: true,
			authedId: action.uid,
		}
	case LOGOUT_USER:
		return {
			...state,
			isLoggingOut: true,
			isAuthed: false,
			authedId: '',
		}
	case UNAUTH_USER:
		return {
			...state,
			isLoggingOut: false,
		}
	case FETCHING_USER:
		return {
			...state,
			isFetching: true,
		}
	case FETCHING_USER_ERROR:
		return {
			...state,
			isFetching: false,
			error: action.error,
		}
	case FETCHING_USER_SUCCESS:
	case REMOVE_USER:
	case ADD_USER:
		return action.user === null
		? {
			...state,
			isFetching: false,
			error: '',
		}
		: {
			...state,
			isFetching: false,
			error: '',
			[action.uid]: user(state[action.uid], action),
		}
	default:
		return state
	}
}
