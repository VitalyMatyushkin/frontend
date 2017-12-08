const	React		= require('react'),
		Morearty	= require('morearty');

const {MonthCalendar} = require('module/ui/calendar/month_calendar');

const CalendarActions = require('module/as_manager/pages/school_unions_pages/school_union_events/calendar/actions');

const Calendar = React.createClass({
	mixins:[Morearty.Mixin ],
	propTypes: {
		activeSchoolId: React.PropTypes.string.isRequired
	},
	componentWillMount: function () {
		CalendarActions.setCurrentMonth(
			new Date(),
			this.props.activeSchoolId,
			this.getDefaultBinding()
		);
	},
	onMonthClick: function (data) {
		CalendarActions.setCurrentMonth(
			data,
			this.props.activeSchoolId,
			this.getDefaultBinding()
		);
	},
	onSelectDate:function(date){
		CalendarActions.setSelectedDate(
			date,
			this.props.activeSchoolId,
			this.getDefaultBinding()
		);
	},
	render: function(){
		const	binding 		= this.getDefaultBinding(),
				todayDate		= binding.get('todayDate'),
				monthDate		= binding.get('monthDate'),
				selectedDate	= binding.get('selectedDate'),
				eventsData		= binding.get('eventsData');

		return (
			<MonthCalendar
				monthDate		= { monthDate }
				todayDate		= { todayDate }
				selectedDate	= { selectedDate }
				onMonthClick	= { this.onMonthClick  }
				onDateClick		= { this.onSelectDate }
				eventsData		= { eventsData }
			/>
		);
	}
});

module.exports = Calendar;