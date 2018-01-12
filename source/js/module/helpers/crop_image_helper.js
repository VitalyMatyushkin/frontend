/**
 * Created by Woland on 12.04.2017.
 */
const CropImageHelper = {
	/**
	 * Function return new file, created from canvas.toDataURL method, for sending to server
	 * @param {string} dataurl
	 * @param {string} filename
	 * @returns {File}
	 */
	dataURLtoFile: function(dataurl) {
		const 	arrayFromDataUrl	= dataurl.split(','),
				mimeType 			= arrayFromDataUrl[0].match(/:(.*?);/)[1], //mime type: image/jpeg
				stringFromDataUrl	= window.atob(arrayFromDataUrl[1]); //function decodes a string of data which has been encoded using base-64 encoding

		let 	stringFromDataUrlLength		= stringFromDataUrl.length,
				u8arr 						= new window.Uint8Array(stringFromDataUrlLength);
		
		while (stringFromDataUrlLength--) {
			u8arr[stringFromDataUrlLength] = stringFromDataUrl.charCodeAt(stringFromDataUrlLength);
		}

		return new window.Blob([u8arr], {type:mimeType});
	}
};

module.exports = CropImageHelper;