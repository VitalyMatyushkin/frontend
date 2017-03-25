const 	React			= require('react'),
		Morearty        = require('morearty'),
		FixtureList		= require('./fixture_list');

const HomeFixtures = React.createClass({
	mixins: [ Morearty.Mixin ],

	render:function() {
		const	activeSchoolId 	= this.getMoreartyContext().getBinding().get('activeSchoolId'),
				binding 		= this.getDefaultBinding().sub('events'),
				events 			= typeof binding.get('nextSevenDaysEvents.events') !== 'undefined' ? binding.get('nextSevenDaysEvents.events').toJS() : {},
				isSync 			= typeof binding.get('nextSevenDaysEvents.isSync') !== 'undefined' ? binding.get('nextSevenDaysEvents.isSync') : false;

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