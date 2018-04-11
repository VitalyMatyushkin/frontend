/**
 * Created by Anatoly on 28.03.2016.
 */

import * as Moment from 'moment';

/** Some helpfull (??? I hope really helpfull) methods to deal with dates and time */
export const DateHelper = {
	getFormatDateUTCStringByRegion: function(date: Date, region: string): string {
		return region === 'US' ? Moment(date, 'YYYY-DD-MM').utc().format() :
			Moment(date, 'YYYY-MM-DD').utc().format();
	},
	getFormatDateTimeUTCStringByRegion: function(dateTime: Date, region: string): string {
		return region === 'US' ? Moment(dateTime, 'YYYY-DD-MM HH:mm').utc().format() :
			Moment(dateTime, 'YYYY-MM-DD HH:mm').utc().format();
	},
	getFormatDateTimeUTCString: function(dateTime: Date): string {
		return Moment(dateTime, 'YYYY-MM-DD HH:mm').utc().format();
	},
	getFormatDateTimeFromISOByRegion: function(dateTime: Date | string, region: string): string {
		return region === 'US' ? Moment(dateTime).format('MM.DD.YYYY hh:mm A') :
			Moment(dateTime).format('DD.MM.YYYY HH:mm');
	},

	getFormatDateToSend: function (date: Date, region: string) {
		return region === 'US' ? Moment(date, 'YYYY-DD-MM').format('YYYY-MM-DD') :
			date;
	},
	/**
	 * Get date string dd.mm.yyyy from date object
	 * Use it instead date.toLocaleDateString
	 * Because we have problem with date.toLocaleDateString for some time zone
	 * @param date
	 * @returns {*}
	 */
	getDateStringFromDateObject: function(date: Date): string {
		return Moment(date).format('DD.MM.YYYY');
	},

	getDateStringByRegion: function(date: Date, region: string): string {
		return region === 'US' ? Moment(date).format('MM.DD.YYYY') : Moment(date).format('DD.MM.YYYY');
	},

	getLongDateTimeStringByRegion: function(dateTime: Date, region: string): string {
		return region === 'US' ? Moment(dateTime).format('MMMM DD YYYY hh:mm A') : Moment(dateTime).format('DD MMMM YYYY HH:mm');
	},

	getLongDateStringByRegion: function(date: Date, region: string): string {
		return region === 'US' ?  Moment(date).format('MMMM DD YYYY') : Moment(date).format('DD MMMM YYYY');
	},

	/** convert date from UTC-string to 'dd.mm.yyyy' format */
	toLocal:function(str: string): string {
		return this.getDateStringFromDateObject(new Date(str));
	},

	toLocalForUS:function(str: string): string {
		return Moment(str,'YYYY-DD-MM').format('MM.DD.YYYY');
	},

	toLocalForGB:function(str: string): string {
		return Moment(str,'YYYY-MM-DD').format('DD.MM.YYYY');
	},

	/** validation date ISO-format or 'yyyy-mm-dd' */
	isValidForGB:function(value: string): boolean {
		if (value.indexOf('T') !== -1){
			value = Moment(value).format('YYYY-MM-DD');
		}

		return Moment(value, 'YYYY-MM-DD', true).isValid();
	},

	isValidForUS:function(value: string): boolean {
		if (value.indexOf('T') !== -1){
			value = Moment(value).format('YYYY-DD-MM');
		}
		return Moment(value, 'YYYY-DD-MM', true).isValid();
	},

	/**
	 * Get time string dd.mm.yyyy from date object
	 * Use it instead date.toLocaleTimeString
	 * Because we have problem with date.toLocaleTimeString for some time zone
	 * @param date
	 * @returns {*}
	 */
	getTimeStringFromDateObject: function(date: Date): string {
		return new Date(date).toTimeString().match(/[0-9]{1,2}:[0-9]{2}:[0-9]{2}/i)[0];
	},
	getTimeUTCStringFromDateObject: function(date: Date): string {
		return new Date(date).toUTCString().match(/[0-9]{1,2}:[0-9]{2}:[0-9]{2}/i)[0];
	},
	getShortTimeStringFromDateObject: function(date: Date): string {
		return new Date(date).toTimeString().match(/[0-9]{1,2}:[0-9]{2}/i)[0];
	},

	/**
	 * return date in format "DD.MM.YYYY/HH:mm"
	 * @param {Date} dateTime
	 * @return {string}
	 */
	getDateLongTimeString: function(dateTime: Date): string {
		const strDateTime = Moment(dateTime).format('DD.MM.YYYY/HH:mm:ss');
		return strDateTime;
	},

	/** convert date time from UTC-string to 'dd.mm.yyyy hh:mm' format */
	toLocalDateTimeForUS:function(str: string): string {
		return Moment(str, 'YYYY-DD-MM HH:mm').format('MM.DD.YYYY/HH:mm');
	},

	toLocalDateTimeForGB:function(str: string): string {
		return Moment(str).format('DD.MM.YYYY/HH:mm');
	},

	// TODO rename it to getDateStringFromUTCDateString
	/** convert date from UTC-string to 'dd/mm/yyyy' format */
	getDate: function (str: string): string {
		return this.toLocal(str).replace(/[.]/g, '/');
	},

	/** convert date from UTC-string to 'dd mmm yyyy' format */
	toLocalWithMonthName:function(utcStr){
		// TODO birthday?? WTF??
		const 	birthday	= new Date(utcStr),
				date		= this.zeroFill(birthday.getDate()),
				month		= birthday.getMonth(),
				year		= birthday.getFullYear();

		return [date, this.getMonthName(month), year].join(' ');

	},

	/**
	 * I'm not sure about all formats acceptable here, but at least it takes values with format "YYYY-MM-DD HH:mm"
	 * @param {string} value
	 * @return {boolean}
	 */
	isValidDateTimeForUS:function(value: string): boolean {
		if (value.indexOf('T') !== -1){
			value = Moment(value).format('YYYY-DD-MM HH:mm');
		}

		const momentResult = Moment(value, 'YYYY-DD-MM HH:mm', true).isValid();
		return momentResult;
	},

	isValidDateTimeForGB:function(value: string): boolean {
		if (value.indexOf('T') !== -1){
			value = Moment(value).format('YYYY-MM-DD HH:mm');
		}

		const momentResult = Moment(value, 'YYYY-MM-DD HH:mm', true).isValid();
		return momentResult;
	},

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
	getDayOfWeekName: function(dayOfWeekIndex){
		return this.daysOfWeek[dayOfWeekIndex];
	},

	/** converts int with leading 0 if int is less than 10 */
	zeroFill: function(i) {
		return (i < 10 ? '0' : '') + i;
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
		const _date = new Date(date);

        return `${_date.getFullYear()}-${this.getMonthString(date)}-01T${this.getZeroTimeString()}`;
    },
    /**
     * Return date time for last day of current month.
     * @param date - is a date time string like that "Sun Jul 03 2016 20:46:21 GMT+0600 (RTZ 5 (зима))"
     */
    getEndDateTimeOfMonth: function(date){
        const _date = new Date(date);

        return `${_date.getFullYear()}-${this.getMonthString(date)}-${this.getLastDayOfMonth(date)}T${this.getEndDayTimeString()}`;
    },
    getMonthNumber: function(date) {
        return new Date(date).getMonth() + 1;
    },
	/**
     * Return month in string format for current date.
     * If number of month less then 10, then add "0" to start of month string, for example "7" => "07".
     */
    getMonthString: function(date) {
        const monthNumber = this.getMonthNumber(date);

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

	getShortDateString: function(date) {
		const	dayString	= this.zeroFill(date.getDate()),
				monthString	= this.getMonthName(date.getMonth());

		return `${dayString} ${monthString}`;
	},

	isToday: function(date) {
		return this.getDate(new Date()) === this.getDate(date);
	},

	getTomorrow: function() {
		const tomorrow = new Date();
		tomorrow.setDate(tomorrow.getDate() + 1);

		return tomorrow;
	},

	isTomorrow: function(date) {
		return this.getDate(this.getTomorrow()) === this.getDate(date);
	},

	/**
	 * Return array of dates from this month. Like [1, 2, 3...28] for Feb, 2017
	 * @param {Number} year as is
	 * @param {Number} month 0-based as in date
	 * @returns {Array.<Number>}
	 */
	getDaysFromCurrentMonth: function(year: number, month: number): number[] {
		const countMonthDays = new Date(year, month + 1, 0).getDate();

		const daysArray = [];
		for(let i = 1; i <= countMonthDays; i++) {
			daysArray.push(i);
		}

		return daysArray;
	},
	/**
	 * Get array [currentYear - 5 ... currentYear - 1, currentYear, currentYear + 1 ... currentYear + 5]
	 */
	getYearRangeArray: function(): number[] {
		const currentYear = new Date().getFullYear();

		const yearRangeArray = [];

		for(let i = currentYear - 5; i <= currentYear + 5; i++) {
			yearRangeArray.push(i);
		}

		return yearRangeArray;
	},
};


