/**
 * Created by wert on 29.08.16.
 */

import * as React		from 'react';
import * as classNames	from 'classnames';

/** Panel with one day in calendar. */

interface DayPanelProps {
	isActive?:		boolean
	isSelected?:	boolean
	isToday?:		boolean
	isNextMonth?:	boolean
	isPrevMonth?:	boolean
	onClick?:		() => void
	dayName:		number | string
}

export class DayPanel extends React.Component<DayPanelProps> {
	render() {
		const classes	= classNames({
			eMonth_day:	true,
			mToday:		this.props.isToday === true,
			mActive:	this.props.isSelected ? false : this.props.isActive,	// nobody care about day activity if day is selected
			mSelect:	this.props.isSelected === true,
			mNext:		this.props.isNextMonth === true,
			mPrev:		this.props.isPrevMonth === true
		});
		
		return <span className={classes} onClick={() => this.props.onClick()}>{this.props.dayName}</span>;
	}
}