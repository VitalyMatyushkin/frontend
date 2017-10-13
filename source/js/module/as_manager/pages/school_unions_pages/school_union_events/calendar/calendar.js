const	React		= require('react'),
		Morearty	= require('morearty');

const	MonthCalendar	= require('module/ui/calendar/month_calendar');

const Calendar = React.createClass({
	mixins:[Morearty.Mixin ],
	render: function(){
		const date = new Date();

		return (
			<MonthCalendar	monthDate		= { date }
							todayDate		= { date }
							selectedDate	= { date }
							onMonthClick	= { () => {} }
							onDateClick		= { () => {} }
							eventsData		= { undefined }
			/>
		);
	}
});

module.exports = Calendar;