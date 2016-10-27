/**
 * Created by Anatoly on 28.03.2016.
 */

/** Some helpfull (??? I hope really helpfull) methods to deal with dates and time */
const DateHelper = {

	/**
	 * Get date string dd.mm.yyyy from date object
	 * Use it instead date.toLocaleDateString
	 * Because we have problem with date.toLocaleDateString for some time zone
	 * @param date
	 * @returns {*}
	 */
	getDateStringFromDateObject: function(date) {
		const copyDate = new Date(date);

		const	day		= copyDate.getDate() < 10 ?
						'0' + copyDate.getDate() :
						copyDate.getDate(),
				month	= (copyDate.getMonth() + 1) < 10 ?
						'0' + (copyDate.getMonth() + 1) :
						copyDate.getMonth() + 1,
				year	= copyDate.getFullYear();

		return `${day}.${month}.${year}`;
	},

	/**
	 * Get time string dd.mm.yyyy from date object
	 * Use it instead date.toLocaleTimeString
	 * Because we have problem with date.toLocaleTimeString for some time zone
	 * @param date
	 * @returns {*}
	 */
	getTimeStringFromDateObject: function(date) {
		return new Date(date).toTimeString().match(/[0-9]{1,2}:[0-9]{2}:[0-9]{2}/i)[0];
	},

	/**
	 *
	 * */
	getDateTimeString: function(dateTime){
		const 	date = this.getDateStringFromDateObject(dateTime),
				time = this.getTimeStringFromDateObject(dateTime);

		return `${date}, ${time}`;
	},

	/** convert date from UTC-string to 'dd.mm.yyyy' format */
	toLocal:function(str){
		return this.getDateStringFromDateObject(new Date(str));
	},

	// TODO rename it to getDateStringFromUTCDateString
	/** convert date from UTC-string to 'dd/mm/yyyy' format */
	getDate: function (str) {
		return this.toLocal(str).replace(/[.]/g, '/');
	},

	/** convert date from UTC-string to 'dd mmm yyyy' format */
	toLocalWithMonthName:function(utcStr){
		var self = this;
		if(utcStr){
			var	birthday = new Date(utcStr),
				date = self.zeroFill(birthday.getDate()),
				month = birthday.getMonth(),
				year = birthday.getFullYear();

			return [date, self.getMonthName(month), year].join(' ');
		}
	},

	/** convert local date format 'dd.mm.yyyy' to ISO-string */
	toIso: function(dotString) {
		const dateParts = dotString ? dotString.split('.'):[],
		//ISO format date for locales == 'en-GB', format == 'yyyy-mm-dd'
			isoStr = dateParts[2]+'-'+ dateParts[1]+'-'+ dateParts[0];

		return isoStr;
	},

	/** validation date ISO-format or 'yyyy-mm-dd' */
	isValid:function(value){
		let result = false;
		
		if(Date.parse(value)){
			const 	date = new Date(value),
					valueArray = value.split('-'),
					day = valueArray[2].split('T')[0]*1,
					month = valueArray[1]*1,
					year = valueArray[0];

			result = date.getUTCFullYear() == year && date.getUTCMonth() == (month - 1) && date.getUTCDate() == day;
		}

		return result;
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
	getDayOfWeekName: function(dayOfWeekIndex) {
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


