var BigCalendar,
	DateTimeMixin = require('module/mixins/datetime'),
	If = require('module/ui/if/if');

BigCalendar = React.createClass({
	mixins: [Morearty.Mixin, DateTimeMixin],
	componentWillMount: function() {
		var self = this,
			binding = self.getDefaultBinding(),
			metaBinding = binding.meta(),
			currentDate = metaBinding.get('currentDate');

		if (!currentDate) {
			metaBinding.set('currentDate', (new Date()).toISOString());
		}

	},
	setPrevMonth: function() {
		var self = this,
			binding = self.getDefaultBinding(),
			metaBinding = binding.meta(),
			currentDate = metaBinding.get('currentDate'),
			date = new Date(currentDate);

		metaBinding.set('currentDate', (new Date(date.getFullYear(), date.getMonth() - 1, 1)).toISOString());
	},
	setNextMonth: function() {
		var self = this,
			binding = self.getDefaultBinding(),
			metaBinding = binding.meta(),
			currentDate = metaBinding.get('currentDate'),
			date = new Date(currentDate);

		metaBinding.set('currentDate', (new Date(date.getFullYear(), date.getMonth() + 1, 1)).toISOString());
	},
	getWeeks: function() {
		var self = this,
			data = {},
			currentDay = 1,
			binding = self.getDefaultBinding(),
			metaBinding = binding.meta(),
			date = new Date(metaBinding.get('currentDate')),
			todayDate = new Date(),
			showedMonth = date.getMonth(),
			showedYear = date.getFullYear(),
			monthDate = new Date(),
			firstMonthDay,
			daysInMonth,
			weeksInView;

		// Получение первого дня недели месяца
		monthDate.setFullYear(showedYear);
		monthDate.setMonth(showedMonth);
		monthDate.setDate(1);

		firstMonthDay = monthDate.getDay() - 1;
		firstMonthDay = firstMonthDay === -1 ? 6 : firstMonthDay;

		// Получение количества дней и недель в месяце
		daysInMonth = self.daysInMonth(date);
		weeksInView = Math.ceil((firstMonthDay + daysInMonth) / 7);

		// Добавление дней
		data.weeks = [];

		for (var i = 0; i < weeksInView; i++) {
			data.weeks[i] = [];

			for (var j = 0; j < 7; j++) {
				if (currentDay === 1 && j !== firstMonthDay || currentDay > daysInMonth) {
					data.weeks[i].push({});
				} else {
					data.weeks[i].push({
						isToday: (todayDate.getMonth() === showedMonth && todayDate.getFullYear() === showedYear && todayDate.getDate() === currentDay),
						date: currentDay,
						month: showedMonth,
						year: showedYear
					});
					currentDay++;
				}

			}
		}

		data.monthName = self.monthNames[showedMonth];
		data.yearName = showedYear;

		return data;
	},
	getCalendarNode: function(weeksData) {
		var self = this,
			binding = self.getDefaultBinding();

		return  weeksData.map(function(oneWeek) {
			var weekDays = oneWeek.map(function(oneDay) {
				return (
					<div className={'eBigCalendar_oneDay' + (oneDay.isToday ? ' mToday' : '')}>
						<div className="eBigCalendar_oneDayDate">{oneDay.date}</div>

						<If condition={oneDay.date !== undefined}>
							<div className="eBigCalendar_oneDayEvents">
								<div className="eBigCalendar_oneEvent">
									<div className="eBigCalendar_eventTime">13:00 Football</div>
									Great Walstead School vs Shoreham College
								</div>

								<div className="eBigCalendar_oneEvent">
									<div className="eBigCalendar_eventTime">17:00 Football</div>
									BOYS B17C vs BOYS B15C
								</div>
							</div>
						</If>

					</div>
				);
			});



			return <div className="eBigCalendar_oneWeek">{weekDays}</div>
		});
	},
	getDaysOfWeekNodes: function() {
		var self = this;

		return self.daysOfWeekMedium.map(function(day) {
			return (<div className="eBigCalendar_oneDay">{day}</div>);
		});
	},
	render: function() {
		var self = this,
			binding = self.getDefaultBinding(),
			monthData = self.getWeeks(),
			calendarNodes = self.getCalendarNode(monthData.weeks),
			daysOfWeekNodes = self.getDaysOfWeekNodes();

		return (
				<div className="bBigCalendar">
					<div className="eBigCalendar_head">
						<span className="bButton mGoLeft" onClick={self.setPrevMonth}>←</span>
						<span className="eBigCalendar_currentSelect">
							<span className="eBigCalendar_currentMonth">{monthData.monthName}</span>
							<span className="eBigCalendar_currentYear">{monthData.yearName}</span>
						</span>

						<span className="bButton mGoRight" onClick={self.setNextMonth}>→</span>
					</div>

					<div className="eBigCalendar_oneWeek mDayNames">
						{daysOfWeekNodes}
					</div>

					<div className="eBigCalendar_dates">
						{calendarNodes}
					</div>
				</div>
		)
	}
});


module.exports = BigCalendar;
