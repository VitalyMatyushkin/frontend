const   moment = require('moment'),
        assert = require('assert');

/**
 * Creates Date Object for date as input string
 * @param {string} date
 * @returns {Date} recognized date
 */
const getBdayDateFormat = (date) => {
    const formatDate = moment(date, ["DD/MM/YYYY", "DD/MM/YY", "DD/M/YY", "DD.MM.YYYY", "DD.MM.YY", "DD.M.YY", "YYYY-MM-DD", "DD MMM YYYY"]);
    const getTwoDigitYear = parseInt(formatDate.year().toString().slice(-2));

    if (getTwoDigitYear > 52) formatDate.year(parseInt("19" + getTwoDigitYear));

    return formatDate.isValid() ? formatDate.toDate() : undefined;
};


module.exports = getBdayDateFormat;