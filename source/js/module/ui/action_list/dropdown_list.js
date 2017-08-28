const	React				= require('react');

const	ActionItem			= require('./action_item');

const	ActionListCssStyle	= require('../../../../styles/ui/b_action_list.scss');

const DropdownList = React.createClass({
	propTypes: {
		actionList					: React.PropTypes.array.isRequired,
		handleClickActionItem		: React.PropTypes.func.isRequired,
		handleClickRemoveActionItem	: React.PropTypes.func,
		extraStyleClasses			: React.PropTypes.string
	},
	getExtraStyleClassesForItemsContainer: function() {
		return typeof this.props.extraStyleClasses !== 'undefined' ? this.props.extraStyleClasses : '';
	},
	getExtraStyleClassesForActionItem: function (action, index) {
		const	lastElementStyle	= index === this.props.actionList.length - 1 ? 'mLast' : '',
				actionCustomStyle	= typeof action.cssStyle !== 'undefined' ? action.cssStyle : '';

		return `${lastElementStyle} ${actionCustomStyle}`;
	},
	render: function () {
		const items = this.props.actionList.map((action, index, actionList) =>
			<ActionItem
				id					= { action.id }
				key					= { action.id }
				text				= { action.text }
				extraStyleClasses	= { this.getExtraStyleClassesForActionItem(action, index) }
				onClick				= { this.props.handleClickActionItem }
				onClickRemove		= { this.props.handleClickRemoveActionItem }
				options				= { action.options }
			/>
		);

		return (
			<div className={ `eActionList_itemsContainer ${ this.getExtraStyleClassesForItemsContainer() }` }>
				<div className="eActionList_itemList">
					{items}
				</div>
			</div>
		);
	}
});

module.exports = DropdownList;