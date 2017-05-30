const	React		= require('react'),
		Morearty	= require('morearty'),
		Immutable	= require('immutable');

const Outbox = React.createClass({
	mixins: [Morearty.Mixin],
	render: function() {
		return (
			<div>
				Outbox
			</div>
		);
	}
});

module.exports = Outbox;