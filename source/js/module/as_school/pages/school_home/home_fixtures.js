const 	React			= require('react'),
		Morearty        = require('morearty'),
		FixtureList		= require('./fixture_list');

const HomeFixtures = React.createClass({
	mixins: [ Morearty.Mixin ],

	render:function() {
		const 	activeSchoolId 	= this.getMoreartyContext().getBinding().get('activeSchoolId'),
				binding 		= this.getDefaultBinding().sub('events'),
				events 			= binding.get('selectedDateEventsData.events').toJS(),
				isSync 			= binding.get('selectedDateEventsData.isSync');

		return <FixtureList
			activeSchoolId={activeSchoolId}
			isDaySelected={true}
			isSync={isSync}
			events={events}
		/>;
	}
});
module.exports = HomeFixtures;