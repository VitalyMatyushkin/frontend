const BigScreenActions = require('./../../actions/BigScreenActions');

const HighlightPhotosHelper = {
	DEFAULT_PHOTO_URL: '//images.squadintouch.com/images/3txvxdlvjkcm65e13re3nbeuoyoft8pwnhd3_1478107508550.jpg',
	getPhotoStyleArray: function (photos) {
		const photoArray = [];
		const selectedPhotoIndexArray = []; // memory
		// need three photo or less
		let iterationCount = photos.length < 3 ? photos.length : 3;

		for(let i = 0; i < iterationCount; i++) {
			let currentPhotoIndex;
			do {
				const tempPhotoIndex = BigScreenActions.getRandomPhotoIndex(photos);
				// doesn't duplicate
				if(selectedPhotoIndexArray.findIndex(i => i === tempPhotoIndex) === -1) {
					currentPhotoIndex = tempPhotoIndex;
					selectedPhotoIndexArray.push(tempPhotoIndex);
				}
			} while(typeof currentPhotoIndex === 'undefined');

			photoArray.push(
				this.getStyleForPicByUrl(
					photos[currentPhotoIndex].picUrl
				)
			)
		}

		return photoArray;
	},
	/**
	 * Function returns html attr style with one prop - backgroundImage
	 * by param url
	 * @param url
	 * @returns {{backgroundImage: string}}
	 */
	getStyleForPicByUrl: function (url) {
		return {
			backgroundImage: `url(${url})`
		};
	}
};

module.exports = HighlightPhotosHelper;