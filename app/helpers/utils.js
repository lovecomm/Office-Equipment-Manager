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

export function formatPerson (personId, firstName, lastName) {
	return {
		personId,
		firstName,
		lastName,
	}
}

export function formatItem (itemId, purchasedAtDate, serial, itemPersonId, itemHardwareId, notes, photo) {
	return {
		itemId,
		purchasedAtDate,
		serial,
		itemPersonId,
		itemHardwareId,
		notes,
		photo,
	}
}
