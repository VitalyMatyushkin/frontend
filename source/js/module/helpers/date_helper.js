/**
 * Created by Anatoly on 28.03.2016.
 */

/** Some helpfull (??? I hope really helpfull) methods to deal with dates and time */
const DateHelper = {

    /** convert date from UTC-string to 'dd/mm/yyyy' format */
    getDate: function (string) {
        return new Date(string).toLocaleDateString('en-GB', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        }).replace(/\./g, '/');
    },

    /** Extracts time from date string.
     * @param string {String} any date string which can be parsed by `new Date(...)` constructor
     * @returns {string} string in 'hh:mm' format
     */
    getTime: function(string){
        const   date        = new Date(string),
                zeroFill    = (i) => (i < 10 ? '0' : '') + i;

        return zeroFill(date.getHours()) + ':' + zeroFill(date.getMinutes());
    },
	/**
     * Return date time for first day of current month.
     * @param date - is a date time string like that "Sun Jul 03 2016 20:46:21 GMT+0600 (RTZ 5 (зима))"
     */
    getStartDateTimeOfMonth: function(date) {
        const self = this;

        const _date = new Date(date);

        return `${_date.getFullYear()}-${self.getMonthString(date)}-01T${self.getZeroTimeString()}`;
    },
    /**
     * Return date time for last day of current month.
     * @param date - is a date time string like that "Sun Jul 03 2016 20:46:21 GMT+0600 (RTZ 5 (зима))"
     */
    getEndDateTimeOfMonth: function(date) {
        const self = this;

        const _date = new Date(date);

        return `${_date.getFullYear()}-${self.getMonthString(date)}-${self.getLastDayOfMonth(date)}T${self.getEndDayTimeString()}`;
    },
    getMonthNumber: function(date) {
        return new Date(date).getMonth() + 1;
    },
	/**
     * Return month in string format for current date.
     * If number of month less then 10, then add "0" to start of month string, for example "7" => "07".
     */
    getMonthString: function(date) {
        const self = this;

        const monthNumber = self.getMonthNumber(date);

        let monthSting;

        if(monthNumber < 10) {
            monthSting = `0${monthNumber}`;
        } else {
            monthSting = `${monthNumber}`;
        }

        return monthSting;
    },
	/**
     * Just return string "00:00.000Z"
     */
    getZeroTimeString: function() {
        return "00:00:00.000Z";
    },
    /**
     * Just return string "00:00:00.000Z"
     */
    getEndDayTimeString: function() {
        return "23:59:59.000Z";
    },
    /**
     * Return last date of month
     * @param date - is a date time string like that "Sun Jul 03 2016 20:46:21 GMT+0600 (RTZ 5 (зима))"
     */
    getLastDayOfMonth: function(date) {
        const _date = new Date(date);

        const lastDayOfMonthDateTime = new Date(_date.getFullYear(), _date.getMonth() + 1, 0);

        return lastDayOfMonthDateTime.getDate();
    }
};

module.exports = DateHelper;


