var CalendarMonthView;

CalendarMonthView = React.createClass({
	mixins: [Morearty.Mixin],
	range: function (end) {
		var arr = [],
			start = 0;

		for (var i = start; i < end; i++) {
			arr.push(i);
		}
		return arr;
	},
	daysInMonth: function (month, year) {
		return new Date(year, month + 1, 0).getDate();
	},
	getDayOfWeek: function (day, month, year) {
		return new Date(year, month, day).getDay();
	},
	equalDates: function (first, second) {
		return first.getTime() == second.getTime();
	},
	onMouseEnterDay: function (day) {
		this.getDefaultBinding().set('hoverDay', day);
	},
	onMouseLeaveDay: function () {
		this.getDefaultBinding().set('hoverDay', null);
	},
	getDays: function () {
		var self = this,
			binding = this.getDefaultBinding(),
			date = binding.get('date'),
			month = date.getMonth(),
			year = date.getFullYear(),
			daysInMonth = self.daysInMonth(month, year),
			daysInPrevMonth = self.daysInMonth(month - 1, year),
			firstMonthDayOfWeek = self.getDayOfWeek(1, month, year),
			lastMonthDayOfWeek = self.getDayOfWeek(daysInMonth, month, year),
			days = [];

		// добиваем дни от начала
		if (firstMonthDayOfWeek > 0) {
			for (var i = 0; i <= firstMonthDayOfWeek; i += 1) {
				days.unshift({
					day: daysInPrevMonth - i,
                    date: new Date(month === 0 ? year - 1 : year, month === 0 ? 11 : month -1, daysInPrevMonth - i)
				});
			}
		}

		// вливаем дни
		for (var j = 1; j <= daysInMonth; j += 1) {
			days.push({
				day: j,
                date: new Date(year, month, j)
			});
		}

		// вливаем дни в конец
		if (days.length % 7 > 0) {
			for (var t = 0, len = (7 - (days.length % 7)); t < len; t += 1) {
				days.push({
					day: t + 1,
                    date: new Date(year, month + 1, t + 1)
				});
			}
		}


		return days
	},
	renderRow: function (row, days) {
		var self = this,
            binding = this.getDefaultBinding(),
            date = binding.get('date'),
            month = date.getMonth(),
            year = date.getFullYear(),
			hoverDay = binding.get('hoverDay'),
			cx = React.addons.classSet,
			now = new Date(),
			today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

		return <div className="eMonth_row">{days.map(function (day, i) {
            var classes = cx({
				eMonth_day: true,
				mToday: self.equalDates(day.date, today),
				mPrev: day.date.getTime() < new Date(year, month, 1).getTime(),
				mFirst: i === 0,
				mHover: hoverDay && self.equalDates(day.date, hoverDay.date)
			});

			return <span className={classes} onMouseLeave={self.onMouseLeaveDay} onMouseEnter={self.onMouseEnterDay.bind(null, day)}>{day.day}</span>;
		})}</div>;
	},
	renderDaysOfWeek: function () {
		var daysOfWeek = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

		return <div className="eMonth_row mWeeks">{daysOfWeek.map(function (name) {
			return <span className="eMonth_day mWeekName">{name}</span>;
		})}</div>;
	},
	render: function() {
		var self = this,
			days = self.getDays(),
			countRows = days.length / 7;

		return <div className="eCalendar_eMonth">
			{self.renderDaysOfWeek()}
			{self.range(countRows).map(function(row) {
				return self.renderRow(row, days.slice(row * 7, row * 7 + 7));
			})}
		</div>;
	}
});


module.exports = CalendarMonthView;
