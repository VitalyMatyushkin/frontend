const 	Challenges 			= require('module/ui/challenges/challenges'),
		AllChallengesList 	= require('./calendar/all_challenges_list'),
		Calendar 			= require('./calendar/calendar'),
		CalendarActions		= require('./calendar/calendar-actions'),
		Morearty            = require('morearty'),
		React 				= require('react');

const EventsCalendar = React.createClass({
	mixins: [Morearty.Mixin],
	componentDidMount: function () {
		var self 			= this,
			binding 		= self.getDefaultBinding();

		/** Loading initial data for this month */
		self.addBindingListener(binding, 'children', () =>{
			const 	activeChildId 	= binding.toJS('activeChildId'),
					childIdList 	= activeChildId === 'all' ? binding.toJS('children').map(c => {return c.id}) : [activeChildId];

			CalendarActions.setSelectedDate(new Date(), childIdList, binding.sub('calendar'))
			CalendarActions.setCurrentMonth(new Date(), childIdList, binding.sub('calendar'));
		});
	},
	onEventClick:function(eventId){
		document.location.hash = 'event/' + eventId + '?tab=teams';
	},
	_renderChallengesListView: function() {
		const	self	= this,
				binding	= self.getDefaultBinding();

		const 	calendar 					= this.getDefaultBinding().sub('calendar'),
				isSelectedDateEventsInSync	= calendar.get('selectedDateEventsData.isSync'),
				selectedDateEvents			= calendar.toJS('selectedDateEventsData.events');

		let challengesList;

		if(binding.get('activeChildId') == 'all') {
			challengesList = (<AllChallengesList binding={binding}/>);
		} else {
			challengesList = (
				<Challenges
					activeSchoolId={null}
					isSync={isSelectedDateEventsInSync}
					events={selectedDateEvents}
					onClick={this.onEventClick}
				/>
			);
		}

		return challengesList;
	},
	render: function() {
		var self 			= this,
			binding 		= self.getDefaultBinding(),
			activeChildId 	= binding.get('activeChildId'),
			childIdList 	= activeChildId === 'all' ? binding.toJS('children').map(c => {return c.id}) : [activeChildId];

		return (
			<div className="eEvents_calendar">
				<Calendar binding={binding.sub('calendar')} childIdList={childIdList} />
				{self._renderChallengesListView()}
			</div>
		);
	}
});

module.exports = EventsCalendar;