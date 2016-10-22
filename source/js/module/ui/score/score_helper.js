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
	 * Convert string value to points
	 * @param {string} value - string value
	 * @param {string} mask - points.inputMask
	 * @returns {number} - points
	 */
	stringTimeToPoints: function(value, mask){
		const 	maskParts 	= mask.replace(/[^hmsc]/g, ':').split(':'),
				valueParts 	= value.replace(/[^0-9]/g, ':').split(':');

		let result = 0;
		for(let i=0; i < maskParts.length; i++){
			switch (maskParts[i]){
				case 'h':
				case 'hh':
				case 'hhh':
					result += valueParts[i]*3600;
					break;
				case 'm':
				case 'mm':
					result += valueParts[i] < 60 ? valueParts[i]*60 : NaN;
					break;
				case 's':
				case 'ss':
					result += valueParts[i] < 60 ? valueParts[i] : NaN;
					break;
				case 'c':
				case 'cc':
				case 'ccc':
				case 'cccc':
					result += valueParts[i]/(10*valueParts[i].length);
					break;
				default:
					result = NaN;
					break;
			}
		}
		return result;
	},

	/**
	 *
	 * */
	zeroFill:function(value, length){
		let str = value + '';

		if(str.length > length)
			str = str.substr(0, length);
		if(length > str.length)
			str = '0000'.substr(0, length - str.length) + str;

		return str;
	},

	/***/
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


	}
};

module.exports = ScoreHelper;