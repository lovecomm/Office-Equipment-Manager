import { deleteDataDB } from 'helpers/api'

const UPDATE_CONFIRM_DELETE_ACTIVE = 'UPDATE_CONFIRM_DELETE_ACTIVE'
const UPDATE_TO_DELETE_ID = 'UPDATE_TO_DELETE_ID'
const UPDATE_TO_DELETE_TYPE = 'UPDATE_TO_DELETE_TYPE'

export function updateConfirmDeleteActive (confirmDeleteActive) {
	return {
		type: UPDATE_CONFIRM_DELETE_ACTIVE,
		confirmDeleteActive,
	}
}

function updateToDeleteId (toDeleteId) {
	return {
		type: UPDATE_TO_DELETE_ID,
		toDeleteId,
	}
}

function updateToDeleteType (toDeleteType) {
	return {
		type: UPDATE_TO_DELETE_TYPE,
		toDeleteType,
	}
}

export function initiateDeleteData (dataType, dataId) {
	return function (dispatch, getState) {
		dispatch(updateConfirmDeleteActive(true))
		dispatch(updateToDeleteId(dataId))
		dispatch(updateToDeleteType(dataType))
	}
}

export function confirmDeleteData () {
	return function (dispatch, getState) {
		const dataType = getState().deleteData.toDeleteType
		const dataId = getState().deleteData.toDeleteId
		const items = getState().itemsFeed.items
		// Delete from Firebase Storage
		deleteDataDB(dataType, dataId, items, getState().peopleFeed.people)
		// Delete from Redux state tree
		// switch (dataType) {
		// case 'people':
		// 	buildFilterOptions(dispatch, getState)
		// 	break
		// case 'hardwares':
		// 	const newHardwareItemIds = getState().feed.itemIds.filter((itemId) => {
		// 		return items[itemId].hardwareId !== dataId
		// 	})
		// 	dispatch(settingFeedListenerSuccessItems(newHardwareItemIds))
		// 	buildFilterOptions(dispatch, getState)
		// 	break
		// default: // items
		// 	const newItemIds = getState().feed.itemIds.filter((id) => {
		// 		return id !== dataId
		// 	})
		// 	dispatch(settingFeedListenerSuccessItems(newItemIds))
		// 	buildFilterOptions(dispatch, getState)
		// }
	}
}

// REDUCERS
const initialState = {
	confirmDeleteActive: false,
	toDeleteType: '',
	toDeleteId: '',
}

export default function deleteData (state = initialState, action) {
	switch (action.type) {
	case UPDATE_CONFIRM_DELETE_ACTIVE:
		return {
			...state,
			confirmDeleteActive: action.confirmDeleteActive,
		}
	case UPDATE_TO_DELETE_TYPE:
		return {
			...state,
			toDeleteType: action.toDeleteType,
		}
	case UPDATE_TO_DELETE_ID:
		return {
			...state,
			toDeleteId: action.toDeleteId,
		}
	default:
		return state
	}
}
