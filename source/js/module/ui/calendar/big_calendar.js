const	React			= require('react'),
		Morearty		= require('morearty'),
		DateTimeMixin	= require('module/mixins/datetime'),
		If				= require('module/ui/if/if');

const BigCalendar = React.createClass({
	mixins: [Morearty.Mixin, DateTimeMixin],
	componentWillMount: function() {
		const	binding		= this.getDefaultBinding(),
			currentDate	= binding.get('currentDate');

		if (!currentDate) {
			binding.set('currentDate', (new Date()).toISOString());
		}
	},
	setPrevMonth: function() {
		const	binding		= this.getDefaultBinding(),
				currentDate	= binding.get('currentDate'),
				date		= new Date(currentDate);

		binding.set('currentDate', (new Date(date.getFullYear(), date.getMonth() - 1, 1)).toISOString());
	},
	setNextMonth: function() {
		const	binding		= this.getDefaultBinding(),
				currentDate	= binding.get('currentDate'),
				date		= new Date(currentDate);

		binding.set('currentDate', (new Date(date.getFullYear(), date.getMonth() + 1, 1)).toISOString());
	},
	getWeeks: function() {
		const	data		= {},
				binding		= this.getDefaultBinding(),
				date		= new Date(binding.get('currentDate')),
				todayDate	= new Date(),
				showedMonth	= date.getMonth(),
				showedYear	= date.getFullYear(),
				monthDate	= new Date();

		let currentDay = 1;

		let firstMonthDay, daysInMonth, weeksInView;

		// Получение первого дня недели месяца
		monthDate.setFullYear(showedYear);
		monthDate.setMonth(showedMonth);
		monthDate.setDate(1);

		firstMonthDay = monthDate.getDay() - 1;
		firstMonthDay = firstMonthDay === -1 ? 6 : firstMonthDay;

		// Получение количества дней и недель в месяце
		daysInMonth = this.daysInMonth(date);
		weeksInView = Math.ceil((firstMonthDay + daysInMonth) / 7);

		// Добавление дней
		data.weeks = [];

		for (let i = 0; i < weeksInView; i++) {
			data.weeks[i] = [];

			for (let j = 0; j < 7; j++) {
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

		data.monthName = this.monthNames[showedMonth];
		data.yearName = showedYear;

		return data;
	},
	_getPlayerName: function(participan) {
		let name;

		if (!participan) return '?';

		name = participan.house && participan.house.name || participan.school && participan.school.name;

		// Внутреннее событие
		if (participan.name) {
			name = participan.name;
		}

		return name;
	},
	_getFixturesNode: function(fixturesArray) {
		return fixturesArray.map(function(fixture) {
			const startTime = this.getTimeFromIso(fixture.startTime);

			return (<a className="eBigCalendar_oneEvent" href={'/#event?id=' + fixture.id}>
						<div className="eBigCalendar_eventTime">{startTime} {fixture.sport.name}</div>
						{this._getPlayerName(fixture.participants[0])} vs {this._getPlayerName(fixture.participants[1])}
					</a>);
		});
	},
	getCalendarNode: function(weeksData) {
		const	binding			= this.getDefaultBinding(),
				date			= new Date(binding.get('currentDate')),
				month			= date.getMonth(),
				year			= date.getFullYear(),
				monthFixtures	= binding.toJS('fixtures.' + year + '.' + month);

		return  weeksData.map(function(oneWeek) {
			const weekDays = oneWeek.map(function(oneDay) {
				let dayFixtures,
					dayFixturesNodes;

				if (monthFixtures && oneDay.date && (dayFixtures = monthFixtures[oneDay.date])){
					dayFixturesNodes = this._getFixturesNode(dayFixtures);
				}

				return (
					<div className={'eBigCalendar_oneDay' + (oneDay.isToday ? ' mToday' : '')}>
						<div className="eBigCalendar_oneDayDate">{oneDay.date}</div>

						<If condition={oneDay.date !== undefined}>
							<div className="eBigCalendar_oneDayEvents">
								{dayFixturesNodes}
							</div>
						</If>

					</div>
				);
			});

			return (
				<div className="eBigCalendar_oneWeek">{weekDays}</div>
			);
		});
	},
	getDaysOfWeekNodes: function() {
		return this.daysOfWeekMedium.map(function(day) {
			return (<div className="eBigCalendar_oneDay">{day}</div>);
		});
	},
	render: function() {
		const	monthData		= this.getWeeks(),
				calendarNodes	= this.getCalendarNode(monthData.weeks),
				daysOfWeekNodes	= this.getDaysOfWeekNodes();

		return (
				<div className="bBigCalendar">
					<div className="eBigCalendar_head">
						<span className="bButton mGoLeft" onClick={this.setPrevMonth}>←</span>
						<span className="eBigCalendar_currentSelect">
							<span className="eBigCalendar_currentMonth">{monthData.monthName}</span>
							<span className="eBigCalendar_currentYear">{monthData.yearName}</span>
						</span>

						<span className="bButton mGoRight" onClick={this.setNextMonth}>→</span>
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
