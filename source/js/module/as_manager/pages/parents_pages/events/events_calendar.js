const	React					= require('react'),
		Morearty				= require('morearty'),

		{Challenges}			= require('../../../../ui/challenges/challenges'),
		AllChildrenChallenges 	= require('./calendar/challenges/all_children_challenges'),
		Calendar 				= require('./calendar/calendar'),
		CalendarActions			= require('./calendar/calendar-actions');

const EventsCalendar = React.createClass({
	mixins: [Morearty.Mixin],
	listeners: [],
	componentDidMount: function () {
		const binding = this.getDefaultBinding();

		/** Loading initial data for this month */
		this.addBindingListener(binding, 'children', this.onChangeChild);
		this.addBindingListener(binding, 'activeChildId', this.onChangeChild);
	},
	componentWillUnmount: function () {
		this.listeners.forEach(listener => this.getDefaultBinding().removeListener(listener));
	},
	/**
	 * Function loads data for current month and selected date
	 * So it's events for selected day and month
	 */
	setDefaultState: function() {
		const	binding		= this.getDefaultBinding(),
				calendar	= binding.sub('calendar');

		const	monthDate		= calendar.get('monthDate'),
				selectedDate	= calendar.get('selectedDate'),

				activeChildId	= binding.toJS('activeChildId'),
				childIdList		= activeChildId === 'all' ? binding.toJS('childrenIds') : [activeChildId];

		CalendarActions.setCurrentMonth(monthDate, childIdList, calendar);
		CalendarActions.setSelectedDate(selectedDate, childIdList, calendar);
	},
	onChangeChild:function(){
		this.setDefaultState();
	},
	onEventClick:function(schoolId, eventId){
		document.location.hash = 'event/' + eventId + '?schoolId=' + schoolId;
	},
	_renderChallengesListView: function() {
		const 	binding		= this.getDefaultBinding(),
				children 	= binding.get('children');

		const 	calendar 					= this.getDefaultBinding().sub('calendar'),
				isSelectedDateEventsInSync	= calendar.get('selectedDateEventsData.isSync'),
				selectedDateEvents			= calendar.get('selectedDateEventsData.events');

		let challengesList;

		if(binding.get('activeChildId') === 'all') {
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
		const	binding			= this.getDefaultBinding(),
				activeChildId	= binding.get('activeChildId'),
				childIdList		= activeChildId === 'all' ? binding.toJS('childrenIds') : [activeChildId];

		return (
			<div className="bEvents">
				<div className="eEvents_container">
					<div className="eEvents_row">
						<div className="eEvents_leftSideContainer">
							<Calendar
								binding		= { binding.sub('calendar') }
								childIdList = { childIdList }
							/>
						</div>
						<div className="eEvents_rightSideContainer">
							{ this._renderChallengesListView() }
						</div>
					</div>
				</div>
			</div>
		);
	}
});

module.exports = EventsCalendar;