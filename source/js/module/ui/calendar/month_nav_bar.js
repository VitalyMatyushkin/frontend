/**
 * Created by wert on 28.08.16.
 */

const 	React	= require('react'),
		{SVG}	= require('module/ui/svg');

/**
 * This is bar with current month and year and two switcher: one to previous month, one to next month.
 * It looks like:
 *  < August - 2016 >
 */
function MonthNavBar(props) {
	return (
		<div className="eCalendar_navBar">
			<span className="eCalendar_item" onClick={props.onPrevClick}><SVG icon="icon_chevron_left"/></span>
			<span className="eCalendar_item mNameMonth">{props.monthName} - {props.yearName}</span>
			<span className="eCalendar_item" onClick={props.onNextClick}><SVG icon="icon_chevron_right"/></span>
		</div>
	);
}

MonthNavBar.propTypes = {
	onPrevClick:	React.PropTypes.func,					// to call on previous button click
	onNextClick:	React.PropTypes.func,					// to call on next button click
	monthName:		React.PropTypes.string.isRequired,		// name of current month
	yearName:		React.PropTypes.oneOfType([				// name of current year
		React.PropTypes.string,
		React.PropTypes.number
	]).isRequired
};

module.exports = MonthNavBar;