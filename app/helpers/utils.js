export function determineItemHasSubContent (item, hardwareDescription) {
	if (item.photo === undefined) {
		if (item.note !== '' || hardwareDescription !== '') {
			return true
		} else {
			return false
		}
	} else {
		if (item.note !== '' || item.photo.size !== undefined || hardwareDescription !== '') {
			return true
		} else {
			return false
		}
	}
}
