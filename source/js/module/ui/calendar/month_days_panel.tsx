/**
 * Created by wert on 30.08.16.
 */

import * as React 			from 'react';
import * as PureRenderMixin from 'react-addons-pure-render-mixin';
import * as Loader 			from 'module/ui/loader';
import {DayPanel} 			from './day_panel';

/**
 * Component to draw grid with all days in month and some additional days.
 * It takes a lot of parameters:
 *  * year - current year to show
 *  * month - current month to show
 *  * todayDate - date which should be considered as today
 *  * onClick - global click handler. Fired with date clicked (both active month and not-active)
 *  * eventsData - Immutable Map where keys are date in following format: 2016-8-29. Month starts from 0. Both month and day number don't have leading zero: 2016-1-1. Value is boolean
 */
export const MonthDaysPanel = (React as any).createClass({
	mixins: [PureRenderMixin],	// yes, it is pure. I hope :)
	getDefaultProps: function(){
		return {
			isSync: true
		};
	},
	/** How much days in given month of given year */
	daysInMonth: function(year, month) {
		return new Date(year, month + 1, 0).getDate();
	},
	/**
	 * For given year and month return array of all dates visible in calendar.
	 * It will add some days in begining from previous month and some days to end.
	 * It is not too very complex, but it contain few steps.
	 * @param {Number} year
	 * @param {Number} month
	 * @returns {Array<Date>}
	 */
	visibleDays: function (year, month) {
		const firstMonthDayDate 	= new Date(year, month, 1);
		const datesToDraw = [];	// as calendar have 7 days and 5 or 6 rows. 6 rows we have when month starts on Sat or Sun
		
		const firstMonthDay = firstMonthDayDate.getDay();								// 0 for Sunday, 1 for Monday...
		if(firstMonthDay !== 1) {															// if first month day is not Monday(1) - adding some days from previous month
			const 	daysToAdd			= firstMonthDay === 0 ? 6 : firstMonthDay - 1,	// how much days from previous month to add. 0 is Sunday, so this is why we checking it explicitly
				daysInPrevMonth		= this.daysInMonth(year, month - 1);			// how much days in previous month
			
			for(let i = 0; i < daysToAdd; i++){											// adding some dates from previous month
				datesToDraw[i] = new Date(year, month - 1, daysInPrevMonth - daysToAdd + i + 1);
			}
		}
		
		const daysInThisMonth = this.daysInMonth(year, month);
		for(let i = 0; i < daysInThisMonth; i++) {			// adding all dates from current month
			datesToDraw.push( new Date(year, month, i+1));
		}
		
		const daysToAddFromNextMonth = 7 - datesToDraw.length % 7;
		if(daysToAddFromNextMonth !== 0) { 									// just adding days we don't have filled now. This also take in account extra-short Feb :)
			for(let i = 0; i < daysToAddFromNextMonth; i++){
				datesToDraw.push( new Date(year, month + 1, i + 1));
			}
		}
		
		return datesToDraw;
	},
	getEventDataAtDate: function(date){
		const 	eventsData	= this.props.eventsData,
			strDate		= `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
		
		// considering eventsData as JSON Object. Need some more labor for using immutable
		const pulledData = eventsData ? eventsData.get(strDate, false) : false;
		
		return pulledData;
	},
	areDatesInSameDay: function(d1, d2){
		return (
			typeof d1 !== 'undefined' &&
			typeof d2 !== 'undefined' &&
			d1.getFullYear() === d2.getFullYear() &&
			d1.getMonth() === d2.getMonth() &&
			d1.getDate() === d2.getDate()
		);
	},
	noOp: function(){},	// most robust function ever
	renderSpinner: function() {
		if(!this.props.isSync) {
			return (
				<div className="eMonth_spinnerContainer">
					<Loader condition={true}/>
				</div>
			);
		} else {
			return null;
		}
	},
	render: function(){
		const 	year			= this.props.monthDate.getFullYear(),
				month			= this.props.monthDate.getMonth(),
				todayDate		= this.props.todayDate,
				selectedDate	= this.props.selectedDate,
				onClick			= this.props.onClick || this.noOp,
				datesToDraw		= this.visibleDays(year, month),
				datesCount		= datesToDraw.length,
				rows			= [];
		
		for(let i = 0; i < datesCount; i++){
			const 	rowNumber 	= Math.floor(i/7),
					date		= datesToDraw[i],
					dateMonth	= date.getMonth(),
					dataAtDate	= this.getEventDataAtDate(date),
					isNextMonth	= dateMonth != month,
					isPrevMonth	= dateMonth != month,
					isToday		= this.areDatesInSameDay(date, todayDate),
					isSelected	= this.areDatesInSameDay(date, selectedDate),
					row			= rows[rowNumber] || [];
			
			const 	dayPanel = <DayPanel
					size={this.props.size}
					key={`${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`}
					isActive={dataAtDate}
					isSelected={isSelected}
					isToday={isToday}
					isNextMonth={isNextMonth}
					isPrevMonth={isPrevMonth}
					onClick={ () => onClick(date) }
					dayName={date.getDate()}
			/>;
			row.push(dayPanel);
			rows[rowNumber] = row;
		}
		
		const renderedRows = [];
		for(let i = 0; i < rows.length; i++){
			const renderedRow = <div key={`${year}-${month}-row${i}`} className="eMonth_row">{rows[i]}</div>;
			renderedRows.push(renderedRow);
		}
		
		return (
			<div className="eMonth_container">
				{ this.renderSpinner() }
				{ renderedRows }
			</div>
		);
	}
});