const 	CalendarMonthView 	= require('./calendar_month'),
		React 				= require('react'),
		ReactDOM 			= require('react-dom'),
		Morearty            = require('morearty'),
		Immutable 			= require('immutable');


const CalendarView = React.createClass({
	mixins: [Morearty.Mixin],
    propType: {
        onSelect: React.PropTypes.func
    },
	getDefaultState: function () {
		var date = new Date();

		return Immutable.fromJS({
			currentDate: date,
            currentDayDate:0,
			mode: 'month',
			hoverDay: null,
            selectDay: null,
            monthNames: [ "January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December" ]
		});
	},
	render: function() {
		const 	self = this,
				binding = self.getDefaultBinding(),
				currentMode = binding.get('mode');

		return <div className="bCalendar">
			<CalendarMonthView binding={binding} onSelect={self.props.onSelect} />
		</div>;
	}
});


module.exports = CalendarView;
