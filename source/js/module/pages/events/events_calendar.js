var Panel = require('./panel'),
    ChallengesList = require('./challenges_list'),
    CalendarView = require('module/ui/calendar/calendar'),
	EventsCalendar;

EventsCalendar = React.createClass({
	mixins: [Morearty.Mixin],
	render: function() {
		var self = this,
			binding = self.getDefaultBinding();

        return <div className="bEvents">
            <Panel binding={binding} />
            <div className="eEvents_calendar">
                <CalendarView binding={binding.sub('calendar')} />
                <ChallengesList binding={binding} />
            </div>
        </div>;
	}
});


module.exports = EventsCalendar;
