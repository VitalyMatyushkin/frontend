const	React				= require('react');

const	ActionButton		= require('./action_button'),
		DropdownList		= require('./dropdown_list');

const	ActionListCssStyle	= require('../../../../styles/ui/b_action_list.scss');


/**
 * It's simple button with text.
 * When you click it action list will drop down.
 *
 * 		|-------------------|
 * 		|	action_button	| 
 * 		|-------------------|
 * 		|-------------------|
 *		|	dropdown_list	|
 * 		|					|
 * 		|	action_item		|
 * 		|	action_item		|
 * 		|	action_item		|
 * 		|					|
 * 		|-------------------|
 */
const ActionList = React.createClass({
	propTypes: {
		buttonText					: React.PropTypes.string.isRequired,
		actionList					: React.PropTypes.array.isRequired,
		handleClickActionItem		: React.PropTypes.func.isRequired,
		handleClickRemoveActionItem	: React.PropTypes.func
	},
	getInitialState: function(){
		return {
			isOpen: false
		};
	},
	renderDropdownList: function() {
		return this.state.isOpen ?
			<DropdownList
				actionList					= { this.props.actionList }
				handleClickActionItem		= { this.props.handleClickActionItem }
				handleClickRemoveActionItem	= { this.props.handleClickRemoveActionItem }
			/> :
			null;
	},
	handleClick: function() {
		this.setState({isOpen: !this.state.isOpen});
	},
	handleBlur: function() {
		this.setState({isOpen: false});
	},
	render: function () {
		return (
			<div className="bActionList">
				<ActionButton	text	= {this.props.buttonText}
								onClick	= {this.handleClick}
								onBlur	= {this.handleBlur}
				/>
				{this.renderDropdownList()}
			</div>
		);
	}
});

module.exports = ActionList;