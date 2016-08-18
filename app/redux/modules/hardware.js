import { saveHardware } from 'helpers/api'

const ADD_HARDWARE = 'ADD_HARDWARE'
const OPEN_HARDWARE_FORM = 'OPEN_HARDWARE_FORM'
const CLOSE_HARDWARE_FORM = 'CLOSE_HARDWARE_FORM'
const UPDATE_MAKE_TEXT = 'UPDATE_MAKE_TEXT'
const UPDATE_MODEL_TEXT = 'UPDATE_MODEL_TEXT'
const UPDATE_DESCRIPTION_TEXT = 'UPDATE_DESCRIPTION_TEXT'
const UPDATE_PHOTO_INFO = 'UPDATE_PHOTO_INFO'

// ACTIONS
export function openHardwareForm () {
	return {
		type: OPEN_HARDWARE_FORM,
	}
}

export function closeHardwareForm () {
	return {
		type: CLOSE_HARDWARE_FORM,
	}
}

export function updateMakeText (makeText) {
	return {
		type: UPDATE_MAKE_TEXT,
		makeText,
	}
}

export function updateModelText (modelText) {
	return {
		type: UPDATE_MODEL_TEXT,
		modelText,
	}
}

export function updateDescriptionText (descriptionText) {
	return {
		type: UPDATE_DESCRIPTION_TEXT,
		descriptionText,
	}
}

export function updatePhotoInfo (photoInfo) {
	return {
		type: UPDATE_PHOTO_INFO,
		photoInfo,
	}
}

function addHardware (hardware) {
	return {
		type: ADD_HARDWARE,
		hardware,
	}
}

export function hardwareFanout (hardware) {
	return function (dispatch, getState) {
		// const uid = getState().users.authedId
		saveHardware(hardware)
		.then((hardwareWithId) => {
			dispatch(addHardware(hardwareWithId))
			dispatch(closeHardwareForm())
		})
		.catch((err) => {
			console.warn('Error in hardwareFanout', err)
		})
	}
}

// REDUCERS
const initialState = {
	makeText: '',
	modelText: '',
	descriptionText: '',
	photoInfo: '',
	isOpen: false,
}

export default function hardware (state = initialState, action) {
	switch (action.type) {
	case OPEN_HARDWARE_FORM:
		return {
			...state,
			isOpen: true,
		}
	case CLOSE_HARDWARE_FORM:
		return {
			makeText: '',
			modelText: '',
			descriptionText: '',
			photoInfo: '',
			isOpen: false,
		}
	case UPDATE_MAKE_TEXT:
		return {
			...state,
			makeText: action.makeText,
		}
	case UPDATE_MODEL_TEXT:
		return {
			...state,
			modelText: action.modelText,
		}
	case UPDATE_DESCRIPTION_TEXT:
		return {
			...state,
			descriptionText: action.descriptionText,
		}
	case UPDATE_PHOTO_INFO:
		return {
			...state,
			photoInfo: action.photoInfo,
		}
	case ADD_HARDWARE:
		return {
			...state,
			[action.hardware.hardwareId]: action.hardware,
		}
	default :
		return state
	}
}
