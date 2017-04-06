// @flow

const   moment = require('moment');

const thisYear = moment().year();	// for example, 2017

/**
 * Parses string to Date taking in account fact that there is no any single user in system who born in future.
 * @param {string} str
 * @returns {Date} recognized date or undefined if date cannot be parsed
 */
const getBdayDateFormat = function(str: string): ?Date {
    const	parsedDate	= moment(str, ["DD/MM/YYYY", "DD/MM/YY", "DD/M/YY", "DD.MM.YYYY", "DD.MM.YY", "DD.M.YY", "YYYY-MM-DD", "DD MMM YYYY"]);

    if(parsedDate.isValid() === true) {
		const parsedYear	= parsedDate.year();

		if(parsedYear > thisYear) {				// rolling back 100 years if date in future. 2018 -> 1918
			parsedDate.year(parsedYear - 100);
		}

		return parsedDate.toDate();
	} else {
    	return undefined;
	}
};


module.exports = getBdayDateFormat;