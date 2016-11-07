const React = require('react');

const FixtureShowAllItemButton = React.createClass({

	propTypes: {
		text:			React.PropTypes.string.isRequired,
		handleClick:	React.PropTypes.func.isRequired,
		isShowAllItems:	React.PropTypes.bool.isRequired
	},

	render: function() {
		return (
			<div	onClick		={ this.props.handleClick }
					className	="bBigButton"
			>
				{ this.props.isShowAllItems ? "Hide" : this.props.text }
			</div>
		)
	}
});

module.exports = FixtureShowAllItemButton;