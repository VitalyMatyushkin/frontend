/**
 * Created by Woland on 12.04.2017.
 */
const TypeCheckHelper = require('module/helpers/type_check_helper');

const CropImageHelper = {
	/**
	 * Function return new file, created from canvas.toDataURL method, for sending to server
	 * @param {string} dataurl
	 * @param {string} filename
	 * @returns {File}
	 */
	dataURLtoFile: function(dataurl, filename) {
		const 	arr 	= dataurl.split(','),
				mime 	= arr[0].match(/:(.*?);/)[1],
				bstr 	= window.atob(arr[1]);
		
		let 	n 		= bstr.length,
				u8arr 	= new window.Uint8Array(n);
		
		while (n--) {
			u8arr[n] = bstr.charCodeAt(n);
		}
		
		return new window.File([u8arr], filename, {type:mime});
	}
};

module.exports = CropImageHelper;