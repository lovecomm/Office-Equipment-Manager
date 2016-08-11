// Users
const initialUserState = {
	lastUpdated: Date.now(),
	info: {
		uid: '',
		name: '',
		email: '',
		password: '',
	}
}

function user (state = initialUserState, action) {
	switch (action.type) {
		case FETCHING_USER_SUCCESS:
		case ADD_USER:
			return {
				...state,
				info: action.user,
				lastUpdated: action.timestamp,
			}
		case REMOVE_USER:
			return {
				...state,
				info: initialUserState.info,
				lastUpdated: action.timestamp,
			}
		default:
			return state
	}
}

const initialState = {
	isFeatching: false,
	isAuthed: false,
	error: '',
	authedId: '',
}

export default function users (state = initialState, action) {
	switch (action.type) {
		case AUTH_USER:
			return {
				...state,
				isAuthed: true,
				authedId: action.uid,
			}
		case UNAUTH_USER:
			return {
				...state,
				isAuthed: false,
				authedId: '',
			}
		case FETCHING_USER:
			return {
				...state,
				isFeatching: true,
			}
		case FETCHING_USER_ERROR:
			return {
				...state,
				isFetching: false,
				error: action.error,
			}
		case FETCHING_USER_SUCCESS:
		case REMOVE_USER:
		case ADD_USER:
			return action.user === null
			? {
				...state,
				isFetching: false,
				error: '',
			}
			: {
				...state,
				isFetching: false,
				error: '',
				[action.uid]: user(state[action.uid], action)
			}
		default:
			return state
	}
}

// Items
const initialItemState = {
	lastUpdated: Date.now(),
	info: {
		uid: '',
		status: '',
		purchasedAt: 0,
		assignedAt: 0,
		itemNoteIds: [],
		itemPhotoIds: [],
		personId: '',
		hardwareId: '',
	}
}

function item (state = initialItemState, action) {
	switch (action.type) {
		case REMOVE_ITEM:
			return {
				...state,
				lastUpdated: action.timestamp,
				info: initialItemState.info,
			}
		case REASSIGN_ITEM:
			return {
				...state,
				info: {
					personId: action.personId,
				},
			}
		default:
			return state
	}
}

const initialState = {
	isFetching: '',
	error: '',
}

export default function items (state = initialState, action) {
	switch (action.type) {
		case FETCHING_ITEM:
			return {
				...state,
				isFetching: true,
			}
		case FETCHING_ITEM_ERROR:
			return {
				...state,
				isFeatching: false,
				error: action.error
			}
		case FETCHING_ITEM_SUCCESS:
		case ADD_ITEM:
			return {
				...state,
				error: '',
				isFetching: false,
				[action.uid]: action.item,
			}
		case REMOVE_FETCHING_ITEM:
			return {
				...state,
				error: '',
				isFetching: false,
			}
		case ADD_MULTIPLE_ITEMS:
			return {
				...state,
				...action.items,
			}
		case REMOVE_ITEM:
		case REASSIGN_ITEM:
			return {
				...state,
				[action.itemId]: item(state[action.itemId], action)
			}
		default:
			return state
	}
}

// // ItemPhotos
// const initialItemPhotosState = {
// 	lastUpdated: Date.now(),
// 	info: {
// 		filename: '',
// 		mime: '',
// 		path: '',
// 	},
// }
//
// const initialState = {
// 	isFetching: false,
// 	error: '',
// }
//
// export default function itemPhotos (state = initialState, action) {
// 	switch (action.type) {
// 		case ADD_ITEM_PHOTO:
// 		case DELETE_ITEM_PHOTO:
// 			return {
// 				...state,
// 				[action.itemPhotoId]
// 			}
// 		default:
// 			return state
// 	}
// }
