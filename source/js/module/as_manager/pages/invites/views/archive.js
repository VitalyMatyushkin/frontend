const   Invites         = require('./invite-list'),
		React           = require('react'),
		Morearty		= require('morearty');

const ArchiveView = React.createClass({
	mixins: [Morearty.Mixin],
	render: function() {
		const binding = this.getDefaultBinding();

		return <Invites binding={binding} type="archive" />;
	}
});


module.exports = ArchiveView;
