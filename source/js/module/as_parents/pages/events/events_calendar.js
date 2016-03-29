const 	ChallengesList 		= require('module/ui/challenges/challenges_list'),
		AllChallengesList 	= require('./calendar/all_challenges_list'),
		CalendarView 		= require('module/ui/calendar/calendar'),
		React 				= require('react');

const EventsCalendar = React.createClass({
	mixins: [Morearty.Mixin],
	_renderChallengesListView: function() {
		const	self	= this,
				binding	= self.getDefaultBinding();

		let challengesList;

		if(binding.get('activeChildId') == 'all') {
			challengesList = (<AllChallengesList binding={binding}/>);
		} else {
			challengesList = (<ChallengesList binding={binding}/>);
		}

		return challengesList;
	},
	render: function() {
		var self = this,
			binding = self.getDefaultBinding();

		return (
			<div className="eEvents_calendar">
				<CalendarView binding={binding.sub('calendar')} />
				{self._renderChallengesListView()}
			</div>
		);
	}
});

module.exports = EventsCalendar;