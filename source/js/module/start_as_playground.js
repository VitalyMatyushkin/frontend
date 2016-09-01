/**
 * Created by wert on 26.02.16.
 */


const
        ReactDom        = require('react-dom'),
        React           = require('react'),
        Promise         = require('bluebird'),
		MonthDays		= require('module/ui/calendar/month_days_panel');

function runPlaygroundMode() {

	const eventsData = {
		'2016-8-1': {
			isActive: true
		},
		'2016-8-2': {
			isActive: true,
			onClick: () => { console.log('hey'); }
		},
		'2016-8-10': {
			isSelected: true
		}
	};

	const MD = <MonthDays
		year={2016}
		month={8}
		today={new Date()}
		eventsData={eventsData}
	/>;

    //// Init app
    ReactDom.render(
       MD,
       document.getElementById('jsMain')
    );
}

module.exports = runPlaygroundMode;