const	React		= require('react'),
		Morearty	= require('morearty'),
		Immutable	= require('immutable');

const Inbox = React.createClass({
	mixins: [Morearty.Mixin],
	render: function() {
		return (
			<div>
				Inbox
			</div>
		);
	}
});

module.exports = Inbox;