var Panel = require('./panel'),
    ChallengesList = require('./calendar/challenges_list'),
    CalendarView = require('module/ui/calendar/calendar'),
	EventsCalendar;

EventsCalendar = React.createClass({
	mixins: [Morearty.Mixin],
	render: function() {
		var self = this,
			binding = self.getDefaultBinding();

        return (
		    <div>
				<div className="bSubMenu">
					<a href="#" className="eSubMenu_item mActive">Calendar</a>
					<a href="#" className="eSubMenu_item">Challenges</a>
					<a href="#" className="eSubMenu_item">Invites</a>
					<a href="#" className="eSubMenu_item">New Challenge...</a>
				</div>

				<div className="bEvents">
					<Panel binding={binding} />
					<div className="eEvents_calendar">
						<CalendarView binding={binding.sub('calendar')} />
						<ChallengesList binding={binding} />
					</div>
				</div>

			</div>
		);
	}
});


module.exports = EventsCalendar;
