/**
 * Created by wert on 31.08.16.
 */

const 	React 			= require('react'),
		Immutable		= require('immutable'),
		MonthNavBar		= require('./month_year_selector'),
		DaysOfWeekBar	= require('./days_of_week_bar'),
		MonthDaysPanel	= require('./month_days_panel');

/**
 * Calendar component. Here is schema:
 *
 * |------------------------------------------------------------------|
 * |                 < September - 2016 >                             |			<- MonthNavBar
 * |------------------------------------------------------------------|
 * | Mon      Tue       Wed       Thu        Fri        Sat       Sun |  		<- DaysOfWeekBar
 * | -----   -----     -----     -----                                |    ---|
 * || 31  | |  1  |   |  2  |   |  3  |                               |       |
 * | -----   -----     -----     -----                                |       | <- MonthDaysPanel
 *         .......................................................            |
 * |__________________________________________________________________|    ___|
 * @param props
 * @returns {XML}
 * @constructor
 */
function MonthCalendar(props) {
	const monthDate = props.monthDate;

	return (
		<div className="eCalendar_eMonth">
			<MonthNavBar
				date			= {monthDate}
				onMonthClick	= {props.onMonthClick}
			/>
			<DaysOfWeekBar/>
			<MonthDaysPanel
				monthDate		= {monthDate}
				todayDate		= {props.todayDate}
				eventsData		= {props.eventsData}
				selectedDate	= {props.selectedDate}
				onClick			= {props.onDateClick}
			/>
		</div>
	);
}

MonthCalendar.propTypes = {
	monthDate:			React.PropTypes.instanceOf(Date).isRequired,	// Date with month to display
	todayDate:			React.PropTypes.instanceOf(Date),				// Date to be considered as today
	selectedDate:		React.PropTypes.instanceOf(Date),				// Date to be considered as selected (highlighted)
	onNextMonthClick:	React.PropTypes.func,							// Function to be called when user hit `next` in MonthNavBar
	onPrevMonthClick:	React.PropTypes.func,							// Function to be called when user hit `prev` in MonthNavBar
	onDateClick:		React.PropTypes.func,							// Function to be called when user hit any date panel. Function will receive one argument - date
	eventsData:			React.PropTypes.instanceOf(Immutable.Map)		// Immutable map where keys are stringified dates (2016-1-9) and values are booleans, where true mean that date have events
};

MonthCalendar.monthNames = [
	"January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
];


module.exports = MonthCalendar;