const	React				= require('react');

const	ActionButton		= require('./action_button'),
		ActionItem			= require('./action_item');

const	ActionListCssStyle	= require('../../../../styles/ui/b_action_list.scss');

const ActionList = React.createClass({
	propTypes: {
		buttonText				: React.PropTypes.string.isRequired,
		actionList				: React.PropTypes.array.isRequired,
		handleClickActionItem	: React.PropTypes.func.isRequired
	},
	getInitialState: function(){
		return {
			isOpen: false
		};
	},
	renderList: function() {
		if(this.state.isOpen) {
			const items = this.props.actionList.map((action,index, actionList) =>
				<ActionItem	key					= {action.id}
							id					= {action.id}
							text				= {action.text}
							extraStyleClasses	= {index === actionList.length - 1 ? 'mLast' : ''}
							onClick				= {this.props.handleClickActionItem}
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
		} else {
			return null;
		}
	},
	handleClick: function() {
		this.setState({isOpen: !this.state.isOpen});
	},
	render: function () {
		return (
			<div className="bActionList">
				<ActionButton	text	= {this.props.buttonText}
								onClick	= {this.handleClick}
				/>
				{this.renderList()}
			</div>
		);
	}
});

module.exports = ActionList;