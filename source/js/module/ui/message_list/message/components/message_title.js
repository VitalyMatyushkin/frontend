const React = require('react');

const TeamInfo = React.createClass({
	propTypes: {
		message: React.PropTypes.object.isRequired
	},
	render: function() {
		return (
			<h4>{this.props.message.title}</h4>
		);
	}
});

module.exports = TeamInfo;