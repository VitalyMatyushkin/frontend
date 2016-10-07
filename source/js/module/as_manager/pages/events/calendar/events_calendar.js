/**
 * Created by Anatoly on 26.09.2016.
 */

const 	React			= require('react'),
		Challenges		= require('module/ui/challenges/challenges'),
		Calendar		= require('module/ui/calendar/calendar'),
		CalendarActions	= require('./calendar-actions'),
		Morearty        = require('morearty');

/** Show calendar section: month calendar and events for selected date */
const EventsCalendar = React.createClass({
	mixins:[Morearty.Mixin ],

	componentWillMount: function () {
		const	binding					= this.getDefaultBinding().sub('calendar'),
				activeSchoolId			= this.getMoreartyContext().getBinding().get('userRules.activeSchoolId');

		/** Loading initial data for this month */
		CalendarActions.setSelectedDate(new Date(), activeSchoolId, binding);
	},
	onEventClick:function(eventId){
		document.location.hash = 'event/' + eventId + '?tab=teams';
	},
	render: function(){
		const 	binding 					= this.getDefaultBinding().sub('calendar'),
				activeSchoolId				= this.getMoreartyContext().getBinding().get('userRules.activeSchoolId'),
				isSelectedDateEventsInSync	= binding.get('selectedDateEventsData.isSync'),
				selectedDateEvents			= binding.toJS('selectedDateEventsData.events');

		return (
			<div className="eEvents_calendar">
				<Calendar binding={binding} actions={CalendarActions} />
				<Challenges
					activeSchoolId={activeSchoolId}
					isSync={isSelectedDateEventsInSync}
					events={selectedDateEvents}
					onClick={this.onEventClick}
				/>
			</div>
		);
	}
});

module.exports = EventsCalendar;