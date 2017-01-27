const	React		= require('react'),
		Morearty	= require('morearty'),
		Immutable	= require('immutable'),
		PublicEvent	= require('./public_event');

const PublicEventPage = React.createClass({
	mixins: [Morearty.Mixin],

	render: function() {
		return (
			<PublicEvent	binding			= { this.getDefaultBinding() }
							activeSchoolId	= { this.getMoreartyContext().getBinding().get('activeSchoolId') }
			/>
		)
	}
});

module.exports = PublicEventPage;
