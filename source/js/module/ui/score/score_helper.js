/**
 * Created by Anatoly on 21.10.2016.
 */
const ScoreHelper = {
	DEFAULT_TIME_MASK:		'hh:mm:ss.ccc',
	DEFAULT_DISTANCE_MASK:	'kk mmm.cc',

	HOUR_REGEX:							/h{1,}/i,
	HOUR_WITH_DELIMITER_REGEX:			/h{1,}(.)/i,
	MINUTE_REGEX:						/m{1,2}/i,
	MINUTE_WITH_DELIMITER_REGEX:		/m{1,2}(.)/i,
	SECOND_REGEX:						/s{1,2}/i,
	SECOND_WITH_DELIMITER_REGEX:		/s{1,2}(.)/i,
	MILLISECOND_REGEX:					/c{1,}/i,

	KILOMETER_REGEX:					/k{1,3}/i,
	KILOMETER_WITH_DELIMITER_REGEX:		/k{1,3}(.)/i,
	METER_REGEX:						/m{1,3}/i,
	METER_WITH_DELIMITER_REGEX:			/m{1,3}(.)/i,
	CENTIMETER_REGEX:					/c{1,2}/i,

	/**
	 * Function validates plain score
	 * @param {Number} value - value to validation
	 * @param {Number} pointsStep
	 * @returns {boolean/string} - false(mean value is ok)/error message
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
	 * Function validates time score
	 * @param {string} value - value to validation
	 * @param {string} mask - points.inputMask
	 * @returns {boolean/string} - false(mean value is ok)/error message
	 */
	validateStringTime: function(value, mask){
		const points = this.stringTimeToPoints(value, mask);

		// Points must be a number but not a Nan or Infinite
		// Otherwise points are not valid
		return typeof points === 'number' && isFinite(points) ? false : 'Validation error!';
	},

	/**
	 * Convert string value to points according to the mask.
	 * @param {string} value - string value
	 * @param {string} mask - points.inputMask
	 * @returns {number} - points, if value is not valid returns Nan
	 */
	stringTimeToPoints: function(value, mask){
		const	maskParts	= mask.replace(/[^hmsc]/g, ':').split(':'),
				valueParts	= value.replace(/[^0-9_]/g, ':').split(':');

		let result = 0;
		for(let i=0; i < maskParts.length; i++){
			let currentMaskPart = maskParts[i];

			let tmp = 0;
			switch (true){
				case this.isHourMask(currentMaskPart): {
					tmp = valueParts[i] * 3600;
					break;
				}
				case this.isMinuteMask(currentMaskPart): {
					if(valueParts[i] < 60) {
						tmp = valueParts[i]*60;
					} else {
						tmp = NaN;
					}
					break;
				}
				case this.isSecondMask(currentMaskPart): {
					if(valueParts[i] < 60) {
						result += valueParts[i]*1;
					} else {
						tmp = NaN;
					}
					break;
				}
				case this.isMillisecondMask(currentMaskPart): {
					if (typeof valueParts[i] !== 'undefined') {
						tmp = valueParts[i] * 1 / (Math.pow(10, valueParts[i].length));
					}
					break;
				}
				default:
					tmp = NaN;
					break;
			}
			if(isNaN(tmp)) {
				return NaN;
			}
			result += tmp;
		}

		return result;
	},
	plainPointsToTimeString: function(value, mask){
		const	valueParts			= String(value).split('.'),
				integerPartOfValue	= Number(valueParts[0]),
				floatPartOfValue	= Number(typeof valueParts[1] !== 'undefined' ? valueParts[1] : 0);

		// just copy integer part of plain points
		let		remainder			= Number(integerPartOfValue);

		let timeString = '';

		const maskParts = mask.replace(/[^hmsc]/g, '.').split('.');

		maskParts.forEach(maskPart => {
			switch (true) {
				case (this.isHourMask(maskPart)): {
					const hourCount = this.getCountOfCurrentTimeUnit(remainder, 'HOURS');
					// remove hours in sec from remainder
					remainder -= hourCount * 3600;

					const hourString = this.convertValueUnitToStringByMask(hourCount, maskPart, 'TIME');

					timeString = hourString + this.getDelimiterByMaskAndRegex(mask, this.HOUR_WITH_DELIMITER_REGEX);
					break;
				}
				case (this.isMinuteMask(maskPart)): {
					const minCount = this.getCountOfCurrentTimeUnit(remainder, 'MINUTES');
					// remove minutes in sec from remainder
					remainder -= minCount * 60;

					const minString = this.convertValueUnitToStringByMask(minCount, maskPart, 'TIME');

					timeString += minString + this.getDelimiterByMaskAndRegex(mask, this.MINUTE_WITH_DELIMITER_REGEX);
					break;
				}
				case (this.isSecondMask(maskPart)): {
					// at this step remainder is a fresh seconds without hours(in sec naturally) and minutes(in sec naturally)
					const secCount = remainder;

					const secString = this.convertValueUnitToStringByMask(secCount, maskPart, 'TIME');

					timeString += secString + this.getDelimiterByMaskAndRegex(mask, this.SECOND_WITH_DELIMITER_REGEX);
					break;
				}
				case (this.isMillisecondMask(maskPart)): {
					const msecCount = String(floatPartOfValue);

					const msecString = this.convertValueUnitToStringByMask(msecCount, maskPart, 'TIME');

					timeString += msecString;
					break;
				}
			}
		});

		return timeString;
	},
	plainPointsToDistanceString: function(value, mask){
		// just copy integer part of plain points
		let remainder = Number(value);

		let distanceString = '';

		const maskParts = mask.replace(/[^kmc]/g, ':').split(':');

		maskParts.forEach(maskPart => {
			switch (true) {
				case (this.isKilometerMask(maskPart)): {
					const kmCount = this.getCountOfCurrentDistanceUnit(remainder, 'KILOMETERS');
					// remove km in cm from remainder
					remainder -= kmCount * 100000;

					const kmString = this.convertValueUnitToStringByMask(kmCount, maskPart, 'DISTANCE');

					distanceString = kmString + this.getDelimiterByMaskAndRegex(mask, this.KILOMETER_WITH_DELIMITER_REGEX);
					break;
				}
				case (this.isMeterMask(maskPart)): {
					const mCount = this.getCountOfCurrentDistanceUnit(remainder, 'METERS');
					// remove m in cm from remainder
					remainder -= mCount * 100;

					const mString = this.convertValueUnitToStringByMask(mCount, maskPart, 'DISTANCE');

					distanceString += mString + this.getDelimiterByMaskAndRegex(mask, this.METER_WITH_DELIMITER_REGEX);
					break;
				}
				case (this.isCentimeterMask(maskPart)): {
					// at this step remainder is a fresh cm without km(in cm naturally) and m(in cm naturally)
					const cmCount = remainder;

					const cmString = this.convertValueUnitToStringByMask(cmCount, maskPart, 'DISTANCE');

					distanceString += cmString;
					break;
				}
			}
		});

		return distanceString;
	},
	/**
	 * Function validates distance score
	 * @param {string} value - value to validation
	 * @param {string} mask - points.inputMask
	 * @returns {boolean/string} - false(mean value is ok)/error message
	 */
	stringDistanceValidation: function(value, mask){
		const points = this.stringDistanceToPoints(value, mask);

		// Points must be a number but not a Nan or Infinite
		// Otherwise points are not valid
		return typeof points === 'number' && isFinite(points) ? false : 'Validation error!';
	},

	/**
	 * Convert string value to points according to the mask.
	 * @param {string} value - string value
	 * @param {string} mask - points.inputMask
	 * @returns {number} - points, if value is not valid returns Nan
	 */
	stringDistanceToPoints: function(value, mask){
		const	maskParts	= mask.replace(/[^kmc]/g, ':').split(':'),
				valueParts	= value.replace(/[^0-9_]/g, ':').split(':');

		let result = 0;
		for(let i=0; i < maskParts.length; i++){
			let currentMaskPart = maskParts[i];

			let tmp = 0;
			switch (true){
				case (this.isKilometerMask(currentMaskPart)): {
					tmp = valueParts[i] * 100000;
					break;
				}
				case (this.isMeterMask(currentMaskPart)): {
					if(valueParts[i] < 1000) {
						tmp = valueParts[i]*100;
					} else {
						tmp = NaN;
					}
					break;
				}
				case (this.isCentimeterMask(currentMaskPart)): {
					if (valueParts[i] < 100) {
						result += valueParts[i] * 1;
					} else {
						tmp = NaN;
					}
					break;
				}
				default:
					tmp = NaN;
					break;
			}
			if(isNaN(tmp)) {
				return NaN;
			}
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
	convertValueUnitToStringByMask: function(value, mask, unit) {
		// convert value to string
		let result = String(value);

		switch (true) {
			case this.isCentimeterMask(mask) && unit === 'DISTANCE': {
				result = this.addZerosToStartByMask(result, mask);
				break;
			}
			// For milliseconds we have different rules than for other units
			// Because milliseconds are stored as fraction of float number
			// So we should add zeros to end if it need
			// Also we should cut off score string value
			// if value length more than mask length
			case this.isMillisecondMask(mask) && unit === 'TIME': {
				if(mask.length > result.length) {
					result = this.addZerosToEndByMask(result, mask);
				} else if(mask.length < result.length) {
					result = this.cutScoreValueByMask(result, mask);
				}
				break;
			}
			default: {
				result = this.addZerosToStartByMask(result, mask);
				break;
			}
		}

		return result;
	},
	isHourMask: function(mask) {
		return mask.search(this.HOUR_REGEX) !== -1;
	},
	isMinuteMask: function(mask) {
		return mask.search(this.MINUTE_REGEX) !== -1;
	},
	isSecondMask: function(mask) {
		return mask.search(this.SECOND_REGEX) !== -1;
	},
	isMillisecondMask: function(mask) {
		return mask.search(this.MILLISECOND_REGEX) !== -1;
	},
	isKilometerMask: function(mask) {
		return mask.search(this.KILOMETER_REGEX) !== -1;
	},
	isMeterMask: function(mask) {
		return mask.search(this.METER_REGEX) !== -1;
	},
	isCentimeterMask: function(mask) {
		return mask.search(this.CENTIMETER_REGEX) !== -1;
	},
	getDelimiterByMaskAndRegex: function (mask, regex) {
		const result = mask.match(regex);

		return result[1];
	},
	/**
	 * Function converts value like this:
	 * value - 1, mask - ccc
	 * result - 100.
	 * @param stringValue
	 * @param mask
	 * @returns {string}
	 */
	addZerosToEndByMask: function(stringValue, mask) {
		let result = String( stringValue );

		const zerosCount = mask.length - result.length;
		for(let i = 0; i < zerosCount; i++) {
			result = result + '0';
		}

		return result;
	},
	/**
	 * Function converts value like this:
	 * value - 1, mask - hh
	 * result - 01.
	 * @param stringValue
	 * @param mask
	 * @returns {string}
	 */
	addZerosToStartByMask: function(stringValue, mask) {
		let result = String( stringValue );

		const zerosCount = mask.length - result.length;
		for(let i = 0; i < zerosCount; i++) {
			result = '0' + result;
		}

		return result;
	},
	/**
	 * Function converts value like this:
	 * value - 12345, mask - ccc
	 * result - 123.
	 * @param stringValue
	 * @param mask
	 * @returns {string}
	 */
	cutScoreValueByMask: function(stringValue, mask) {
		return stringValue.substring(0, mask.length);
	}
};

module.exports = ScoreHelper;