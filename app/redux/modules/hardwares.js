import { getUrl } from 'helpers/api'

const ADD_HARDWARE_TO_FEED = 'ADD_HARDWARE_TO_FEED'
const UPDATE_ITEM_HARDWARE_PHOTO = 'UPDATE_ITEM_HARDWARE_PHOTO'

// ACTIONS
export function addHardwareToFeed (hardware) {
	return {
		type: ADD_HARDWARE_TO_FEED,
		hardware,
	}
}

export function getUrlFromFirebase (hardwares) {
	return function (dispatch, getState) {
		Object.keys(hardwares).forEach((hardwareId) => {
			getUrl('hardwares', hardwares[hardwareId].photo.name)
			.then((downloadUrl) => {
				dispatch(updateItemHardwarePhoto(hardwareId, downloadUrl))
			})
		})
	}
}

function updateItemHardwarePhoto (hardwareId, photoUrl) {
	return {
		type: UPDATE_ITEM_HARDWARE_PHOTO,
		hardwareId,
		photoUrl,
	}
}

// REDUCERS
const initialPhotoState = {
	bucket: '',
	fullPath: '',
	name: '',
	size: 0,
	type: '',
	url: '',
}

function photo (state = initialPhotoState, action) {
	switch (action.type) {
	case UPDATE_ITEM_HARDWARE_PHOTO:
		return {
			...state,
			url: action.photoUrl
		}
	default:
		return state
	}
}

const initialHardwareState = {}

function hardware (state = initialHardwareState, action) {
	switch (action.type) {
	case UPDATE_ITEM_HARDWARE_PHOTO:
		return {
			...state,
			photo: photo(state.photo, action)
		}
	default:
		return state
	}
}

const initialState = {}

export default function hardwares (state = initialState, action) {
	switch (action.type) {
	case ADD_HARDWARE_TO_FEED:
		return {
			...state,
			...action.hardware,
		}
	case UPDATE_ITEM_HARDWARE_PHOTO:
		return {
			...state,
			[action.hardwareId]: hardware(state[action.hardwareId], action),
		}
	default:
		return state
	}
}
