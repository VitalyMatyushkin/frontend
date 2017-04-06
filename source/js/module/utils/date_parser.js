const   moment = require('moment');

const thisYear = moment().year();	// for example, 2017

/**
 * Parses string to Date taking in account fact that there is no any single user in system who born in future.
 * @param {string} date
 * @returns {Date} recognized date or undefined if date cannot be parsed
 */
const getBdayDateFormat = (date) => {
    const	parsedDate	= moment(date, ["DD/MM/YYYY", "DD/MM/YY", "DD/M/YY", "DD.MM.YYYY", "DD.MM.YY", "DD.M.YY", "YYYY-MM-DD", "DD MMM YYYY"]),
    		parsedYear	= parsedDate.year();

    if(parsedYear > thisYear) {				// rolling back 100 years if date in future. 2018 -> 1918
		parsedDate.year(parsedYear - 100);
	}

    return parsedDate.isValid() ? parsedDate.toDate() : undefined;
};


module.exports = getBdayDateFormat;