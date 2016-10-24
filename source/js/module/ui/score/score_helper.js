/**
 * Created by Anatoly on 21.10.2016.
 */
const 	TeamHelper  = require('module/ui/managers/helpers/team_helper'),
		SportConsts	= require('module/helpers/consts/sport');

const ScoreHelper = {

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
		const points = this.stringTimeToPoints(value, mask);

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
				case 'h':
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
					tmp = valueParts[i]*1/(Math.pow(10, valueParts[i].length));
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
	 * Convert points to string value according to the mask.
	 * @param {number} countPoints - count of points
	 * @param {string} mask - points.inputMask
	 * @returns {string} - string value without separators
	 * */
	pointsToStringTime: function(countPoints, mask){
		const 	maskParts 	= mask.replace(/[^hmsc]/g, ':').split(':'),
			valueParts 	= TeamHelper.convertPoints(countPoints, SportConsts.SPORT_POINTS_TYPE.TIME);

		let result = '';

		for(let i=0; i < maskParts.length; i++){
			switch (maskParts[i]){
				case 'h':
				case 'hh':
				case 'hhh':
					result += this.zeroFill(valueParts.h, maskParts[i].length);
					break;
				case 'm':
				case 'mm':
					result += this.zeroFill(valueParts.min, maskParts[i].length);
					break;
				case 's':
				case 'ss':
					result += this.zeroFill(valueParts.sec, maskParts[i].length);
					break;
				case 'c':
				case 'cc':
				case 'ccc':
					result += this.zeroFill(valueParts.ms, maskParts[i].length);
					break;
				case 'cccc':
					result += this.zeroFill(valueParts.ms*10, maskParts[i].length);
					break;
			}
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
		const points = this.stringDistanceToPoints(value, mask);

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
				case 'k':
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
	},

	/**
	 * Convert points to string value according to the mask.
	 * @param {number} countPoints - count of points
	 * @param {string} mask - points.inputMask
	 * @returns {string} - string value without separators
	 * */
	pointsToStringDistance: function(countPoints, mask){
		const 	maskParts 	= mask.replace(/[^kmc]/g, ':').split(':'),
				valueParts 	= TeamHelper.convertPoints(countPoints, SportConsts.SPORT_POINTS_TYPE.DISTANCE);

		let result = '';

		for(let i=0; i < maskParts.length; i++){
			switch (maskParts[i]){
				case 'k':
				case 'kk':
				case 'kkk':
					result += this.zeroFill(valueParts.km, maskParts[i].length);
					break;
				case 'm':
				case 'mm':
				case 'mmm':
					result += this.zeroFill(valueParts.m, maskParts[i].length);
					break;
				case 'c':
				case 'cc':
					result += this.zeroFill(valueParts.cm, maskParts[i].length);
					break;
			}
		}
		return result;
	}
};

module.exports = ScoreHelper;