const	React			= require('react'),
		Morearty		= require('morearty'),

		BigScreenConsts	= require('./consts/consts'),
		FixtureList		= require('./fixture_list/fixture_list');

const RecentEvent = React.createClass({
	mixins: [Morearty.Mixin],

	EVENTS_COUNT: 6,

	render:function() {
		const	activeSchoolId	= this.getMoreartyContext().getBinding().get('activeSchoolId'),
				binding			= this.getDefaultBinding().sub('events'),
				events			= binding.get('prevSevenDaysFinishedEvents.events').toJS(),
				isSync 			= binding.get('prevSevenDaysFinishedEvents.isSync');

		return (
			<FixtureList	mode			= { BigScreenConsts.FIXTURE_LIST_MODE.RECENT }
							title			= "Recent Events"
							activeSchoolId	= { activeSchoolId }
							isSync			= { isSync }
							events			= { events.slice(0, this.EVENTS_COUNT) }
			/>
		);
	}
});

module.exports = RecentEvent;