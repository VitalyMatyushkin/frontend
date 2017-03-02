const 	React			= require('react'),
		Morearty        = require('morearty'),
		FixtureList		= require('./fixture_list');

const HomeResults = React.createClass({
	mixins: [ Morearty.Mixin ],

	render:function() {
		const	activeSchoolId	= this.getMoreartyContext().getBinding().get('activeSchoolId'),
				binding			= this.getDefaultBinding().sub('events'),
				events			= typeof binding.get('prevSevenDaysFinishedEvents.events') !== 'undefined' ? binding.get('prevSevenDaysFinishedEvents.events').toJS() : {},
				isSync			= binding.get('prevSevenDaysFinishedEvents.isSync');

		return (
			<FixtureList	title					= "Results"
							showAllItemsButtonText	= "More results"
							activeSchoolId			= { activeSchoolId }
							isSync					= { isSync }
							events					= { events }
							isDaySelected			= { true }
			/>
		);
	}
});
module.exports = HomeResults;