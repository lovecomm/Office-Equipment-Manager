import auth from 'helpers/auth'

const AUTH_USER = 'AUTH_USER'
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

function unauthUser () {
	return {
		type: UNAUTH_USER,
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
		error: 'Error fetching user.',
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

export function fetchAndHandleAuthedUser () {
	return function (dispatch) {
		dispatch(fetchingUser())
		auth().then((user) => {
			dispatch(fetchingUserSuccess(user.uid, user, Date.now()))
			dispatch(authUser(user.uid))
			console.log('Authed User', user)
		}).catch((error) => dispatch(fetchingUserError(error)))
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
	case UNAUTH_USER:
		return {
			...state,
			isAuthed: false,
			authedId: '',
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
