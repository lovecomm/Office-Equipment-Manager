import { addListener } from 'redux/modules/listeners'
import { listenToFeed, listenToPeople } from 'helpers/api'
import { addItemsToFeed } from 'redux/modules/items'
import { addPeopleToTree } from 'redux/modules/people'

const SETTING_FEED_LISTENER = 'SETTING_FEED_LISTENER'
const SETTING_FEED_LISTENER_ERROR = 'SETTING_FEED_LISTENER_ERROR'
const SETTING_FEED_LISTENER_SUCCESS = 'SETTING_FEED_LISTENER_SUCCESS'
const SETTING_PEOPLE_LISTENER_SUCCESS = 'SETTING_PEOPLE_LISTENER_SUCCESS'
const SETTING_PEOPLE_LISTENER_ERROR = 'SETTING_PEOPLE_LISTENER_ERROR'
// const ADD_NEW_ITEM_TO_FEED = 'ADD_NEW_ITEM_TO_FEED'

// ACTIONS
function settingFeedListener () {
	return {
		type: SETTING_FEED_LISTENER,
	}
}

function settingFeedListenerError (error) {
	console.warn(error)
	return {
		type: SETTING_FEED_LISTENER_ERROR,
		error: 'Error fetching feeds.',
	}
}

function settingPeopleListenerError (error) {
	console.warn(error)
	return {
		type: SETTING_PEOPLE_LISTENER_ERROR,
		error: 'Error fetching people.',
	}
}

function settingFeedListenerSuccess (itemIds) {
	return {
		type: SETTING_FEED_LISTENER_SUCCESS,
		itemIds,
	}
}

function settingPeopleListenerSuccess (peopleIds) {
	return {
		type: SETTING_PEOPLE_LISTENER_SUCCESS,
		peopleIds,
	}
}

// function addNewItemToFeed (item) {
// 	return {
// 		type: ADD_NEW_ITEM_TO_FEED,
// 		item,
// 	}
// }

export function setAndHandleFeedListener () {
	let initialFetch = true
	return function (dispatch, getState) {
		if (getState().listeners.feed === true) {
			return
		}

		dispatch(settingFeedListener())
		dispatch(addListener('feed'))
		listenToFeed(({feed, sortedIds}) => {
			dispatch(addItemsToFeed(feed))
			initialFetch === true
				? dispatch(settingPeopleListenerSuccess(sortedIds))
				: '' // dispatch(addNewItemToFeed(sortedIds[0]))
			initialFetch = false
		}, (error) => dispatch(settingPeopleListenerError(error)))
	}
}

export function setAndHandlePeopleListener () {
	let initialFetch = true
	return function (dispatch, getState) {
		if (getState().listeners.people === true) {
			return
		}

		dispatch(settingFeedListener())
		dispatch(addListener('people'))
		listenToPeople(({people, sortedIds}) => {
			console.log(people)
			dispatch(addPeopleToTree(people))
			initialFetch === true
				? dispatch(settingFeedListenerSuccess(sortedIds))
				: '' // dispatch(addNewItemToFeed(sortedIds[0]))
			initialFetch = false
		}, (error) => dispatch(settingFeedListenerError(error)))
	}
}

// REDUCERS
const initialState = {
	isFetching: false,
	error: '',
	itemIds: [],
}

export default function feed (state = initialState, action) {
	switch (action.type) {
	case SETTING_FEED_LISTENER :
		return {
			...state,
			isFetching: true,
		}
	case SETTING_FEED_LISTENER_ERROR:
		return {
			...state,
			isFetching: false,
			error: action.error,
		}
	case SETTING_PEOPLE_LISTENER_ERROR:
		return {
			...state,
			isFetching: false,
			error: action.error,
		}
	case SETTING_FEED_LISTENER_SUCCESS:
		return {
			...state,
			isFetching: false,
			error: '',
			itemIds: action.itemIds,
		}
	// case ADD_NEW_ITEM_TO_FEED:
	// 	return {
	// 		...state,
	// 		newItemToAdd: [action.itemId, ...state.newItemToAdd],
	// 	}
	case SETTING_PEOPLE_LISTENER_SUCCESS:
		return {
			...state,
			isFetching: false,
			error: '',
			peopleIds: action.peopleIds
		}
	default:
		return state
	}
}
