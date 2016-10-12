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

export function processImage (data) {
	if (data !== undefined) {
		return new Promise((resolve, reject) => {
			// Ensure it's an image
			if (data.type.match(/image.*/)) {
				// Load the image
				var reader = new FileReader()
				reader.onload = function (readerEvent) {
					var image = new Image()
					image.onload = function (imageEvent) {
						// Resize the image
						let canvas = document.createElement('canvas')
						const	MAX_SIZE = 300
						let	width = image.width
						let	height = image.height
						if (width > height) {
							if (width > MAX_SIZE) {
								height *= MAX_SIZE / width
								width = MAX_SIZE
							}
						} else {
							if (height > MAX_SIZE) {
								width *= MAX_SIZE / height
								height = MAX_SIZE
							}
						}
						canvas.width = width
						canvas.height = height
						canvas.getContext('2d').drawImage(image, 0, 0, width, height)
						const dataUrl = canvas.toDataURL('image/jpeg')
						const blobImage = dataURLToBlob(dataUrl)
						let resizedPhoto = new File([blobImage], data.name, {type: data.type})
						resolve(resizedPhoto)
					}
					image.src = readerEvent.target.result
				}
				reader.readAsDataURL(data)
			}
		})
	}
}

/* Utility function to convert a canvas to a BLOB */
function dataURLToBlob (dataURL, photoName) {
	var BASE64_MARKER = 'base64,'
	if (dataURL.indexOf(BASE64_MARKER) === -1) {
		var parts = dataURL.split(',')
		var contentType = parts[0].split(':')[1]
		var raw = parts[1]
		return new Blob([raw], {type: contentType})
	} else {
		var parts = dataURL.split(BASE64_MARKER)
		var contentType = parts[0].split(':')[1]
		var raw = window.atob(parts[1])
		var rawLength = raw.length

		var uInt8Array = new Uint8Array(rawLength)

		for (var i = 0; i < rawLength; ++i) {
			uInt8Array[i] = raw.charCodeAt(i)
		}
		return new Blob([uInt8Array], {type: contentType})
	}
}
/* End Utility function to convert a canvas to a BLOB      */
