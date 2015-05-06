var DateTimeMixin = {
	daysOfWeek: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
	daysOfWeekMedium: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
	monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
	getMonthName: function(month) {
		return this.monthNames[month];
	},
	getDayOfWeekName: function(dayOfWeek) {
		return this.daysOfWeek[dayOfWeek];
	},
	zeroFill: function(i) {
		return (i < 10 ? '0' : '') + i;
	},
	getDateFromIso: function(value) {
		var self = this,
			converDate = new Date(value),
			date = self.zeroFill(converDate.getDate()),
			month = converDate.getMonth(),
			year = converDate.getFullYear();

		return [date, self.getMonthName(month), year].join(' ');
	},
	getTimeFromIso: function(value) {
		var self = this,
			converDate = new Date(value);

		return self.zeroFill(converDate.getHours()) + ':' + self.zeroFill(converDate.getMinutes());
	},
	daysInMonth: function(date) {
		return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
	}
};

module.exports = DateTimeMixin;