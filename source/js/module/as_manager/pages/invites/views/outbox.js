const   Invites         = require('./invite-list'),
		React           = require('react'),
		Morearty		= require('morearty');

const OutboxView = React.createClass({
	mixins: [Morearty.Mixin],
	render: function() {
		const binding = this.getDefaultBinding();

		return <Invites binding={binding} type="outbox" />;
	}
});


module.exports = OutboxView;
