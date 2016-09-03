export function formatUserInfo (name, uid) {
	return {
		name,
		uid,
	}
}

export function formatHardware (make, model, description, photo) {
	return {
		make,
		model,
		description,
		photo,
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

export function formatItem (purchasedAtDate, itemId, itemPersonId, itemHardwareId, notes, photo) {
	return {
		purchasedAtDate,
		itemId,
		itemPersonId,
		itemHardwareId,
		notes,
		photo,
	}
}
