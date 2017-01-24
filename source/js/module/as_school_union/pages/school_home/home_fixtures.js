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

		return (
			<FixtureList	title					= "Fixtures"
							showAllItemsButtonText	= "More fixtures"
							activeSchoolId			= { activeSchoolId }
							isSync					= { isSync }
							events					= { events }
							isDaySelected			= { true }
			/>
		);
	}
});
module.exports = HomeFixtures;