const	React						= require('react'),
		classNames					= require('classnames'),
		propz						= require('propz');

const	PencilButton				= require('module/ui/pencil_button'),
		CircleCrossButton			= require('module/ui/circle_cross_button');

const	SchoolRivalInfoConsts		= require('module/as_manager/pages/event/view/rivals/block_view_rivals/block_view_rival/block_view_rival_info/consts/school_rival_info_consts');

const	TableViewRivalActionsStyle	= require('../../../../../../../../../../../styles/ui/b_table_view_rivals/b_table_view_rival_actions.scss');

const Actions = React.createClass({
	propTypes: {
		rival:		React.PropTypes.object.isRequired,
		options:	React.PropTypes.object.isRequired
	},
	/**
	 * Universal handler for 'click' button event
	 * @param buttonData - button data with button id, button type and other information
	 */
	handleClickButton: function(buttonData, eventDescriptor) {
		eventDescriptor.stopPropagation();

		buttonData.handler(this.props.rival.id);
	},
	renderOpponentSchoolManagerButton: function(buttonData) {
		return (
			<PencilButton
				id			= { buttonData.id }
				handleClick	= { this.handleClickButton.bind(this, buttonData) }
			/>
		);
	},
	renderRemoveTeamButton: function(buttonData) {
		return (
			<CircleCrossButton
				id				= { buttonData.id }
				extraClassName	= "mMarginLeftFixed10"
				handleClick		= { this.handleClickButton.bind(this, buttonData) }
			/>
		);
	},
	render: function() {
		let buttons = null;
		const buttonDataArray = propz.get(this.props, ['options', 'buttonsList']);
		if(typeof buttonDataArray !== 'undefined') {
			buttons = buttonDataArray
				.filter(buttonData => buttonData.isShow)
				.map(buttonData => {
					switch (buttonData.type) {
						case (SchoolRivalInfoConsts.BUTTON_TYPES.OPPONENT_SCHOOL_MANAGER_BUTTON): {
							return this.renderOpponentSchoolManagerButton(buttonData);
						}
						case (SchoolRivalInfoConsts.BUTTON_TYPES.REMOVE_TEAM_BUTTON): {
							return this.renderRemoveTeamButton(buttonData);
						}
					}
				});
		}

		const classNameStyle =  classNames({
			bTableViewRivalActions:	true,
			mEmpty:					buttons === null || buttons.length === 0
		});

		if(buttons === null || buttons.length === 0) {
			buttons = '-';
		}

		return (
			<div className={ classNameStyle }>
				{ buttons }
			</div>
		);
	}
});

module.exports = Actions;