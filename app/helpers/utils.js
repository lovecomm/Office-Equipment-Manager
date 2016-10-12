// import imagemin from 'imagemin'
// import imageminJpegtran from 'imagemin-jpegtran'
//
// export function processImage (image) {
// 	console.log(image)
// 	return imagemin([image.name], 'build/images', {use: [imageminJpegtran()]}).then(() => {
// 		console.log('Images optimized')
// 	})
// }

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
