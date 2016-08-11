export default function auth () {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve({
				name: 'Logan Call',
				avatar: 'https://avatars0.githubusercontent.com/u/5152553?v=3&s=460',
				uid: 'logancall',
			})
		}, 1000)
	})
}
