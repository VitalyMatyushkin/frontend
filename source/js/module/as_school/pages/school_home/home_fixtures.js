const	DateTimeMixin	= require('module/mixins/datetime'),
		React			= require('react'),
		Immutable		= require('immutable'),
		Morearty        = require('morearty'),
		FixtureList		= require('./fixture_list');

const HomeFixtures = React.createClass({
	mixins:[Morearty.Mixin,DateTimeMixin],

	render:function() {
		const 	activeSchoolId 	= this.getMoreartyContext().getBinding().get('activeSchoolId'),
				binding 		= this.getDefaultBinding().sub('events'),
				events 			= binding.get('selectedDateEventsData.events').toJS(),
				isSync 			= binding.get('selectedDateEventsData.isSync');

		console.log('events: ' + JSON.stringify(events, null, 2));

		return <FixtureList
			activeSchoolId={activeSchoolId}
			isDaySelected={true}
			isSync={isSync}
			events={events}
		/>;
	}
});
module.exports = HomeFixtures;