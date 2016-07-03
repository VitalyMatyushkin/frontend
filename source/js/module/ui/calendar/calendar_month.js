const	classNames	= require('classnames'),
		React		= require('react'),
		Immutable	= require('immutable'),
		SVG			 = require('module/ui/svg');

const CalendarMonthView = React.createClass({
	mixins: [Morearty.Mixin],
	propType: {
		onSelect: React.PropTypes.func
	},
	componentWillMount: function() {
		const	self	= this;

		self._addListeners();
	},
	_addListeners: function() {
		const	self	= this;

		self._addEventsListener();
	},
	_addEventsListener: function() {
		const	self	= this;

		self.getMoreartyContext().getBinding().sub('events').addListener(() => {
			self.isMounted() && self.forceUpdate();
		});
	},
	_range: function (end) {
		let	arr		= [],
			start	= 0;

		for (let i = start; i < end; i++) {
			arr.push(i);
		}
		
		return arr;
	},
	_daysInMonth: function (month, year) {
		return new Date(year, month + 1, 0).getDate();
	},
	_getDayOfWeek: function (day, month, year) {
		return new Date(year, month, day).getDay();
	},
	_equalDates: function (first, second) {
		return first.getTime() == second.getTime();
	},
	_countEventInDay: function (date) {
		const	self	= this,
				binding	= self.getMoreartyContext().getBinding().sub('events');
		let		filteredModels;
		
		if(binding.get('models') !== undefined){
			filteredModels = binding.get('models').filter(function (model) {
				let parsedDate = new Date(model.get('startTime')),
					startDate = new Date(parsedDate.getFullYear(), parsedDate.getMonth(), parsedDate.getDate());
				return startDate.getTime() === date.getTime();
			});
		}
		
		return filteredModels;
	},
	_getDays: function () {
		const	self				= this,
				binding				= self.getDefaultBinding(),
				date				= binding.get('currentDate'),
				month				= date.getMonth(),
				year				= date.getFullYear(),
				daysInMonth			= self._daysInMonth(month, year),
				daysInPrevMonth		= self._daysInMonth(month - 1, year),
				firstMonthDayOfWeek	= self._getDayOfWeek(1, month, year),
				days				= [];

		// добиваем дни от начала
		if (firstMonthDayOfWeek > 0) {
			for (let i = 1; i <= (firstMonthDayOfWeek-1); i += 1) {
				days.unshift({
					day:(i > 1 ? (daysInPrevMonth - 1):daysInPrevMonth),
					date: new Date(month === 0 ? year - 1 : year, month === 0 ? 11 : month -1, daysInPrevMonth - i),
					prev: true
				});
			}
			// вливаем дни
			for (let j = 1; j <= daysInMonth; j += 1) {
				days.push({
					day: j,
					date: new Date(year, month, j),
					events: self._countEventInDay(new Date(year, month, j))
				});
			}
		} else {
			// вливаем дни
			for (let j = 2; j <= daysInMonth; j += 1) {
				days.push({
					day: j,
					date: new Date(year, month, j),
					events: self._countEventInDay(new Date(year, month, j))
				});
			}
		}

		// вливаем дни в конец
		if (days.length % 7 > 0) {
			for (let t = 0, len = (7 - (days.length % 7)); t < len; t += 1) {
				days.push({
					day: t + 1,
					date: new Date(year, month + 1, t + 1),
					next: true
				});
			}
		}

		return days;
	},
	_onClickPrevButton: function () {
		const	self		= this,
				binding		= self.getDefaultBinding(),
				date		= binding.get('currentDate'),
				year		= date.getFullYear(),
				month		= date.getMonth(),
				prevYear	= month === 0 ? year -1 : year,
				prevMonth	= month === 0 ? 11 : month - 1;

		binding.atomically()
			.set('currentDate', new Date(prevYear, prevMonth, (binding.get('currentDayDate')!==0 ? binding.get('currentDayDate'):1)))
			.set('currentMonth', Immutable.fromJS(prevMonth))
			.commit();
	},
	_onSelectDay: function (day) {
		const	self		= this,
				binding		= self.getDefaultBinding(),
				currentDate	= binding.get('currentDate'),
				year		= currentDate.getFullYear(),
				month		= currentDate.getMonth();

		if (year === day.date.getFullYear() && month === day.date.getMonth()) {
			binding.set('selectDay', day);

			if (self.props.onSelect) {
				self.props.onSelect(day.date);
			}
		}
	},
	_onClickNextButton: function () {
		const	self			= this,
				binding			= self.getDefaultBinding(),
				date			= binding.get('currentDate'),
				year			= date.getFullYear(),
				month			= date.getMonth(),
				nextYear		= month === 11 ? year + 1 : year,
				nextMonth		= month === 11 ? 0 : month + 1,
				currentDayDate	= date.getDate();
		
		binding.atomically()
			.set('currentDate', new Date(nextYear, nextMonth, 1))
			.set('currentDayDate', currentDayDate)
			.set('currentMonth', Immutable.fromJS(nextMonth))
			.commit()
	},
	_renderRow: function (row, days) {
		const	self			= this,
				binding			= self.getDefaultBinding(),
				hoverDay		= binding.get('hoverDay'),
				selectDay		= binding.get('selectDay'),
				now				= new Date(),
				today			= new Date(now.getFullYear(), now.getMonth(), now.getDate()),
				renderedDays	= days.map((day, i) => {
					const	isActive	= day.events && day.events.count() > 0,
							isSelect	= selectDay && self._equalDates(day.date, selectDay.date),
							isToday		= self._equalDates(day.date, today),
							classes	= classNames({
								eMonth_day:	true,
								mToday:		isToday,
								mPrev:		day.prev || false,
								mNext:		day.next || false,
								mFirst:		i === 0,
								mActive:	isSelect ? false : isActive,
								mSelect:	isSelect
							});

					return (
						<span
							className={classes}
							key={i}
							onClick={self._onSelectDay.bind(null, day)}
						>
							{day.day}
						</span>
					);
				});

		return <div key={now.getMilliseconds()+row} className="eMonth_row">{renderedDays}</div>;
	},
	_renderDaysOfWeek: function () {
		const	daysOfWeek	= ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

		return (
			<div className="eMonth_row mWeeks">{
				daysOfWeek.map((name, n) => {
					return <span key={n} className="eMonth_day mWeekName">{name}</span>;
				})
			}
			</div>);
	},
	_renderNavBar: function () {
		const	self				= this,
				binding				= this.getDefaultBinding(),
				currentMonthName	= binding.get('monthNames.' + binding.get('currentDate').getMonth());

			return (
				<div className="eCalendar_navBar">
					<span className="eCalendar_item" onClick={self._onClickPrevButton}><SVG icon="icon_chevron_left"/></span>
					<span className="eCalendar_item mNameMonth">{currentMonthName} - {binding.get('currentDate').getFullYear()}</span>
					<span className="eCalendar_item" onClick={self._onClickNextButton}><SVG icon="icon_chevron_right"/></span>
				</div>
			);
	},
	render: function() {
		const	self		= this,
				days		= self._getDays(),
				countRows	= days.length / 7;

		return <div className="eCalendar_eMonth">
			{self._renderNavBar()}
			{self._renderDaysOfWeek()}
			{self._range(countRows).map(function(row) {
				return self._renderRow(row, days.slice(row * 7, row * 7 + 7));
			})}
		</div>;
	}
});

module.exports = CalendarMonthView;