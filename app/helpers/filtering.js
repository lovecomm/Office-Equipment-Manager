export function buildFilterOptions (feedObjects, objectType, objectProperties) {
	// feedObjects should be people, hardware, or items objects that come from their respective feed.
	// objectType is a singular verison of string of the type of feedObjects ('person', 'hardware', 'item')
	// objectProperties is an array of properties on a given objectType... in order, these properties make up the 'label' of the filter option.
	return new Promise((resolve, reject) => {
		let options = {}
		for (const i in feedObjects) {
			const feedObject = feedObjects[i]
			options = {
				...options,
				[feedObject[`${objectType}Id`]]: combineObjectProperties(feedObject, objectProperties),
			}
		}
		resolve(options)
	})
}

function combineObjectProperties (feedObject, objectProperties) {
	let propertiesString = ''
	for (let i = 0; i <= objectProperties.length; i++) {
		propertiesString = `${propertiesString} ${feedObject[objectProperties[i]]}`
		if (i === objectProperties.length - 1) return propertiesString
	}
}
