const 	React			= require('react'),
		Morearty        = require('morearty'),
		FixtureList		= require('module/as_school/pages/school_home/fixture_list/fixture_list');

const HomeFixtures = React.createClass({
	mixins: [ Morearty.Mixin ],

	render:function() {
		const	activeSchoolId 	= this.getMoreartyContext().getBinding().get('activeSchoolId'),
				binding 		= this.getDefaultBinding().sub('events'),
				events 			= typeof binding.get('nextSevenDaysEvents.events') !== 'undefined' ? binding.get('nextSevenDaysEvents.events').toJS() : {},
				isSync 			= typeof binding.get('nextSevenDaysEvents.isSync') !== 'undefined' ? binding.get('nextSevenDaysEvents.isSync') : false,
				region          = this.getMoreartyContext().getBinding().toJS('activeSchool.region');

		return (
			<FixtureList	title					= "Fixtures"
							showAllItemsButtonText	= "More fixtures"
							activeSchoolId			= { activeSchoolId }
							isSync					= { isSync }
							events					= { events }
							isDaySelected			= { true }
							region                  = { region }
			/>
		);
	}
});
module.exports = HomeFixtures;