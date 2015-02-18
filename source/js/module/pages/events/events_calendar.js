var CalendarView = require('module/ui/calendar/calendar'),
	EventsCalendar;

EventsCalendar = React.createClass({
	mixins: [Morearty.Mixin],
	render: function() {
		var self = this,
			binding = self.getDefaultBinding();

		return <div className="eEvents_pageContent mActiveEvents">
			<CalendarView binding={binding.sub('calendar')} />
		</div>;
	}
});


module.exports = EventsCalendar;
