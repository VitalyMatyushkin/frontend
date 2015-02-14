var CalendarMonthView = require('./calendar_month'),
	CalendarView;

CalendarView = React.createClass({
	mixins: [Morearty.Mixin],
	getDefaultState: function () {
		var date = new Date();

		return Immutable.fromJS({
			date: date,
			mode: 'months',
			hoverDay: null
		});
	},
	render: function() {
		var self = this,
			binding = self.getDefaultBinding(),
			calendarBinding = binding,
			currentMode = calendarBinding.get('mode'),
			currentView;

		if (currentMode === 'months') {
			currentView = <CalendarMonthView binding={calendarBinding} />
		} else {
			currentView = <CalendarMonthView binding={calendarBinding} />
		}

		return <div className="bCalendar">
			{currentView}
		</div>;
	}
});


module.exports = CalendarView;
