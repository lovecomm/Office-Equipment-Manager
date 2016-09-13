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

export function formatPerson (firstName, lastName, email, photo) {
	return {
		firstName,
		lastName,
		email,
		photo,
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
