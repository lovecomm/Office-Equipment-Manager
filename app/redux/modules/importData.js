import handleFileImport from 'helpers/fileImport'

const TOGGLE_IMPORTDATA_FORM_IS_SHOWING = 'TOGGLE_IMPORTDATA_FORM_IS_SHOWING'
const UPDATE_IMPORTDATA_FORM_SELECTED_FILE_NAME = 'UPDATE_IMPORTDATA_FORM_SELECTED_FILE_NAME'
const UPDATE_IMPORTDATA_ERROR = 'UPDATE_IMPORTDATA_ERROR'
const CLEAR_IMPORTDATA_FORM = 'CLEAR_IMPORTDATA_FORM'
const CLOSE_IMPORTDATA_FORM = 'CLOSE_IMPORTDATA_FORM'
const UPDATE_IMPORTDATA_FORM_SUBMIT_SUCCESSFUL = 'UPDATE_IMPORTDATA_FORM_SUBMIT_SUCCESSFUL'
const UPDATE_IMPORTDATA_IS_PROCESSING = 'UPDATE_IMPORTDATA_IS_PROCESSING'
const UPDATE_DUPLICATE_ITEMS_IDS = 'UPDATE_DUPLICATE_ITEMS_IDS'

export function toggleImportdataFormIsShowing () {
	return {
		type: TOGGLE_IMPORTDATA_FORM_IS_SHOWING,
	}
}

export function updateImportdataFormSelectedFileName (selectedFileName) {
	return {
		type: UPDATE_IMPORTDATA_FORM_SELECTED_FILE_NAME,
		selectedFileName,
	}
}

export function updateImportdataFormError (error) {
	return {
		type: UPDATE_IMPORTDATA_ERROR,
		error,
	}
}

function closeImportdataform () {
	return {
		type: CLOSE_IMPORTDATA_FORM,
	}
}

function clearImportdataForm () {
	return {
		type: CLEAR_IMPORTDATA_FORM,
	}
}

export function updateImportdataFormSubmitSuccessful () {
	return {
		type: UPDATE_IMPORTDATA_FORM_SUBMIT_SUCCESSFUL
	}
}

export function updateImportdataIsProcessing (isProcessing) {
	return {
		type: UPDATE_IMPORTDATA_IS_PROCESSING,
		isProcessing,
	}
}

export function updateDuplicateItemsIds (duplicateItemsIds) {
	return {
		type: UPDATE_DUPLICATE_ITEMS_IDS,
		duplicateItemsIds,
	}
}

export function handleClearImportdataForm () {
	return function (dispatch, getState) {
		dispatch(closeImportdataform())
		setTimeout(() => dispatch(clearImportdataForm()), 500)
	}
}

export function handleFileImportThunk (file) {
	return function (dispatch, getState) {
		return handleFileImport(file, getState().users.authedId)
		.then((duplicateItemsIds) => dispatch(updateDuplicateItemsIds(duplicateItemsIds)))
	}
}

const initialState = {
	formIsShowing: false,
	selectedFileName: '',
	error: '',
	isProcessing: false,
	submitSuccessful: false,
	duplicateItemsIds: '',
}

export default function importData (state = initialState, action) {
	switch (action.type) {
	case CLEAR_IMPORTDATA_FORM:
		return initialState
	case CLOSE_IMPORTDATA_FORM:
		return {
			...state,
			formIsShowing: false,
			submitSuccessful: false,
		}
	case TOGGLE_IMPORTDATA_FORM_IS_SHOWING:
		return {
			...state,
			formIsShowing: !state.formIsShowing,
		}
	case UPDATE_IMPORTDATA_FORM_SELECTED_FILE_NAME:
		return {
			...state,
			selectedFileName: action.selectedFileName,
		}
	case UPDATE_IMPORTDATA_ERROR:
		return {
			...state,
			error: action.error,
		}
	case UPDATE_IMPORTDATA_FORM_SUBMIT_SUCCESSFUL:
		return {
			...state,
			submitSuccessful: true,
		}
	case UPDATE_IMPORTDATA_IS_PROCESSING:
		return {
			...state,
			isProcessing: action.isProcessing,
		}
	case UPDATE_DUPLICATE_ITEMS_IDS:
		return {
			...state,
			duplicateItemsIds: action.duplicateItemsIds,
		}
	default:
		return state
	}
}
