const   {DateHelper} = require('module/helpers/date_helper');


/** Will mix in some useful date methods into React object */
const DateTimeMixin = {
	daysOfWeek: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
	daysOfWeekMedium: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
	monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],

	/** return month name based on provided index. Index starts from 0.
	 * @param monthIndex month index. STARTS FROM 0
	 * @returns {String} month name
     */
	getMonthName: function(monthIndex) {
		return this.monthNames[monthIndex];
	},

	/** return day of week name based on provided index. Index starts from 0.
	 * @param dayOfWeekIndex day of week index. STARTS FROM 0
	 * @returns {String} month name
	 */
	getDayOfWeekName: function(dayOfWeekIndex) {
		return this.daysOfWeek[dayOfWeekIndex];
	},
	/** converts int with leading 0 if int is less than 10 */
	zeroFill: function(i) {
		return (i < 10 ? '0' : '') + i;
	},
	/**
	 * converts provided date string to '01 May 2017' format
	 * @param dateString {String} any string which can be converted to date with `new Date(...)` constructor
	 * @returns {string} in following format '01 May 2017'
     */
	getDateFromIso: function(dateString) {
		const 	self 		= this,
				converDate 	= new Date(dateString),
				date 		= self.zeroFill(converDate.getDate()),
				month 		= converDate.getMonth(),
				year 		= converDate.getFullYear();

		return [date, self.getMonthName(month), year].join(' ');
	},

	/** Extracts time from date string.
	 * @param dateString {String} any date string which can be parsed by `new Date(...)` constructor
	 * @returns {string} string in 'hh:mm' format
	 */
	getTimeFromIso: function(dateString) {
		return DateHelper.getTime(dateString);
	},

	/** Return how much days in month which provided string relates to
	 * @param date {Date}
	 * @returns {number}
     */
	daysInMonth: function(date) {
		return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
	}
};

module.exports = DateTimeMixin;