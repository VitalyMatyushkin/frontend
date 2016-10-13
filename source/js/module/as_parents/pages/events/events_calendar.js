const 	Challenges 				= require('module/ui/challenges/challenges'),
		AllChildrenChallenges 	= require('./calendar/challenges/all_children_challenges'),
		Calendar 				= require('./calendar/calendar'),
		CalendarActions			= require('./calendar/calendar-actions'),
		Morearty            	= require('morearty'),
		React 					= require('react');

const EventsCalendar = React.createClass({
	mixins: [Morearty.Mixin],
	componentDidMount: function () {
		const 	self 	= this,
				binding = self.getDefaultBinding();

		/** Loading initial data for this month */
		self.addBindingListener(binding, 'children', self.onChangeChild);
		self.addBindingListener(binding, 'activeChildId', self.onChangeChild);
	},
	onChangeChild:function(){
		const 	self 		= this,
				binding 	= self.getDefaultBinding(),
				calendar 	= binding.sub('calendar');

		const 	monthDate		= calendar.get('monthDate'),
				selectedDate	= calendar.get('selectedDate'),

				activeChildId 	= binding.toJS('activeChildId'),
				childIdList 	= activeChildId === 'all' ? binding.toJS('childrenIds') : [activeChildId];

		CalendarActions.setCurrentMonth(monthDate, childIdList, calendar);
		CalendarActions.setSelectedDate(selectedDate, childIdList, calendar);
	},
	onEventClick:function(eventId){
		document.location.hash = 'event/' + eventId + '?tab=teams';
	},
	_renderChallengesListView: function() {
		const	self		= this,
				binding		= self.getDefaultBinding(),
				children 	= binding.get('children');

		const 	calendar 					= this.getDefaultBinding().sub('calendar'),
				isSelectedDateEventsInSync	= calendar.get('selectedDateEventsData.isSync'),
				selectedDateEvents			= calendar.get('selectedDateEventsData.events');

		let challengesList;

		if(binding.get('activeChildId') == 'all') {
			challengesList = (
				<AllChildrenChallenges
					isSync={isSelectedDateEventsInSync}
					children={children}
					events={selectedDateEvents}
					onClick={this.onEventClick}
				/>
			);
		} else {
			challengesList = (
				<Challenges
					activeSchoolId={null}
					isSync={isSelectedDateEventsInSync}
					events={selectedDateEvents.toJS()}
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
			childIdList 	= activeChildId === 'all' ? binding.toJS('childrenIds') : [activeChildId];

		return (
			<div className="eEvents_calendar">
				<Calendar binding={binding.sub('calendar')} childIdList={childIdList} />
				{self._renderChallengesListView()}
			</div>
		);
	}
});

module.exports = EventsCalendar;