/**
 * Created by wert on 26.02.16.
 */


const
        ReactDom        = require('react-dom'),
        React           = require('react'),
        Promise         = require('bluebird'),
		Immutable		= require('immutable'),
		MonthDays		= require('module/ui/calendar/month_days_panel');

function runPlaygroundMode() {

	const eventsData = {
		'2016-8-1': true,
		'2016-8-2': true
	};

	const clickHandler = function(date) {
		console.log('date: ' + date);
	};

	const MD = <MonthDays
		year={2016}
		month={8}
		today={new Date()}
		selectedDate={new Date(2016, 8, 11)}
		eventsData={Immutable.fromJS(eventsData)}
		onClick={clickHandler}
	/>;

    //// Init app
    ReactDom.render(
       MD,
       document.getElementById('jsMain')
    );
}

module.exports = runPlaygroundMode;