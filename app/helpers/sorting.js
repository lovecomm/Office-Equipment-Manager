export function getSortedFeedIds (feed, feedObjectsType, objectProperty) {
	return new Promise((resolve, reject) => {
		const feedObjects = feed[feedObjectsType]
		let feedIds = feed.feedIds
		if (feed.sorting.sortOrder === 'asc') {
			feedIds.sort(function (a, b) {
				const feedObjectA = feedObjects[a][objectProperty]
				const feedObjectB = feedObjects[b][objectProperty]
				if (feedObjectA > feedObjectB) {
					return 1
				} else if (feedObjectA < feedObjectB) {
					return -1
				} else {
					return 0
				}
			})
		} else { // getState().feed.sortOrder === 'dec'
			feedIds.sort(function (a, b) {
				const feedObjectA = feedObjects[a][objectProperty]
				const feedObjectB = feedObjects[b][objectProperty]
				if (feedObjectA < feedObjectB) {
					return 1
				} else if (feedObjectA > feedObjectB) {
					return -1
				} else {
					return 0
				}
			})
		}
		resolve(feedIds)
	})
}
