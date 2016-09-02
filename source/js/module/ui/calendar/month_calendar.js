/**
 * Created by wert on 31.08.16.
 */

const 	React 			= require('react'),
		Immutable		= require('immutable'),
		MonthNavBar		= require('./month_nav_bar'),
		DaysOfWeekBar	= require('./days_of_week_bar'),
		MonthDaysPanel	= require('./month_days_panel');

function MonthCalendar(props) {
	const 	monthDate	= props.monthDate,
			monthName 	= MonthCalendar.monthNames[monthDate.getMonth()];

	return <div className="eCalendar_eMonth">
		<MonthNavBar
			monthName={monthName}
			yearName={monthDate.getFullYear()}
			onNextClick={props.onNextMonthClick}
			onPrevClick={props.onPrevMonthClick}
		/>
		<DaysOfWeekBar/>
		<MonthDaysPanel
			monthDate={monthDate}
			todayDate={props.todayDate}
			eventsData={props.eventsData}
			selectedDate={props.selectedDate}
			onClick={props.onDateClick}
		/>
	</div>;
}



MonthCalendar.propTypes = {
	monthDate:			React.PropTypes.instanceOf(Date).isRequired,
	todayDate:			React.PropTypes.instanceOf(Date),
	selectedDate:		React.PropTypes.instanceOf(Date),
	onNextMonthClick:	React.PropTypes.func,
	onPrevMonthClick:	React.PropTypes.func,
	onDateClick:		React.PropTypes.func,
	eventsData:			React.PropTypes.instanceOf(Immutable.Map)
};

MonthCalendar.monthNames = [
	"January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
];


module.exports = MonthCalendar;