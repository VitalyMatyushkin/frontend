/**
 * Created by wert on 26.02.16.
 */


const	ReactDom        = require('react-dom'),
        React           = require('react'),
        Promise         = require('bluebird'),
		Immutable		= require('immutable'),
		MonthDays		= require('module/ui/calendar/month_days_panel'),
		{MonthCalendar}	= require('module/ui/calendar/month_calendar'),
		{Markdown} 		= require('module/ui/markdown/markdown');

function runPlaygroundMode() {

	/*const eventsData = {
		'2016-8-1': true,
		'2016-8-2': true
	};


	const calendar = <MonthCalendar
		monthDate={new Date(2016, 8)}
		todayDate={new Date(2016, 8, 12)}
		selectedDate={new Date(2016, 8, 1)}
		onNextMonthClick={ () => console.log('Next Month Click') }
		onPrevMonthClick={ () => console.log('Prev Month Click') }
		onDateClick={ (date) => console.log('Date clicked: ' + date) }
		eventsData={Immutable.fromJS(eventsData)}
	/>;*/

    //// Init app
    ReactDom.render(
		<Markdown />,
       document.getElementById('jsMain')
    );
}

module.exports = runPlaygroundMode;