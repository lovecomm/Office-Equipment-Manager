import { saveHardware } from 'helpers/api'

const ADD_HARDWARE = 'ADD_HARDWARE'
const OPEN_HARDWARE_FORM = 'OPEN_HARDWARE_FORM'
const CLOSE_HARDWARE_FORM = 'CLOSE_HARDWARE_FORM'
const UPDATE_MAKE = 'UPDATE_MAKE'
const UPDATE_MODEL = 'UPDATE_MODEL'
const UPDATE_DESCRIPTION = 'UPDATE_DESCRIPTION'
const UPDATE_PHOTO = 'UPDATE_PHOTO'
const UPDATE_PHOTO_NAME = 'UPDATE_PHOTO_NAME'
const UPDATE_IS_COMPUTER = 'UPDATE_IS_COMPUTER'
const UPDATE_ERROR = 'UPDATE_ERROR'
const UPDATE_EDITING = 'UPDATE_EDITING'
const UPDATE_HARDWARE_ID = 'UPDATE_HARDWARE_ID'

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

function updateHardwareId (hardwareId) {
	return {
		type: UPDATE_HARDWARE_ID,
		hardwareId,
	}
}

export function updateMake (make) {
	return {
		type: UPDATE_MAKE,
		make,
	}
}

export function updateModel (model) {
	return {
		type: UPDATE_MODEL,
		model,
	}
}

export function updateDescription (description) {
	return {
		type: UPDATE_DESCRIPTION,
		description,
	}
}

export function updatePhoto (photo) {
	return {
		type: UPDATE_PHOTO,
		photo,
	}
}

export function updateIsComputer (isComputer) {
	return {
		type: UPDATE_IS_COMPUTER,
		isComputer,
	}
}

function updateError (error) {
	return {
		type: UPDATE_ERROR,
		error,
	}
}

function addHardware (hardware) {
	return {
		type: ADD_HARDWARE,
		hardware,
	}
}

function updateEditing () {
	return {
		type: UPDATE_EDITING,
	}
}

function updatePhotoName (photoName) {
	return {
		type: UPDATE_PHOTO_NAME,
		photoName,
	}
}

function activateCurrentHardware (dispatch, getState, hardwareId) {
	return new Promise((resolve, reject) => {
		const hardware = getState().hardwares[hardwareId]
		dispatch(updateEditing())
		dispatch(updateHardwareId(hardware.hardwareId))
		dispatch(updateIsComputer(hardware.isComputer))
		dispatch(updateMake(hardware.make))
		dispatch(updateModel(hardware.model))
		dispatch(updateDescription(hardware.description))
		hardware.photo !== undefined ? dispatch(updatePhotoName(hardware.photo.name)) : dispatch(updatePhotoName(''))
		resolve(true)
	})
}

export function initiateHardwareForm (hardwareId) {
	return function (dispatch, getState) {
		activateCurrentHardware(dispatch, getState, hardwareId)
		.then(() => {
			dispatch(openHardwareForm())
		})
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
		.catch((error) => {
			dispatch(updateError(error.toString()))
		})
	}
}

// REDUCERS
const initialState = {
	hardwareId: '',
	make: '',
	model: '',
	description: '',
	photo: {},
	photoName: '',
	isComputer: false,
	isOpen: false,
	error: '',
	editing: false,
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
			hardwareId: '',
			make: '',
			model: '',
			description: '',
			photo: {},
			photoName: '',
			isComputer: false,
			isOpen: false,
			error: '',
			editing: false,
		}
	case UPDATE_HARDWARE_ID:
		return {
			...state,
			hardwareId: action.hardwareId,
		}
	case UPDATE_MAKE:
		return {
			...state,
			make: action.make,
		}
	case UPDATE_MODEL:
		return {
			...state,
			model: action.model,
		}
	case UPDATE_DESCRIPTION:
		return {
			...state,
			description: action.description,
		}
	case UPDATE_PHOTO:
		return {
			...state,
			photo: action.photo,
			photoName: action.photo.name,
		}
	case UPDATE_PHOTO_NAME:
		return {
			...state,
			photoName: action.photoName,
		}
	case UPDATE_IS_COMPUTER:
		return {
			...state,
			isComputer: action.isComputer,
		}
	case UPDATE_ERROR:
		return {
			...state,
			error: action.error,
		}
	case UPDATE_EDITING:
		return {
			...state,
			editing: true,
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
