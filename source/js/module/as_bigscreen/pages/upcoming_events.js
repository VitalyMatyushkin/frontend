const	React			= require('react'),
		Morearty		= require('morearty'),

		BigScreenConsts	= require('./consts/consts'),
		FixtureList		= require('./fixture_list/fixture_list');

const RecentEvent = React.createClass({
	mixins: [Morearty.Mixin],

	EVENTS_COUNT: 6,

	render:function() {
		const binding = this.getDefaultBinding().sub('events');

		const isSync = binding.get('nextSevenDaysEvents.isSync');

		if(isSync) {
			const	activeSchoolId	= this.getMoreartyContext().getBinding().get('activeSchoolId'),
					events			= binding.toJS('nextSevenDaysEvents.events');

			return (
				<div className="bUpcomingEvents">
					<FixtureList	mode			= { BigScreenConsts.FIXTURE_LIST_MODE.UPCOMING }
									title			= "Upcoming Events"
									activeSchoolId	= { activeSchoolId }
									isSync			= { isSync }
									events			= { events.slice(0, this.EVENTS_COUNT) }
					/>
				</div>
			);
		} else {
			return null;
		}
	}
});

module.exports = RecentEvent;