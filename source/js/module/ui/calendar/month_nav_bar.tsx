/**
 * Created by wert on 28.08.16.
 */

import * as React 	from 'react';
import {SVG}		from 'module/ui/svg';

/**
 * This is bar with current month and year and two switcher: one to previous month, one to next month.
 * It looks like:
 *  < August - 2016 >
 */

interface MonthNavBarProps {
	onPrevClick?:	() => void					// to call on previous button click
	onNextClick?:	() => void					// to call on next button click
	monthName:		string						// name of current month
	yearName:		string | number				// name of current year
}

export class MonthNavBar extends React.Component<MonthNavBarProps> {
	render() {
		return (
			<div className="eCalendar_navBar">
				<span className="eCalendar_item" onClick={this.props.onPrevClick}><SVG icon="icon_chevron_left"/></span>
				<span className="eCalendar_item mNameMonth">{this.props.monthName} - {this.props.yearName}</span>
				<span className="eCalendar_item" onClick={this.props.onNextClick}><SVG icon="icon_chevron_right"/></span>
			</div>
		);
	}
}