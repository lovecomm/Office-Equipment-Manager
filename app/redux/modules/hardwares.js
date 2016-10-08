import { getUrl } from 'helpers/api'

const ADD_HARDWARE_TO_FEED = 'ADD_HARDWARE_TO_FEED'
const UPDATE_HARDWARE_PHOTO_URL = 'UPDATE_HARDWARE_PHOTO_URL'

// ACTIONS
export function prepHardwaresForFeed (hardwares) {
	return function (dispatch, getState) {
		return new Promise((resolve, reject) => {
			dispatch(getHardwareUrlFromFirebase(hardwares))
			.then(() => dispatch(addHardwareToFeed(hardwares)))
			resolve()
		})
	}
}

function addHardwareToFeed (hardware) {
	return {
		type: ADD_HARDWARE_TO_FEED,
		hardware,
	}
}

function getHardwareUrlFromFirebase (hardwares) {
	return function (dispatch, getState) {
		return new Promise((resolve, reject) => {
			Object.keys(hardwares).forEach((hardwareId) => {
				getUrl('hardwares', hardwares[hardwareId].photo.name)
				.then((downloadUrl) => {
					dispatch(updateHardwarePhotoUrl(hardwareId, downloadUrl))
				})
			})
			resolve()
		})
	}
}

function updateHardwarePhotoUrl (hardwareId, photoUrl) {
	return {
		type: UPDATE_HARDWARE_PHOTO_URL,
		hardwareId,
		photoUrl,
	}
}

// REDUCERS
const initialHardwarePhotoState = {
	bucket: '',
	fullPath: '',
	name: '',
	size: 0,
	type: '',
	url: '',
}

function photoHardware (state = initialHardwarePhotoState, action) {
	switch (action.type) {
	case UPDATE_HARDWARE_PHOTO_URL:
		return {
			...state,
			url: action.photoUrl,
		}
	default:
		return state
	}
}

const initialHardwareState = {}

function hardware (state = initialHardwareState, action) {
	switch (action.type) {
	case UPDATE_HARDWARE_PHOTO_URL:
		return {
			...state,
			photo: photoHardware(state.photo, action),
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
	case UPDATE_HARDWARE_PHOTO_URL:
		return {
			...state,
			[action.hardwareId]: hardware(state[action.hardwareId], action),
		}
	default:
		return state
	}
}
