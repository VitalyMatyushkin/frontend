var CalendarYearView = require('./calendar_year'),
    CalendarMonthView = require('./calendar_month'),
	React = require('react'),
	ReactDOM = require('reactDom'),
	CalendarView;

CalendarView = React.createClass({
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
		var self = this,
			binding = self.getDefaultBinding(),
			currentMode = binding.get('mode'),
			currentView;

		if (currentMode === 'year') {
			currentView = <CalendarYearView binding={binding} />
		} else {
			currentView = <CalendarMonthView binding={binding} onSelect={self.props.onSelect} />
		}

		return <div className="bCalendar">
			{currentView}
		</div>;
	}
});


module.exports = CalendarView;
