const React = require('react');

const MessageText = React.createClass({
	propTypes: {
		message: React.PropTypes.object.isRequired
	},
	render: function() {
		return (
			<div className="eInvite_text">
				<h4>{this.props.message.text}</h4>
			</div>
		);
	}
});

module.exports = MessageText;