/**
 * Created by Anatoly on 21.10.2016.
 */
const ScoreHelper = {
	DEFAULT_TIME_MASK: 'hh:mm:ss.ccc',
	DEFAULT_DISTANCE_MASK: 'kk mmm.cc',

	/**
	 * Validation result value according to 'plain' type
	 * @param {Number} value - value to validation
	 * @param {Number} pointsStep
	 * @returns {boolean/string} - false or error message
	 */
	pointsPlainValidation: function(value, pointsStep){
		return value % pointsStep === 0 ? false : 'Validation error!';
	},

	/**
	 * Fills the string with zeros, if the resulting string is less than the length of the mask.
	 * @param {number} value
	 * @param {number} length - length of the mask
	 * @returns {string} - zeroFill(12,4) -> '0012'
	 * */
	zeroFill:function(value, length){
		let str = value + '';

		if(str.length > length)
			str = str.substr(0, length);
		if(length > str.length)
			str = '0000'.substr(0, length - str.length) + str;

		return str;
	},

	/**
	 * Validation string value according to 'time' type
	 * @param {string} value - value to validation
	 * @param {string} mask - points.inputMask
	 * @returns {boolean/string} - false or error message
	 */
	stringTimeValidation: function(value, mask){
		const points = ScoreHelper.stringTimeToPoints(value, mask);

		return points ? false : 'Validation error!';
	},

	/**
	 * Convert string value to points according to the mask.
	 * @param {string} value - string value
	 * @param {string} mask - points.inputMask
	 * @returns {number} - points
	 */
	stringTimeToPoints: function(value, mask){
		const 	maskParts 	= mask.replace(/[^hmsc]/g, ':').split(':'),
			valueParts 	= value.replace(/[^0-9_]/g, ':').split(':');

		let result = 0;
		for(let i=0; i < maskParts.length; i++){
			let tmp = 0;
			switch (maskParts[i]){
				case 'h':		//here we use falling through
				case 'hh':
				case 'hhh':
					tmp = valueParts[i]*3600;
					break;
				case 'm':
				case 'mm':
					if(valueParts[i] < 60)
						tmp = valueParts[i]*60;
					else
						tmp = NaN;
					break;
				case 's':
				case 'ss':
					if(valueParts[i] < 60)
						result += valueParts[i]*1;
					else
						tmp = NaN;
					break;
				case 'c':
				case 'cc':
				case 'ccc':
				case 'cccc':
					if (typeof valueParts[i] !== 'undefined') {
						tmp = valueParts[i]*1/(Math.pow(10, valueParts[i].length));
					}
					break;
				default:
					tmp = NaN;
					break;
			}
			if(isNaN(tmp))
				return NaN;
			result += tmp;
		}
		return result;
	},

	/**
	 * Validation string value according to 'distance' type
	 * @param {string} value - value to validation
	 * @param {string} mask - points.inputMask
	 * @returns {boolean/string} - false or error message
	 */
	stringDistanceValidation: function(value, mask){
		const points = ScoreHelper.stringDistanceToPoints(value, mask);

		return points ? false : 'Validation error!';
	},

	/**
	 * Convert string value to points according to the mask.
	 * @param {string} value - string value
	 * @param {string} mask - points.inputMask
	 * @returns {number} - points
	 */
	stringDistanceToPoints: function(value, mask){
		const 	maskParts 	= mask.replace(/[^kmc]/g, ':').split(':'),
			valueParts 	= value.replace(/[^0-9_]/g, ':').split(':');

		let result = 0;
		for(let i=0; i < maskParts.length; i++){
			let tmp = 0;
			switch (maskParts[i]){
				case 'k':			//here we use falling through
				case 'kk':
				case 'kkk':
					tmp = valueParts[i]*100000;
					break;
				case 'm':
				case 'mm':
				case 'mmm':
					if(valueParts[i] < 1000)
						tmp = valueParts[i]*100;
					else
						tmp = NaN;
					break;
				case 'c':
				case 'cc':
					if(valueParts[i] < 100)
						result += valueParts[i]*1;
					else
						tmp = NaN;
					break;
				default:
					tmp = NaN;
					break;
			}
			if(isNaN(tmp))
				return NaN;
			result += tmp;
		}
		return result;
	}
};

module.exports = ScoreHelper;