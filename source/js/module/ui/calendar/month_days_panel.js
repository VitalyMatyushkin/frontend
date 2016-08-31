/**
 * Created by wert on 30.08.16.
 */


const 	React		= require('react');

const MonthDaysPanel = React.createClass({
	propTypes: {
		year:		React.PropTypes.number.isRequired,
		month:		React.PropTypes.number.isRequired	// month number starts from 0. Jan is 0, Feb is 1 and so on
		// todayDate:	React.PropTypes.instanceOf[Date],
		// eventsData:	React.PropTypes.object,	// date -> data dictionary: '2016-01-10': { isActive: true, isSelected: true, isToday: true,  }
		// onClick:	React.PropTypes.func 	// func to trigger on date
	},

	/** How much days in given month of given year */
	daysInMonth: function(year, month) {
		return new Date(year, month + 1, 0).getDate();
	},

	/**
	 * For given year and month return array of all dates visible in calendar.
	 * It will add some days in begining from previous month and some days to end.
	 * @param {Number} year
	 * @param {Number} month
	 * @returns {Array<Date>}
	 */
	visibleDays: function (year, month) {
		const firstMonthDayDate 	= new Date(year, month, 1);
		const datesToDraw = [];	// as calendar have 7 days and 5 or 6 rows. 6 rows we have when month starts on Sat or Sun

		const firstMonthDay = firstMonthDayDate.getDay();								// 0 for Sunday, 1 for Monday...
		if(firstMonthDay !== 1) {															// if first month day is not Monday(1) - adding some days from previous month
			const 	daysToAdd 				= firstMonthDay === 0 ? 6 : firstMonthDay - 1,	// how much days from previous month to add. 0 is Sunday, so this is why we checking it explicitly
				daysInPrevMonth			= daysInMonth(year, month - 1);					// how much days in previous month

			for(let i = 0; i < daysToAdd; i++){											// adding some dates from previous month
				datesToDraw[i] = new Date(year, month - 1, daysInPrevMonth - daysToAdd + i + 1);
			}
		}

		const daysInThisMonth = daysInMonth(year, month);
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
	}
});


module.exports = MonthDaysPanel;