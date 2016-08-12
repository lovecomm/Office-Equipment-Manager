{
	users: {
		isAuthed,
		isFetching,
		isLoggingOut,
		error,
		authedId,
		[uid]: {
			lastUpdated,
			info: {
				uid,
				name,
				email,
				password,
			}
		}
	},
	items: {
		isFetching,
		error,
		[itemId]: {
			lastUpdated,
			info: {
				status,
				purchasedAt,
				assignedAt,
				itemNoteIds: [itemNoteId, itemNoteId, itemNoteId],
				itemPhotoIds: [itemPhotoId, itemPhotoId, itemPhotoId],
				[personId],
				[hardwareId],
			},
		},
	},
	itemPhotos: {
		isFetching,
		error,
		[itemPhotoId]: {
			lastUpdated,
			info {
				filename,
				mime,
				path,
			},
		},
	},
	itemNotes: {
		isFetching,
		error,
		[itemNotesId]: {
			lastUpdated,
			info: {
				body,
			}
		},
	},
	people: {
		isFetching,
		error,
		[personId]: {
			lastUpdated,
			info: {
				personId,
				personPhoto,
				fname,
				lname,
				email,
			},
		},
	},
	hardwares: {
		isFetching,
		error,
		[hardwareId]: {
			lastUpdated,
			info: {
				make,
				model,
				description,
				hardwarePhoto,
			},
		},
	},
}
