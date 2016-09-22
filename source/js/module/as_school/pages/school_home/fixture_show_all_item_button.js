const React = require('react');

const FixtureShowAllItemButton = React.createClass({

	propTypes: {
		handleClick:	React.PropTypes.func.isRequired,
		isShowAllItems:	React.PropTypes.bool.isRequired
	},

	render: function() {
		return (
			<div	onClick		={ this.props.handleClick }
					className	="bFixtureListShowAllItemsButton"
			>
				{ this.props.isShowAllItems ? "Hide Items" : "Show All Items" }
			</div>
		)
	}
});

module.exports = FixtureShowAllItemButton;