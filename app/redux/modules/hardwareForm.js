import { saveHardware } from 'helpers/api'

const ADD_HARDWARE = 'ADD_HARDWARE'
const OPEN_HARDWARE_FORM = 'OPEN_HARDWARE_FORM'
const CLOSE_HARDWARE_FORM = 'CLOSE_HARDWARE_FORM'
const UPDATE_HARDWARE_MAKE_TEXT = 'UPDATE_HARDWARE_MAKE_TEXT'
const UPDATE_HARDWARE_MODEL_TEXT = 'UPDATE_HARDWARE_MODEL_TEXT'
const UPDATE_HARDWARE_DESCRIPTION_TEXT = 'UPDATE_HARDWARE_DESCRIPTION_TEXT'
const UPDATE_HARDWARE_PHOTO = 'UPDATE_HARDWARE_PHOTO'
const UPDATE_IS_COMPUTER = 'UPDATE_IS_COMPUTER'
const UPDATE_HARDWARE_FORM_ERROR = 'UPDATE_HARDWARE_FORM_ERROR'

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
		type: UPDATE_HARDWARE_MAKE_TEXT,
		makeText,
	}
}

export function updateModelText (modelText) {
	return {
		type: UPDATE_HARDWARE_MODEL_TEXT,
		modelText,
	}
}

export function updateDescriptionText (descriptionText) {
	return {
		type: UPDATE_HARDWARE_DESCRIPTION_TEXT,
		descriptionText,
	}
}

export function updatePhoto (photo) {
	return {
		type: UPDATE_HARDWARE_PHOTO,
		photo,
	}
}

export function updateIsComputer (isComputer) {
	return {
		type: UPDATE_IS_COMPUTER,
		isComputer,
	}
}

function updateHardwareFormError (error) {
	return {
		type: UPDATE_HARDWARE_FORM_ERROR,
		error,
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
		const uid = getState().users.authedId
		saveHardware(hardware, { uid: uid })
		.then((hardwareWithId) => {
			dispatch(addHardware(hardwareWithId))
			dispatch(closeHardwareForm())
		})
		.catch((err) => {
			dispatch(updateHardwareFormError(err))
		})
	}
}

// REDUCERS
const initialState = {
	makeText: '',
	modelText: '',
	descriptionText: '',
	photo: {},
	photoNameText: '',
	isComputer: false,
	isOpen: false,
	error: '',
}

export default function hardwareForm (state = initialState, action) {
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
			photo: {},
			photoNameText: '',
			isComputer: false,
			isOpen: false,
			error: '',
		}
	case UPDATE_HARDWARE_MAKE_TEXT:
		return {
			...state,
			makeText: action.makeText,
		}
	case UPDATE_HARDWARE_MODEL_TEXT:
		return {
			...state,
			modelText: action.modelText,
		}
	case UPDATE_HARDWARE_DESCRIPTION_TEXT:
		return {
			...state,
			descriptionText: action.descriptionText,
		}
	case UPDATE_HARDWARE_PHOTO:
		return {
			...state,
			photo: action.photo,
			photoNameText: action.photo.name,
		}
	case UPDATE_IS_COMPUTER:
		return {
			...state,
			isComputer: action.isComputer,
		}
	case UPDATE_HARDWARE_FORM_ERROR:
		return {
			...state,
			error: action.error,
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
