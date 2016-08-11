// Users
{
	type: AUTH_USER,
	uid,
}

{
	type: UNAUTH_USER,
}

{
	type: FETCHING_USER,
}

{
	type: FETCHING_USER_ERROR,
	error: 'Error fetching user.',
}

{
	type: FETCHING_USER_SUCCESS,
	uid,
	user,
	timestamp,
}

{
	type: ADD_USER,
	uid,
	user,
	timestamp,
}

{
	type: REMOVE_USER,
	uid,
	timestamp,
}

// Items
{
	type: FETCHING_ITEM,
}

{
	type: FETCHING_ITEM_ERROR,
	error: 'Error fetching item',
}

{
	type: FETCHING_ITEM_SUCCESS,
	item,
}

{
	type: REMOVE_FETCHING_ITEM
}

{
	type: ADD_ITEM,
	uid,
	item,
}

{
	type: ADD_MULTIPLE_ITEMS,
	items,
}

{
	type: REMOVE_ITEM,
	itemId,
	timestamp,
}

{
	type: REASSIGN_ITEM,
	itemId,
	personId,
	timestamp,
}

// Item Photos
{
	type: ADD_ITEM_PHOTO,
	item,
	itemPhoto,
}

{
	type: DELETE_ITEM_PHOTO,
	item,
	itemPhoto,
}

// Item Notes
{
	type: ADD_ITEM_NOTE,
	item,
	itemNote,
}

{
	type: DELETE_ITEM_NOTE,
	item,
	itemNote,
}

// People
{
	type: FETCHING_PEOPLE,
}

{
	type: FETCHING_PEOPLE_ERROR,
	error: 'Error fetching people',
}

{
	type: FETCHING_PEOPLE_SUCCESS,
	person,
}

{
	type: ADD_PERSON,
	person,
}

{
	type: REMOVE_PERSON,
	person,
}

{
	type: UPDATE_PERSON_PHOTO,
	person,
	personPhoto
}

// Hardwares
{
	type: FETCHING_HARDWARES,
}

{
	type: FETCHING_HARDWARES_ERROR,
	error: 'Error fetching hardware',
}

{
	type: FETCHING_HARDWARES_SUCCESS,
	hardware,
}

{
	type: ADD_HARDWARE,
	hardware,
}

{
	type: REMOVE_HARDWARE,
	hardware,
}

{
	type: UPDATE_HARDWARE_PHOTO,
	hardware,
	hardwarePhoto,
}

{
	type: UPDATE_HARDWARE_DESCRIPTION,
	hardware,
	description
}
