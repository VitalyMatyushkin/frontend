var DateTimeMixin = {
	daysOfWeek: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
	monthNames: ["January", "February", "March", "April", "May", "June",
		"July", "August", "September", "October", "November", "December"],
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
};

module.exports = DateTimeMixin;