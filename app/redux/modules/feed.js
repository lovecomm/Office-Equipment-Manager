import { addListener } from 'redux/modules/listeners'
import { listenToFeed } from 'helpers/api'
import { prepItemsForFeed } from 'redux/modules/itemsFeed'
import { prepPeopleForFeed } from 'redux/modules/peopleFeed'
import { prepHardwaresForFeed } from 'redux/modules/hardwaresFeed'

const SETTING_FEED_LISTENER = 'SETTING_FEED_LISTENER'
const SETTING_FEED_LISTENER_ERROR = 'SETTING_FEED_LISTENER_ERROR'
const SETTING_FEED_LISTENER_SUCCESS_ITEMS = 'SETTING_FEED_LISTENER_SUCCESS_ITEMS'
const SETTING_FEED_LISTENER_SUCCESS_PEOPLE = 'SETTING_FEED_LISTENER_SUCCESS_PEOPLE'
const SETTING_FEED_LISTENER_SUCCESS_HARDWARE = 'SETTING_FEED_LISTENER_SUCCESS_HARDWARE'
const SETTING_FEED_LISTENER_ALLSUCCESS = 'SETTING_FEED_LISTENER_ALLSUCCESS'

// ACTIONS

function settingFeedListener () {
	return {
		type: SETTING_FEED_LISTENER,
	}
}

function settingFeedListenerError (error) {
	return {
		type: SETTING_FEED_LISTENER_ERROR,
		error: error,
	}
}

function settingFeedListenerAllsuccess () {
	return {
		type: SETTING_FEED_LISTENER_ALLSUCCESS,
	}
}

export function setAndHandleFeedListener () {
	return function (dispatch, getState) {
		if (getState().listeners.feed === true) return
		dispatch(settingFeedListener())
		dispatch(addListener('feed'))
		listenToFeed(({
			items,
			sortedItemIds,
			people,
			hardwares,
		}) => {
			dispatch(prepHardwaresForFeed(hardwares))
			.then(() => dispatch(prepPeopleForFeed(people)))
			.then(() => dispatch(prepItemsForFeed(items)))
			.then(() => dispatch(settingFeedListenerAllsuccess()))
		}, (error) => dispatch(settingFeedListenerError(error)))
	}
}

// REDUCERS
const initialState = {
	isFetching: false,
	error: '',
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
	case SETTING_FEED_LISTENER_SUCCESS_ITEMS:
		return {
			...state,
			isFetching: false,
			error: '',
			itemIds: action.itemIds,
		}
	case SETTING_FEED_LISTENER_SUCCESS_PEOPLE:
		return {
			...state,
			personIds: action.personIds,
		}
	case SETTING_FEED_LISTENER_SUCCESS_HARDWARE:
		return {
			...state,
			hardwareIds: action.hardwareIds,
		}
	case SETTING_FEED_LISTENER_ALLSUCCESS:
		return {
			...state,
			isFetching: false,
		}
	default:
		return state
	}
}
