/**
 * Created by Anatoly on 21.10.2016.
 */
const ScoreHelper = {
	DEFAULT_TIME_MASK:      'hh:mm:ss.ccc',
	DEFAULT_DISTANCE_MASK:  'kk mmm.cc',

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
		const   maskParts   = mask.replace(/[^hmsc]/g, ':').split(':'),
			valueParts  = value.replace(/[^0-9_]/g, ':').split(':');

		let result = 0;
		for(let i=0; i < maskParts.length; i++){
			let tmp = 0;
			switch (maskParts[i]){
				case 'h':       //here we use falling through
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
	plainPointsToTimeString: function(value, mask, separator = ':'){
		const	valueParts			= String(value).split('.'),
				integerPartOfValue	= Number(valueParts[0]),
				floatPartOfValue	= Number(typeof valueParts[1] !== 'undefined' ? valueParts[1] : 0);

		// just copy integer part of plain points
		let		remainder			= Number(integerPartOfValue);

		let timeString = '';

		const maskParts = mask.replace(/[^hmsc]/g, ':').split(':');

		maskParts.forEach(maskPart => {
			if(maskPart.search(/h{1,3}/) !== -1) {
				const hourCount = this.getCountOfCurrentTimeUnit(remainder, 'HOURS');
				// remove hours in sec from remainder
				remainder -= hourCount * 3600;

				const hourString = this.convertValueUnitToStringByMask(hourCount, maskPart);

				timeString = hourString + separator;
			} else if(maskPart.search(/m{1,2}/) !== -1) {
				const minCount = this.getCountOfCurrentTimeUnit(remainder, 'MINUTES');
				// remove minutes in sec from remainder
				remainder -= minCount * 60;

				const minString = this.convertValueUnitToStringByMask(minCount, maskPart);

				timeString += minString + separator;
			} else if(maskPart.search(/s{1,2}/) !== -1) {
				// at this step remainder is a fresh seconds without hours(in sec naturally) and minutes(in sec naturally)
				const secCount = remainder;

				const secString = this.convertValueUnitToStringByMask(secCount, maskPart);

				timeString += secString + separator;
			} else if(maskPart.search(/c{1,4}/) !== -1) {
				const msecCount = String(floatPartOfValue);

				const msecString = this.convertValueUnitToStringByMask(msecCount, maskPart);

				timeString += msecString;
			}
		});

		return timeString;
	},
	plainPointsToDistanceString: function(value, mask, separator = ':'){
		// just copy integer part of plain points
		let remainder = Number(value);

		let distanceString = '';

		const maskParts = mask.replace(/[^hmsc]/g, ':').split(':');

		maskParts.forEach(maskPart => {
			if(maskPart.search(/k{1,3}/) !== -1) {
				const kmCount = this.getCountOfCurrentDistanceUnit(remainder, 'KILOMETERS');
				// remove km in cm from remainder
				remainder -= kmCount * 100000;

				const kmString = this.convertValueUnitToStringByMask(kmCount, maskPart);

				distanceString = kmString + separator;
			} else if(maskPart.search(/m{1,3}/) !== -1) {
				const mCount = this.getCountOfCurrentDistanceUnit(remainder, 'METERS');
				// remove m in cm from remainder
				remainder -= mCount * 100;

				const mString = this.convertValueUnitToStringByMask(mCount, maskPart);

				distanceString += mString + separator;
			} else if(maskPart.search(/c{1,2}/) !== -1) {
				// at this step remainder is a fresh cm without km(in cm naturally) and m(in cm naturally)
				const cmCount = remainder;

				const cmString = this.convertValueUnitToStringByMask(cmCount, maskPart);

				distanceString += cmString + separator;
			}
		});

		return distanceString;
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
		const	maskParts	= mask.replace(/[^kmc]/g, ':').split(':'),
				valueParts	= value.replace(/[^0-9_]/g, ':').split(':');

		let result = 0;
		for(let i=0; i < maskParts.length; i++){
			let tmp = 0;
			switch (maskParts[i]){
				case 'k':           //here we use falling through
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

	getCountOfCurrentTimeUnit: function(value, timeUnit) {
		switch (timeUnit) {
			case 'HOURS':
				return Math.floor( value / 3600 );
			case 'MINUTES':
				return Math.floor( value / 60 );
			case 'SECONDS':
				return value;
			default:
				return 0;
		}
	},
	getCountOfCurrentDistanceUnit: function(value, distanceUnit) {
		switch (distanceUnit) {
			case 'KILOMETERS':
				return Math.floor( value / 100000 );
			case 'METERS':
				return Math.floor( value / 100 );
			default:
				return 0;
		}
	},
	convertValueUnitToStringByMask: function(value, mask) {
		// convert value to string
		let result = String(value);

		const zerosCount = mask.length - result.length;
		for(let i = 0; i < zerosCount; i++) {
			result = '0' + result;
		}

		return result;
	}
};

module.exports = ScoreHelper;