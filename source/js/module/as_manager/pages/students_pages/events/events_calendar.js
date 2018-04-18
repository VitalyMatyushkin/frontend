const	React					= require('react'),
		Morearty				= require('morearty'),

		{Challenges}			= require('../../../../ui/challenges/challenges'),
		AllSchoolChallenges 	= require('./calendar/challenges/all_school_challenges'),
		Calendar 				= require('./calendar/calendar'),
		CalendarActions			= require('./calendar/calendar-actions');

const EventsCalendar = React.createClass({
	mixins: [Morearty.Mixin],
	componentDidMount: function () {
		const 	binding = this.getDefaultBinding();

		/** Loading initial data for this month */
		this.addBindingListener(binding, 'school', this.onChangeSchool);
		this.addBindingListener(binding, 'activeSchoolId', this.onChangeSchool);
	},
	onChangeSchool:function(){
		const 	binding 	= this.getDefaultBinding(),
				calendar 	= binding.sub('calendar');

		const 	monthDate		= calendar.get('monthDate'),
				selectedDate	= calendar.get('selectedDate'),

				activeSchoolId 	= binding.toJS('activeSchoolId'),
				schoolIdList 	= activeSchoolId === 'all' ? '' : [activeSchoolId];
				//schoolIdList 	= activeSchoolId === 'all' ? binding.toJS('schoolIds') : [activeSchoolId];

		CalendarActions.setCurrentMonth(monthDate, schoolIdList, calendar);
		CalendarActions.setSelectedDate(selectedDate, schoolIdList, calendar);
	},
	onEventClick:function(schoolId, eventId){
		document.location.hash = 'event/' + eventId + '?schoolId=' + schoolId;
	},
	renderChallengesListView: function() {
		const	binding	= this.getDefaultBinding(),
				schools	= binding.get('school');

		const 	calendar 					= this.getDefaultBinding().sub('calendar'),
				isSelectedDateEventsInSync	= calendar.get('selectedDateEventsData.isSync'),
				selectedDateEvents			= calendar.get('selectedDateEventsData.events');

		let challengesList;

		if(binding.get('activeSchoolId') == 'all') {
			challengesList = (
				<AllSchoolChallenges
					isSync	= { isSelectedDateEventsInSync }
					schools	= { schools }
					events	= { selectedDateEvents }
					onClick	= { this.onEventClick }
				/>
			);
		} else {
			const sch = this.getSchoolById(schools.toJS(), binding.toJS('activeSchoolId'));
			if(typeof sch !== 'undefined') {
				challengesList = (
					<Challenges
						isSync	= { isSelectedDateEventsInSync }
						events	= { selectedDateEvents.toJS() }
						onClick	= { this.onEventClick.bind(null, sch.id) }
					/>
				);
			} else {
				challengesList = null;
			}
		}

		return challengesList;
	},
	getSchoolById: function(school, currentSchoolId) {
		return school.find(sch => sch.id === currentSchoolId);
	},
	render: function() {
		const binding = this.getDefaultBinding();
		const activeSchoolId = binding.get('activeSchoolId');
		const schoolIdList = activeSchoolId === 'all' ? '' : [activeSchoolId];

		return (
			<div className="bEvents">
				<div className="eEvents_container">
					<div className="eEvents_row">
						<div className="eEvents_leftSideContainer">
							<Calendar binding={binding.sub('calendar')} schoolIdList={schoolIdList}/>
						</div>
						<div className="eEvents_rightSideContainer">
							{this.renderChallengesListView()}
						</div>
					</div>
				</div>
			</div>
		);
	}
});

module.exports = EventsCalendar;