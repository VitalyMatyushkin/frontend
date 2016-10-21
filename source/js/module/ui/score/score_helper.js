/**
 * Created by Anatoly on 21.10.2016.
 */

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
	 * Validation result value according to 'time' type
	 * @param {Number} value - value to validation
	 * @param {string} mask - points.inputMask
	 * @returns {boolean/string} - false or error message
	 */
	stringTimeValidation: function(value, mask){
		return value ? false : 'Validation error!';
	},

	stringTimeToPoints: function(value, mask){
		return value ? false : 'Validation error!';
	},

};

module.exports = ScoreHelper;