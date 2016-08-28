/**
 * Created by wert on 28.08.16.
 */

const React = require('react');

/** This is bar with days of week name in calendar. It always Mon - Sun and always the same.
 * It looks like bar with days of week:
 * Mon Tue Wed Thu Fri Sat Sun
 **/
function DaysOfWeekBar(){
	return (
		<div className="eMonth_row mWeeks">
			<span className="eMonth_day mWeekName">Mon</span>
			<span className="eMonth_day mWeekName">Tue</span>
			<span className="eMonth_day mWeekName">Wed</span>
			<span className="eMonth_day mWeekName">Thu</span>
			<span className="eMonth_day mWeekName">Fri</span>
			<span className="eMonth_day mWeekName">Sat</span>
			<span className="eMonth_day mWeekName">Sun</span>
		</div>
	);
}

module.exports = DaysOfWeekBar;