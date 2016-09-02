const	classNames		= require('classnames'),
		React			= require('react'),
		Immutable		= require('immutable'),
		Morearty    	= require('morearty'),
		DaysOfWeekBar	= require('./days_of_week_bar'),
		MonthNavBar		= require('./month_nav_bar'),
		DayPanel		= require('./day_panel'),
		Calendar		= require('./month_calendar'),	// this is good pure React calendar. It wrapped by this shitty calendar to be morearty-friendly.
		SVG				= require('module/ui/svg');

/* TODO: delete after refactoring. Use './month_calendar instead' */

const CalendarMonthView = React.createClass({
	mixins: [Morearty.Mixin],
	propType: {
		onSelect: React.PropTypes.func
	},
	componentWillMount: function() {
		this.getMoreartyContext().getBinding().sub('events').addListener(() => {
			this.isMounted() && this.forceUpdate();
		});
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

	render: function() {
		const 	binding 		= this.getDefaultBinding(),
				monthDate		= binding.get('currentDate'),	// actually this is not current date. It is date to show month in calendar
				today			= new Date(),
				selectedDay	= binding.get('selectDay');	// ????

		/* all this shit up to return required for handling data layout from binding:
		 * it operates with very strange structures: day with dates and events and this is a bit sick.
		 * I believe this shit should be removed, but first all related components should been updated
		 */
		const eventsBinding	= this.getMoreartyContext().getBinding().sub('events');
		const eventModels = eventsBinding.get('models');

		let eventsData = {};
		let eventsDataByDate = {};

		if(eventModels) {
			const thisMonthEvents = eventModels.filter( event => {
				const 	eventStartTime 	= new Date(event.get('startTime'));
				eventStartTime.setHours(0, 0, 0, 0);
				return eventStartTime.getFullYear() === monthDate.getFullYear() && eventStartTime.getMonth() === monthDate.getMonth();	// it is part of this month
			});

			thisMonthEvents.forEach( event => {
				const 	startTime 	= new Date(event.get('startTime')),
						strDate		= `${startTime.getFullYear()}-${startTime.getMonth()}-${startTime.getDate()}`;

				eventsData[strDate] = true;
				const store = eventsDataByDate[strDate] || [];
				store.push(event);
				eventsDataByDate[strDate] = store;
			});

		}

		const immutableEventsDataByDate = Immutable.fromJS(eventsDataByDate);

		/* having this handler here. One can consider that this is not good place for it, but I mean all code above is
		 * bad.
		 */
		const onSelectDate = date => {
			const 	year 	= monthDate.getFullYear(),
					month	= monthDate.getMonth();
			if(year === date.getFullYear() && month === date.getMonth()) {
				const strDate = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
				const data = immutableEventsDataByDate.get(strDate);

				const day = {
					day: 	date.getDate(),
					date: 	date,
					events: data
				};

				binding.set('selectDay', day);

				if(typeof this.props.onSelect === 'function')
					this.props.onSelect(day.date);
			}
		};
		
		return <Calendar
			monthDate={monthDate}
			todayDate={today}
			selectedDate={selectedDay ? selectedDay.date : undefined}
			onNextMonthClick={this._onClickNextButton}
			onPrevMonthClick={this._onClickPrevButton}
			onDateClick={onSelectDate}
			eventsData={Immutable.fromJS(eventsData)}
		/>;
	}
});

module.exports = CalendarMonthView;