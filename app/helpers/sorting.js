export function getFeedIdsSortByPeople (peopleFeed, nameType) {
	return new Promise((resolve, reject) => {
		const people = peopleFeed.people
		let peopleIds = peopleFeed.feedIds // need to be sorting people.person.firstName, people.person.lastName
		if (peopleFeed.sorting.sortOrder === 'asc') {
			peopleIds.sort(function (a, b) {
				const personA = people[a][nameType]
				const personB = people[b][nameType]
				if (personA > personB) {
					return 1
				} else if (personA < personB) {
					return -1
				} else {
					return 0
				}
			})
		} else { // getState().feed.sortOrder === 'dec'
			peopleIds.sort(function (a, b) {
				const personA = people[a][nameType]
				const personB = people[b][nameType]
				if (personA < personB) {
					return 1
				} else if (personA > personB) {
					return -1
				} else {
					return 0
				}
			})
		}
		resolve(peopleIds)
	})
}
