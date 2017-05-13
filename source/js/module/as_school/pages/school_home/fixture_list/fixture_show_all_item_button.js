const React = require('react');

const FixtureShowAllItemButton = React.createClass({

	propTypes: {
		text:			React.PropTypes.string.isRequired,
		handleClick:	React.PropTypes.func.isRequired,
		isShowAllItems:	React.PropTypes.bool.isRequired
	},

	render: function() {
		var classes = this.props.isShowAllItems ? "fa fa-angle-up" : "fa fa-angle-down";

		return (
			<div	onClick		={ this.props.handleClick }
					className	="bBigButton"
			>
				<i className={ classes } aria-hidden="true"></i>
				<span>{ this.props.isShowAllItems ? "Hide" : this.props.text }</span>
			</div>
		)
	}
});

module.exports = FixtureShowAllItemButton;