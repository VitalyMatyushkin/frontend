const	React				= require('react'),
		propz				= require('propz'),
		SmallCrossButton	= require('module/ui/small_cross_button/small_cross_button');

const	ActionItemStyle	= require('../../../../styles/ui/b_action_item.scss');

const ActionItem = React.createClass({
	propTypes: {
		id							: React.PropTypes.string.isRequired,
		text						: React.PropTypes.string.isRequired,
		extraStyleClasses			: React.PropTypes.string,
		onClick						: React.PropTypes.func.isRequired,
		onClickRemove				: React.PropTypes.func,
		options						: React.PropTypes.func
	},
	onClick: function(e) {
		this.props.onClick(this.props.id);

		e.stopPropagation();
	},
	onClickRemoveButton: function(e) {
		this.props.onClickRemove(this.props.id);

		e.stopPropagation();
	},
	isRemoveButtonEnable: function() {
		const isRemoveButtonEnable = propz.get(this.props, ['options', 'isRemoveButtonEnable']);

		return typeof isRemoveButtonEnable !== 'undefined' ? isRemoveButtonEnable : false;
	},
	renderRemoveButton: function() {
		return this.isRemoveButtonEnable() ?
			<SmallCrossButton onClick={this.onClickRemoveButton}/>:
			null;
	},
	render: function () {
		const	extraStyleClasses	= this.props.extraStyleClasses || '',
				className			= `bActionItem ${extraStyleClasses}`;

		return (
			<div
				className	= { className }
				onMouseDown	= { this.onClick }
			>
				<div>
					{this.props.text}
				</div>
				{ this.renderRemoveButton() }
			</div>
		);
	}
});

module.exports = ActionItem;


