var ChallengesList = require('./calendar/challenges_list'),
    CalendarView = require('module/ui/calendar/calendar'),
	React = require('react'),
	EventsCalendar;

EventsCalendar = React.createClass({
	mixins: [Morearty.Mixin],
	render: function() {
		var self = this,
			binding = self.getDefaultBinding();
        return (
            <div className="eEvents_calendar">
                <CalendarView binding={binding.sub('calendar')} />
                <ChallengesList binding={binding} />
            </div>
		);
	}
});


module.exports = EventsCalendar;
