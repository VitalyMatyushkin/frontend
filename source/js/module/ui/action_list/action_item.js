const React = require('react');

const ActionItemStyle = require('../../../../styles/ui/b_action_item.scss');

const ActionList = React.createClass({
	propTypes: {
		id					: React.PropTypes.string.isRequired,
		text				: React.PropTypes.string.isRequired,
		extraStyleClasses	: React.PropTypes.string,
		onClick				: React.PropTypes.func.isRequired
	},
	onClick: function() {
		this.props.onClick(this.props.id);
	},
	render: function () {
		const	extraStyleClasses	= this.props.extraStyleClasses || '',
				className			= `bActionItem ${extraStyleClasses}`;

		return (
			<div	className	= {className}
					onClick		= {this.onClick}
			>
				{this.props.text}
			</div>
		);
	}
});

module.exports = ActionList;


