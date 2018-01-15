/**
 * Created by wert on 31.08.16.
 */

import * as React		from 'react';
import {MonthYearSelector}	from './month_year_selector';
import {DaysOfWeekBar}		from './days_of_week_bar';
import {MonthDaysPanel}		from './month_days_panel';

/**
 * Calendar component. Here is schema:
 *
 * |------------------------------------------------------------------|
 * |                 < September - 2016 >                             |			<- MonthYearSelector
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

interface MonthCalendarProps {
	isSync?:			boolean
	onMonthClick?:		(object: any) => void
	onClick?:			(object: any) => void
	monthDate:			any			// Date with month to display
	todayDate?:			any			// Date to be considered as today
	selectedDate?:		any			// Date to be considered as selected (highlighted)
	onNextMonthClick?:	() => void	// Function to be called when user hit `next` in MonthYearSelector
	onPrevMonthClick?:	() => void	// Function to be called when user hit `prev` in MonthYearSelector
	onDateClick?:		() => void	// Function to be called when user hit any date panel. Function will receive one argument - date
	eventsData?:		any			// Immutable map where keys are stringified dates (2016-1-9) and values are booleans, where true mean that date have events
	customStyle?:		string
}

export class MonthCalendar extends React.Component<MonthCalendarProps> {
	static defaultProps: Partial<MonthCalendarProps> = {isSync: true};
	
	onMonthClick(date: any): void {
		this.props.isSync && this.props.onMonthClick(date);
	}
	
	onClick(date: any): void {
		this.props.isSync && this.props.onClick(date);
	}

	getCustomStyle() {
		return typeof this.props.customStyle !== 'undefined' ? this.props.customStyle : '';
	}
	
	render() {
		const monthDate = this.props.monthDate;
		
		return (
			<div className={`eCalendar_eMonth ${this.getCustomStyle()}`}>
				<MonthYearSelector
					isSync			= {this.props.isSync}
					date			= {monthDate}
					onMonthClick	= {this.onMonthClick.bind(this)}
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
}
