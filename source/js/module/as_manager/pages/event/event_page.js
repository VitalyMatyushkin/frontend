const	React			= require('react'),
		Morearty		= require('morearty'),
		Immutable		= require('immutable'),
		MoreartyHelper	= require('../../../helpers/morearty_helper'),
		Event			= require('./event');

const EventPage = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function () {
		this.activeSchoolId = MoreartyHelper.getActiveSchoolId(this);

		this.setNewEventComponentKey();
	},
	getRandomString: function() {
		// just current date in timestamp view
		return + new Date();
	},
	/**
	 * Function generates and sets new random key for event component.
	 */
	setNewEventComponentKey: function() {
		this.getDefaultBinding().set('eventComponentKey', Immutable.fromJS(this.getRandomString()));
	},
	onReload: function() {
		this.setNewEventComponentKey();
	},
	render: function() {
		const	self	= this,
				binding	= self.getDefaultBinding();

		// Note. Pls look at Event component.
		// You can see generated key.
		// In some cases we should reload this component by hand.
		// I know it's trick.
		return (
			<Event	key				= {binding.toJS('eventComponentKey')}
					binding			= {binding}
					onReload		= {this.onReload}
					activeSchoolId	= {this.activeSchoolId}
			/>
		);
	}
});

module.exports = EventPage;