const	React		= require('react'),
		Morearty	= require('morearty'),
		Immutable	= require('immutable'),
		PublicEvent	= require('./public_event');

const PublicEventPage = React.createClass({
	mixins: [Morearty.Mixin],

	render: function() {
		const binding = this.getDefaultBinding();
		// Note. Pls look at PublicEvent component.
		// You can see generated key.
		// In some cases we should reload this component by hand.
		// I know it's trick.
		return (
			<PublicEvent	binding			= { this.getDefaultBinding() }
							activeSchoolId	= { this.getMoreartyContext().getBinding().get('activeSchoolId') }
							key				= { binding.toJS('eventComponentKey') }
			/>
		)
	}
});

module.exports = PublicEventPage;
