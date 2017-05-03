const	React					= require('react'),
		Morearty				= require('morearty'),

		Challenges				= require('../../../../ui/challenges/challenges'),
		AllChildrenChallenges 	= require('./calendar/challenges/all_children_challenges'),
		Calendar 				= require('./calendar/calendar'),
		CalendarActions			= require('./calendar/calendar-actions');

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
	onEventClick:function(schoolId, eventId){
		document.location.hash = 'event/' + eventId + '?schoolId=' + schoolId;
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
				<AllChildrenChallenges	isSync		= {isSelectedDateEventsInSync}
										children	= {children}
										events		= {selectedDateEvents}
										onClick		= {this.onEventClick}
				/>
			);
		} else {
			const child = this.getChildById(children.toJS(), binding.toJS('activeChildId'));
			if(typeof child !== 'undefined') {
				challengesList = (
					<Challenges	isSync			= {isSelectedDateEventsInSync}
								events			= {selectedDateEvents.toJS()}
								onClick			= {this.onEventClick.bind(null, child.schoolId)}
								activeSchoolId 	= {child.schoolId}
					/>
				);
			} else {
				challengesList = null;
			}
		}

		return challengesList;
	},
	getChildById: function(children, currentChildId) {
		return children.find(c => c.id === currentChildId);
	},
	render: function() {
		var self 			= this,
			binding 		= self.getDefaultBinding(),
			activeChildId 	= binding.get('activeChildId'),
			childIdList 	= activeChildId === 'all' ? binding.toJS('childrenIds') : [activeChildId];

		return (
			<div className="bEvents">
				<div className="eEvents_container">
					<div className="eEvents_row">
						<div className="eEvents_leftSideContainer">
							<Calendar binding={binding.sub('calendar')} childIdList={childIdList}/>
						</div>
						<div className="eEvents_rightSideContainer">
							{self._renderChallengesListView()}
						</div>
					</div>
				</div>
			</div>
		);
	}
});

module.exports = EventsCalendar;