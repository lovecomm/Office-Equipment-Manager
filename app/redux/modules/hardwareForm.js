import { saveNewHardware, saveUpdatedHardware } from 'helpers/api'
// import { determineItemHasSubContent } from 'helpers/utils'
// import { updateItemHasSubContent } from 'redux/modules/items'

const HARDWARE_FORM_ADD_HARDWARE = 'HARDWARE_FORM_ADD_HARDWARE'
const OPEN_HARDWARE_FORM = 'OPEN_HARDWARE_FORM'
const CLOSE_HARDWARE_FORM = 'CLOSE_HARDWARE_FORM'
const UPDATE_HARDWARE_FORM_MAKE = 'UPDATE_HARDWARE_FORM_MAKE'
const UPDATE_HARDWARE_FORM_MODEL = 'UPDATE_HARDWARE_FORM_MODEL'
const UPDATE_HARDWARE_FORM_DESCRIPTION = 'UPDATE_HARDWARE_FORM_DESCRIPTION'
const UPDATE_HARDWARE_FORM_PHOTO = 'UPDATE_HARDWARE_FORM_PHOTO'
const UPDATE_HARDWARE_FORM_PHOTO_NAME = 'UPDATE_HARDWARE_FORM_PHOTO_NAME'
const UPDATE_HARDWARE_FORM_IS_COMPUTER = 'UPDATE_HARDWARE_FORM_IS_COMPUTER'
const UPDATE_HARDWARE_FORM_ERROR = 'UPDATE_HARDWARE_FORM_ERROR'
const UPDATE_HARDWARE_FORM_IS_SUBMITTING = 'UPDATE_HARDWARE_FORM_IS_SUBMITTING'
const UPDATE_HARDWARE_FORM_EDITING = 'UPDATE_HARDWARE_FORM_EDITING'
const UPDATE_HARDWARE_FORM_HARDWARE_ID = 'UPDATE_HARDWARE_FORM_HARDWARE_ID'

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

export function updateHardwareFormIsSubmitting (isSubmitting) {
	return {
		type: UPDATE_HARDWARE_FORM_IS_SUBMITTING,
		isSubmitting,
	}
}

function updateHardwareFormHardwareId (hardwareId) {
	return {
		type: UPDATE_HARDWARE_FORM_HARDWARE_ID,
		hardwareId,
	}
}

export function updateHardwareFormMake (make) {
	return {
		type: UPDATE_HARDWARE_FORM_MAKE,
		make,
	}
}

export function updateHardwareFormModel (model) {
	return {
		type: UPDATE_HARDWARE_FORM_MODEL,
		model,
	}
}

export function updateHardwareFormDescription (description) {
	return {
		type: UPDATE_HARDWARE_FORM_DESCRIPTION,
		description,
	}
}

export function updateHardwareFormPhoto (photo) {
	return {
		type: UPDATE_HARDWARE_FORM_PHOTO,
		photo,
	}
}

export function updateHardwareFormIsComputer (isComputer) {
	return {
		type: UPDATE_HARDWARE_FORM_IS_COMPUTER,
		isComputer,
	}
}

function updateHardwareFormError (error) {
	return {
		type: UPDATE_HARDWARE_FORM_ERROR,
		error,
	}
}

function hardwareFormAddHardware (hardware) {
	return {
		type: HARDWARE_FORM_ADD_HARDWARE,
		hardware,
	}
}

function hardwareFormupdateHardwareFormEditing () {
	return {
		type: UPDATE_HARDWARE_FORM_EDITING,
	}
}

function updateHardwareFormPhotoName (photoName) {
	return {
		type: UPDATE_HARDWARE_FORM_PHOTO_NAME,
		photoName,
	}
}

function activateCurrentHardware (dispatch, getState, hardwareId) {
	return new Promise((resolve, reject) => {
		const hardware = getState().hardwares[hardwareId]
		dispatch(hardwareFormupdateHardwareFormEditing())
		dispatch(updateHardwareFormHardwareId(hardware.hardwareId))
		dispatch(updateHardwareFormIsComputer(hardware.isComputer))
		dispatch(updateHardwareFormMake(hardware.make))
		dispatch(updateHardwareFormModel(hardware.model))
		dispatch(updateHardwareFormDescription(hardware.description))
		hardware.photo !== undefined ? dispatch(updateHardwareFormPhotoName(hardware.photo.name)) : dispatch(updateHardwareFormPhotoName(''))
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

export function newHardwareFanout (hardware) {
	return function (dispatch, getState) {
		saveNewHardware(getState().hardwares, hardware, getState().users.authedId)
		.then((hardwareWithId) => {
			dispatch(hardwareFormAddHardware(hardwareWithId))
			dispatch(closeHardwareForm())
		})
		.catch((err) => {
			dispatch(updateHardwareFormIsSubmitting(false))
			dispatch(updateHardwareFormError(err.toString()))
		})
	}
}

export function updateHardwareFanout (hardware) {
	return function (dispatch, getState) {
		saveUpdatedHardware(getState().hardwares, hardware, getState().users.authedId, getState().items)
		.then(() => dispatch(closeHardwareForm()))
		.catch((error) => {
			dispatch(updateHardwareFormIsSubmitting(false))
			dispatch(updateHardwareFormError(error.toString()))
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
	isSubmitting: false,
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
		return initialState
	case UPDATE_HARDWARE_FORM_HARDWARE_ID:
		return {
			...state,
			hardwareId: action.hardwareId,
		}
	case UPDATE_HARDWARE_FORM_MAKE:
		return {
			...state,
			make: action.make,
		}
	case UPDATE_HARDWARE_FORM_MODEL:
		return {
			...state,
			model: action.model,
		}
	case UPDATE_HARDWARE_FORM_DESCRIPTION:
		return {
			...state,
			description: action.description,
		}
	case UPDATE_HARDWARE_FORM_PHOTO:
		return {
			...state,
			photo: action.photo,
			photoName: action.photo.name,
		}
	case UPDATE_HARDWARE_FORM_PHOTO_NAME:
		return {
			...state,
			photoName: action.photoName,
		}
	case UPDATE_HARDWARE_FORM_IS_COMPUTER:
		return {
			...state,
			isComputer: action.isComputer,
		}
	case UPDATE_HARDWARE_FORM_ERROR:
		return {
			...state,
			error: action.error,
		}
	case UPDATE_HARDWARE_FORM_IS_SUBMITTING:
		return {
			...state,
			isSubmitting: action.isSubmitting,
		}
	case UPDATE_HARDWARE_FORM_EDITING:
		return {
			...state,
			editing: true,
		}
	case HARDWARE_FORM_ADD_HARDWARE:
		return {
			...state,
			[action.hardware.hardwareId]: action.hardware,
		}
	default :
		return state
	}
}
