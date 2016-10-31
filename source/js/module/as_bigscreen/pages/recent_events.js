const	React			= require('react'),
		Morearty		= require('morearty'),

		BigScreenConsts	= require('./consts/consts'),
		FixtureList		= require('./fixture_list/fixture_list'),
		Footer			= require('./footer');

const RecentEvent = React.createClass({
	mixins: [Morearty.Mixin],

	EVENTS_COUNT: 6,

	render:function() {
		const binding = this.getDefaultBinding().sub('events');

		const isSync = binding.get('prevSevenDaysFinishedEvents.isSync') && binding.get('nextSevenDaysEvents.isSync');

		if(isSync) {
			const	activeSchoolId	= this.getMoreartyContext().getBinding().get('activeSchoolId'),
					events			= binding.toJS('prevSevenDaysFinishedEvents.events'),
					footerEvent		= binding.toJS('nextSevenDaysEvents.events.0');

			return (
				<div className="bRecentEvents">
					<FixtureList	mode			= { BigScreenConsts.FIXTURE_LIST_MODE.RECENT }
									title			= "Recent Events"
									activeSchoolId	= { activeSchoolId }
									events			= { events.slice(0, this.EVENTS_COUNT) }
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