/**
 * Created by Anatoly on 28.03.2016.
 */

import * as Moment from 'moment';

/** Some helpfull (??? I hope really helpfull) methods to deal with dates and time */
export const DateHelper = {

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

	getDateTimeUTCString: function(dateTime: Date): string {
		const 	date = this.getDateStringFromDateObject(dateTime),
				time = this.getTimeUTCStringFromDateObject(dateTime);

		return `${date}, ${time}`;
	},

	getFormatDateTimeUTCString: function(dateTime: Date): string {
		return Moment(dateTime).utc().format();
	},

	getDateTimeString: function(dateTime: Date): string {
		const 	date = this.getDateStringFromDateObject(dateTime),
				time = this.getTimeStringFromDateObject(dateTime);

		return `${date}, ${time}`;
	},

	/**
	 * return date in format "DD.MM.YYYY/HH:mm"
	 * @param {Date} dateTime
	 * @return {string}
	 */
	getDateShortTimeString: function(dateTime: Date): string {
		return Moment(dateTime).format('DD.MM.YYYY/HH:mm');
	},

	getDateLongTimeString: function(dateTime: Date): string {
		const strDateTime = Moment(dateTime).format('DD.MM.YYYY/HH:mm:ss');
		return strDateTime;
	},

	/** convert date from UTC-string to 'dd.mm.yyyy' format */
	toLocal:function(str: string): string {
		return this.getDateStringFromDateObject(new Date(str));
	},

	/** convert date time from UTC-string to 'dd.mm.yyyy hh:mm' format */
	toLocalDateTime:function(str: string): string {
		const date = this.parseValidDateTime(str);
		return this.getDateShortTimeString(date);
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

	/** convert local date format 'dd.mm.yyyy' to ISO-string */
	toIso: function(dotString: string): string {
		const dateParts = dotString ? dotString.split('.'):[],
		//ISO format date for locales == 'en-GB', format == 'yyyy-mm-dd'
			isoStr = dateParts[2]+'-'+ dateParts[1]+'-'+ dateParts[0];

		return isoStr;
	},

	/**
	 * Converts date from this format: "dd.mm.yyyy/hh:mm" to this "yyyy-mm-dd hh:mm"
	 * @param {string} dotString
	 * @return {string}
	 */
	toIsoDateTime: function(dotString: string): string {
		const dateTimeParts = dotString ? dotString.split('/'):[],
				dateParts = dateTimeParts[0] ? dateTimeParts[0].split('.'):[],
				timeParts = dateTimeParts[1] ? dateTimeParts[1].split(':'):[],

				//ISO format date, time for locales == 'en-GB', format == 'yyyy-mm-dd hh:mm'
				isoStr = dateParts[2] + '-' + dateParts[1] + '-' + dateParts[0] + ' ' + timeParts[0] + ':' + timeParts[1];

		return isoStr;
	},

	/** validation date ISO-format or 'yyyy-mm-dd' */
	isValid:function(value: string): boolean {
		if(Date.parse(value)){
			const 	date        = new Date(value),
					valueArray  = value.split('-'),
					day         = parseInt(valueArray[2].split('T')[0]),
					month       = parseInt(valueArray[1]),
					year        = parseInt(valueArray[0]);

			return date.getUTCFullYear() === year && date.getUTCMonth() === (month - 1) && date.getUTCDate() === day;
		}

		return false;
	},

	/**
	 * I'm not sure about all formats acceptable here, but at least it takes values with format "YYYY-MM-DD HH:mm"
	 * @param {string} value
	 * @return {boolean}
	 */
	isValidDateTime:function(value: string): boolean {
		if (value.indexOf('T') !== -1){
			value = Moment(value).format('YYYY-MM-DD HH:mm');
		}

		const momentResult = Moment(value, 'YYYY-MM-DD HH:mm', true).isValid();
		return momentResult;
	},

	parseValidDateTime: function(value: string): Date {
		return Moment(value, 'YYYY-MM-DD HH:mm', true).toDate();
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

	/**
	 * {
	 * 	"January': 0,
	 * 	"February": 1,
	 * 	..............
	 * 	"December": 11
	 * }
	 */
	getRevertIndexedMonthMap: function() {
		const monthMap = {};

		this.monthNames.forEach((month, index) => {
			monthMap[month] = index;
		});

		return monthMap;
	}
};


