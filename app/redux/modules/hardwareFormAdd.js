const OPEN_HARDWARE_FORM_ADD = 'OPEN_HARDWARE_FORM_ADD'
const CLOSE_HARDWARE_FORM_ADD = 'CLOSE_HARDWARE_FORM_ADD'
const UPDATE_MAKE_TEXT = 'UPDATE_MAKE_TEXT'
const UPDATE_MODEL_TEXT = 'UPDATE_MODEL_TEXT'
const UPDATE_DESCRIPTION_TEXT = 'UPDATE_DESCRIPTION_TEXT'
const UPDATE_PHOTO_INFO = 'UPDATE_PHOTO_INFO'

// ACTIONS
export function openHardwareFormAdd () {
	return {
		type: OPEN_HARDWARE_FORM_ADD,
	}
}

export function closeHardwareFormAdd () {
	return {
		type: CLOSE_HARDWARE_FORM_ADD,
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

// REDUCERS
const initialState = {
	makeText: '',
	modelText: '',
	descriptionText: '',
	photoInfo: '',
	isOpen: false,
}

export default function modal (state = initialState, action) {
	switch (action.type) {
	case OPEN_HARDWARE_FORM_ADD:
		return {
			...state,
			isOpen: true,
		}
	case CLOSE_HARDWARE_FORM_ADD:
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
	default :
		return state
	}
}
