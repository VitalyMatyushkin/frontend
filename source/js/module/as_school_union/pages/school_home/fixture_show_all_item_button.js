const React = require('react');

const FixtureShowAllItemButton = React.createClass({
	propTypes: {
		text:			React.PropTypes.string.isRequired,
		handleClick:	React.PropTypes.func.isRequired,
		isShowAllItems:	React.PropTypes.bool.isRequired
	},

	render: function() {
		const arrowStyle = this.props.isShowAllItems ? "fa fa-angle-up" : "fa fa-angle-down";
		const text = this.props.isShowAllItems ? "Hide" : this.props.text;

		return (
			<div
				className	= "eSchoolUnionSchoolList_show_items_button"
				onClick		= { this.props.handleClick }
			>
				<i className = { arrowStyle } aria-hidden = "true" />
				<span>
					{ text }
				</span>
			</div>
		)
	}
});

module.exports = FixtureShowAllItemButton;