const	React			= require('react'),
		Morearty		= require('morearty'),

		BigScreenConsts	= require('./consts/consts'),
		FixtureList		= require('./fixture_list/fixture_list'),
		Footer			= require('./footer');

const RecentEvent = React.createClass({
	mixins: [Morearty.Mixin],

	EVENTS_COUNT: 6,

	getCurrentFooterEvent: function() {
		const binding = this.getDefaultBinding().sub('events.footerEvents');

		const	currentEventIndex	= binding.toJS('currentEventIndex'),
			events				= binding.toJS('events');

		return events[currentEventIndex];
	},

	render:function() {
		const binding = this.getDefaultBinding().sub('events');

		const isSync = binding.get('nextSevenDaysEvents.isSync') && binding.get('footerEvents.isSync');

		if(isSync) {
			const	activeSchoolId	= this.getMoreartyContext().getBinding().get('activeSchoolId'),
					events			= binding.toJS('nextSevenDaysEvents.events'),
					footerEvent		= this.getCurrentFooterEvent();

			return (
				<div className="bUpcomingEvents">
					<FixtureList	mode			= { BigScreenConsts.FIXTURE_LIST_MODE.UPCOMING }
									title			= "Upcoming Events"
									activeSchoolId	= { activeSchoolId }
									isSync			= { isSync }
									events			= { events.slice(0, this.EVENTS_COUNT) }
									logo            = "images/big-logo.svg"
					/>
					<Footer	event			= { footerEvent }
							activeSchoolId	= { activeSchoolId }
					/>
				</div>
			);
		} else {
			return null;
		}
	}
});

module.exports = RecentEvent;