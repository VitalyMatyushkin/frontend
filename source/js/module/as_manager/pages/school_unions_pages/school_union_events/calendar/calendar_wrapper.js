const 	React		= require('react'),
		Morearty	= require('morearty');

const	Calendar		= require('module/as_manager/pages/school_unions_pages/school_union_events/calendar/calendar'),
		Challenges		= require('module/ui/challenges/challenges'),
		AddEventButton	= require('module/as_manager/pages/events/calendar/add_event_button');

const	CalendarActions	= require('module/as_manager/pages/school_unions_pages/school_union_events/calendar/actions');

const	EventsStyles	= require('styles/pages/events/b_events.scss');

const CalendarWrapper = React.createClass({
	mixins:[Morearty.Mixin ],
	propTypes: {
		activeSchoolId:	React.PropTypes.string.isRequired
	},
	componentWillMount: function () {
		const binding = this.getDefaultBinding();

		CalendarActions.setSelectedDate(
			new Date(),
			this.props.activeSchoolId,
			binding
		);
	},
	redirectToManagerPage: function () {
		document.location.hash = 'events/manager';
	},
	handleEventClick: function(eventId){
		document.location.hash = 'event/' + eventId + '?tab=gallery';
	},
	handleClickAddButton: function () {
		this.redirectToManagerPage();
	},
	render: function() {
		const binding = this.getDefaultBinding();
		const selectedDateEvents = binding.toJS('selectedDateEventsData.events');
		const isSelectedDateEventsInSync = binding.get('selectedDateEventsData.isSync');

		return (
			<div className="bEvents">
				<div className="eEvents_container">
					<div className="eEvents_row">
						<div className="eEvents_leftSideContainer">
							<Calendar
								binding			= { binding }
								activeSchoolId	= { this.props.activeSchoolId }
							/>
						</div>
						<div className="eEvents_rightSideContainer">
							<Challenges
								activeSchoolId  	= { this.props.activeSchoolId }
								activeSchoolKind	= { "SchoolUnion" }
								isSync				= { isSelectedDateEventsInSync }
								events				= { selectedDateEvents }
								onClick				= { this.handleEventClick }
								onClickDeleteEvent	= { () => {} }
								isUserSchoolWorker	= { true }
							/>
							<AddEventButton
								handleClick	= { this.handleClickAddButton }
							/>
						</div>
					</div>
				</div>
			</div>
		);
	}
});

module.exports = CalendarWrapper;