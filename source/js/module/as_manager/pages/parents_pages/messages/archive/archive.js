const	React		= require('react'),
		Morearty	= require('morearty'),
		Immutable	= require('immutable');

const Archive = React.createClass({
	mixins: [Morearty.Mixin],
	render: function() {
		return (
			<div>
				Archive
			</div>
		);
	}
});

module.exports = Archive;