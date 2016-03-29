const	ChallengesList	= require('module/ui/challenges/challenges_list'),
		CalendarView	= require('module/ui/calendar/calendar'),
		React			= require('react');

const EventsCalendar = React.createClass({
	mixins: [Morearty.Mixin],
	render: function() {
		const	self	= this,
				binding	= self.getDefaultBinding();

		return (
			<div className="eEvents_calendar">
				<CalendarView binding={binding.sub('calendar')} />
				<ChallengesList binding={binding} />
			</div>
		);
	}
});

module.exports = EventsCalendar;