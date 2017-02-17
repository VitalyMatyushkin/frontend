const React = require('react');

const ActionList = React.createClass({
	propTypes: {
		id		: React.PropTypes.string.isRequired,
		text	: React.PropTypes.string.isRequired,
		onClick	: React.PropTypes.func.isRequired
	},
	render: function () {
		return (
			<div className="">
				{this.props.text}
			</div>
		);
	}
});

module.exports = ActionList;


