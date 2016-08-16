const OPEN_MODAL_HARDWARE = 'OPEN_MODAL_HARDWARE'
const CLOSE_MODAL_HARDWARE = 'CLOSE_MODAL_HARDWARE'
const UPDATE_MAKE_TEXT = 'UPDATE_MAKE_TEXT'
const UPDATE_MODEL_TEXT = 'UPDATE_MODEL_TEXT'
const UPDATE_DESCRIPTION_TEXT = 'UPDATE_DESCRIPTION_TEXT'
const UPDATE_PHOTO_INFO = 'UPDATE_PHOTO_INFO'

// ACTIONS
export function openModalHardware () {
	return {
		type: OPEN_MODAL_HARDWARE,
	}
}

export function closeModalHardware () {
	return {
		type: CLOSE_MODAL_HARDWARE,
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
	case OPEN_MODAL_HARDWARE:
		return {
			...state,
			isOpen: true,
		}
	case CLOSE_MODAL_HARDWARE:
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
