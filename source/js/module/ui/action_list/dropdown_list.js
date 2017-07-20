const	React				= require('react');

const	ActionItem			= require('./action_item');

const	ActionListCssStyle	= require('../../../../styles/ui/b_action_list.scss');

const DropdownList = React.createClass({
	propTypes: {
		actionList					: React.PropTypes.array.isRequired,
		handleClickActionItem		: React.PropTypes.func.isRequired,
		handleClickRemoveActionItem	: React.PropTypes.func
	},
	render: function () {
		const items = this.props.actionList.map((action,index, actionList) =>
			<ActionItem
				key					= {action.id}
				id					= {action.id}
				text				= {action.text}
				extraStyleClasses	= {index === actionList.length - 1 ? 'mLast' : ''}
				onClick				= {this.props.handleClickActionItem}
				onClickRemove		= {this.props.handleClickRemoveActionItem}
				options				= {action.options}
			/>
		);

		return (
			<div className='eActionList_itemsContainer'>
				<div className="eActionList_itemListHead"></div>
				<div className="eActionList_itemList">
					{items}
				</div>
			</div>
		);
	}
});

module.exports = DropdownList;