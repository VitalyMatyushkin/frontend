const 	React		= require('react'),
		Morearty	= require('morearty'),
		FixtureList	= require('module/as_school/pages/school_home/fixture_list/fixture_list');

const HomeResults = React.createClass({
	mixins: [ Morearty.Mixin ],

	render:function() {
		const	activeSchoolId	= this.getMoreartyContext().getBinding().get('activeSchoolId'),
				binding			= this.getDefaultBinding().sub('events'),
				events			= typeof binding.get('prevSevenDaysFinishedEvents.events') !== 'undefined' ? binding.get('prevSevenDaysFinishedEvents.events').toJS() : {},
				isSync			= typeof binding.get('prevSevenDaysFinishedEvents.isSync') !== 'undefined' ? binding.get('prevSevenDaysFinishedEvents.isSync') : false,
				region          = this.getMoreartyContext().getBinding().toJS('activeSchool.region');

		return (
			<FixtureList	title					= "Results"
							showAllItemsButtonText	= "More results"
							activeSchoolId			= { activeSchoolId }
							isSync					= { isSync }
							events					= { events }
							isDaySelected			= { true }
							region                  = { region }
			/>
		);
	}
});
module.exports = HomeResults;