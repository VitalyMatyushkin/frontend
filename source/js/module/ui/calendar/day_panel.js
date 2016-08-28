/**
 * Created by wert on 29.08.16.
 */

const 	React		= require('react'),
		classNames 	= require('classnames');

/** Panel with one day in calendar. */
function DayPanel(props) {

	const classes	= classNames({
		eMonth_day:	true,
		mToday:		props.isToday,
		mActive:	props.isSelected ? false : props.isActive,	// nobody care about day activity if day is selected
		mSelect:	props.isSelected
	});

	return <span className={classes} onClick={props.onClick}>{props.dayName}</span>;

}

DayPanel.propTypes = {
	isActive:		React.PropTypes.bool.isRequired,
	isSelected:		React.PropTypes.bool.isRequired,
	isToday:		React.PropTypes.bool.isRequired,
	onClick:		React.PropTypes.func,
	dayName:		React.PropTypes.oneOfType([
		React.PropTypes.number,
		React.PropTypes.string
	]).isRequired
};

module.exports = DayPanel;