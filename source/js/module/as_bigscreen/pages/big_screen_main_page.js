const	React		= require('react'),
		Morearty	= require('morearty'),

		RecentEvents		= require('./recent_events'),
		UpcomingEvents		= require('./upcoming_events'),
		EventHighlight		= require('./event_highlight'),
		BigEventHighlight	= require('./big_event_highlight'),

		BigScreenActions	= require('./../actions/BigScreenActions'),
		CalendarActions		= require('./../../as_school/pages/school_home/CalendarActions');

const BigScreenMainPage = React.createClass({
	mixins: [Morearty.Mixin],

	componentWillMount: function () {
		const	binding			= this.getDefaultBinding().sub('events'),
				activeSchoolId	= this.getMoreartyContext().getBinding().get('activeSchoolId');

		CalendarActions.setNextSevenDaysEvents(activeSchoolId, binding);
		CalendarActions.setPrevSevenDaysFinishedEvents(activeSchoolId, binding);
		BigScreenActions.setHighlightEvent(activeSchoolId, binding);
	},

	render: function() {
		const binding = this.getDefaultBinding();

		return (
			<div className="bBigScreen">
				<RecentEvents binding={binding}/>
				<UpcomingEvents binding={binding}/>
				<EventHighlight binding={binding}/>
				<BigEventHighlight binding={binding}/>
			</div>
		);
	}
});

module.exports = BigScreenMainPage;