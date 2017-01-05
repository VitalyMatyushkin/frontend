/**
 * Created by Anatoly on 26.09.2016.
 */

const 	React			= require('react'),
		Challenges		= require('./../../../../ui/challenges/challenges'),
		Calendar		= require('./calendar'),
		CalendarActions	= require('./calendar-actions'),
		Morearty		= require('morearty'),
		AddEventButton	= require('./add_event_button'),
		EventsStyles	= require('./../../../../../../styles/pages/events/b_events.scss');

/** Show calendar section: month calendar and events for selected date */
const EventsCalendar = React.createClass({
	mixins:[Morearty.Mixin ],

	componentWillMount: function () {
		const	binding					= this.getDefaultBinding(),
				activeSchoolId			= this.getMoreartyContext().getBinding().get('userRules.activeSchoolId');

		/** Loading initial data for this month */
		CalendarActions.setSelectedDate(new Date(), activeSchoolId, binding);
	},
	onEventClick: function(eventId){
		document.location.hash = 'event/' + eventId + '?tab=gallery';
	},
	handleClickAddEventButton: function() {
		document.location.hash = 'events/manager';
	},

	render: function(){
		const	binding						= this.getDefaultBinding(),
				activeSchoolId				= this.getMoreartyContext().getBinding().get('userRules.activeSchoolId'),
				isSelectedDateEventsInSync	= binding.get('selectedDateEventsData.isSync'),
				selectedDateEvents			= binding.toJS('selectedDateEventsData.events');

		return (
			<div className="bEvents">
				<div className="eEvents_container">
					<div className="eEvents_row">
						<div className="eEvents_leftSideContainer">
							<Calendar binding={binding}/>
						</div>
						<div className="eEvents_rightSideContainer">
							<Challenges activeSchoolId={activeSchoolId}
										isSync={isSelectedDateEventsInSync}
										events={selectedDateEvents}
										onClick={this.onEventClick}
								/>
							<AddEventButton handleClick={this.handleClickAddEventButton}/>
						</div>
					</div>
				</div>
			</div>
		);
	}
});

module.exports = EventsCalendar;