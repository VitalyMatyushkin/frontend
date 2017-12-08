/**
 * Created by Anatoly on 07.10.2016.
 */

const 	React			= require('react'),
		{MonthCalendar}	= require('../../../../ui/calendar/month_calendar'),
		CalendarActions	= require('./calendar-actions'),
		Morearty        = require('morearty');

/** Show calendar section: month calendar and events for selected date */
const Calendar = React.createClass({
	mixins:[Morearty.Mixin ],
	propType: {
		onSelect: React.PropTypes.func
	},
	componentWillMount: function () {
		const	binding			= this.getDefaultBinding(),
				activeSchoolId	= this.getMoreartyContext().getBinding().get('userRules.activeSchoolId');
		/** Loading initial data for this month */
		CalendarActions.setCurrentMonth(new Date(), activeSchoolId, binding);
	},

	onSelect:function(date){
		const 	binding 		= this.getDefaultBinding(),
				activeSchoolId	= this.getMoreartyContext().getBinding().get('userRules.activeSchoolId');

		CalendarActions.setSelectedDate(date, activeSchoolId, binding);

		if(typeof this.props.onSelect === 'function')
			this.props.onSelect(date);
	},
	render: function(){
		const 	binding 		= this.getDefaultBinding(),
				activeSchoolId	= this.getMoreartyContext().getBinding().get('userRules.activeSchoolId'),
				todayDate		= binding.get('todayDate'),
				monthDate		= binding.get('monthDate'),
				selectedDate	= binding.get('selectedDate'),
				eventsData		= binding.get('eventsData');

		return (
			<MonthCalendar	monthDate		= {monthDate}
							todayDate		= {todayDate}
							selectedDate	= {selectedDate}
							onMonthClick	= {(data) => CalendarActions.setCurrentMonth(data, activeSchoolId, binding)}
							onDateClick		= {this.onSelect }
							eventsData		= {eventsData}
			/>
		);
	}
});

module.exports = Calendar;