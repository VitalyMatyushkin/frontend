const 	React			= require('react'),
		Morearty        = require('morearty'),
		FixtureList		= require('./fixture_list');

const HomeFixtures = React.createClass({
	mixins: [ Morearty.Mixin ],

	render:function() {
		const	activeSchoolId 	= this.getMoreartyContext().getBinding().get('activeSchoolId'),
				binding 		= this.getDefaultBinding().sub('events'),
				events 			= binding.get('nextSevenDaysEvents.events').toJS(),
				isSync 			= binding.get('nextSevenDaysEvents.isSync');

		return <FixtureList
			title="Fixtures"
			activeSchoolId={activeSchoolId}
			isSync={isSync}
			events={events}
		/>;
	}
});
module.exports = HomeFixtures;