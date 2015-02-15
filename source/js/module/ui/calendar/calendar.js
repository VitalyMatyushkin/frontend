var CalendarMonthView = require('./calendar_month'),
    CalendarEventsPanelView = require('./calendar_events_panel'),
	CalendarView;

CalendarView = React.createClass({
	mixins: [Morearty.Mixin],
	getDefaultState: function () {
		var date = new Date();

		return Immutable.fromJS({
			date: date,
			mode: 'months',
			hoverDay: null,
            monthNames: [ "January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December" ]
		});
	},
	render: function() {
		var self = this,
			binding = self.getDefaultBinding(),
            eventsBinding = self.getMoreartyContext().getBinding().sub('events'),
			currentMode = binding.get('mode'),
			currentView;

		if (currentMode === 'months') {
			currentView = <CalendarMonthView binding={binding} />
		} else {
			currentView = <CalendarMonthView binding={binding} />
		}

		return <div className="bCalendar">
			{currentView}
            <CalendarEventsPanelView binding={eventsBinding} />
		</div>;
	}
});


module.exports = CalendarView;
