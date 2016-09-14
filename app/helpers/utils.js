export function formatUserInfo (name, uid) {
	return {
		name,
		uid,
	}
}

export function formatHardware (make, model, description, photo, isComputer) {
	return {
		make,
		model,
		description,
		photo,
		isComputer,
	}
}

export function formatPerson (editing, personId, firstName, lastName) {
	return {
		editing,
		personId,
		firstName,
		lastName,
	}
}

export function formatItem (itemId, purchasedDate, serial, personId, hardwareId, note, photo) {
	return {
		itemId,
		purchasedDate,
		serial,
		personId,
		hardwareId,
		note,
		photo,
	}
}
