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

const MonthCalendar = React.createClass({
	propType: {
		isSync:				React.PropTypes.bool.isRequired,
		monthDate:			React.PropTypes.instanceOf(Date).isRequired,	// Date with month to display
		todayDate:			React.PropTypes.instanceOf(Date),				// Date to be considered as today
		selectedDate:		React.PropTypes.instanceOf(Date),				// Date to be considered as selected (highlighted)
		onNextMonthClick:	React.PropTypes.func,							// Function to be called when user hit `next` in MonthNavBar
		onPrevMonthClick:	React.PropTypes.func,							// Function to be called when user hit `prev` in MonthNavBar
		onDateClick:		React.PropTypes.func,							// Function to be called when user hit any date panel. Function will receive one argument - date
		eventsData:			React.PropTypes.instanceOf(Immutable.Map)		// Immutable map where keys are stringified dates (2016-1-9) and values are booleans, where true mean that date have events
	},
	onMonthClick: function(date) {
		this.props.isSync && this.props.onMonthClick(date);
	},
	onClick: function(date) {
		this.props.isSync && this.props.onClick(date);
	},
	render: function() {
		const monthDate = this.props.monthDate;

		return (
			<div className="eCalendar_eMonth">
				<MonthNavBar
					isSync			= {this.props.isSync}
					date			= {monthDate}
					onMonthClick	= {this.onMonthClick}
				/>
				<DaysOfWeekBar/>
				<MonthDaysPanel
					isSync			= {this.props.isSync}
					monthDate		= {monthDate}
					todayDate		= {this.props.todayDate}
					eventsData		= {this.props.eventsData}
					selectedDate	= {this.props.selectedDate}
					onClick			= {this.props.onDateClick}
				/>
			</div>
		);
	}
});

module.exports = MonthCalendar;