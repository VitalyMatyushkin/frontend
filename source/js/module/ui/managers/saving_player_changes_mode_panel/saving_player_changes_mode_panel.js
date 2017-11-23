const	React			= require('react'),

		NewTeamMode		= require('./view_modes/new_team_mode'),
		OldTeamMode		= require('./view_modes/old_team_mode'),
		ManagerConsts	= require('./../helpers/manager_consts'),

	{If}			= require('../../if/if');

const TeamSaveModePanel = React.createClass({
	propTypes: {
		viewMode:				React.PropTypes.string.isRequired,
		savingChangesMode:		React.PropTypes.string.isRequired,
		originalTeamName:		React.PropTypes.string.isRequired,
		teamName:				React.PropTypes.string.isRequired,
		handleChange:			React.PropTypes.func.isRequired,
		handleChangeTeamName:	React.PropTypes.func.isRequired
	},

	render: function() {
		return (
			<div className="bSavingPlayerChangesModePanel">
				<If condition={ this.props.viewMode === ManagerConsts.VIEW_MODE.NEW_TEAM_VIEW}>
					<NewTeamMode	teamName				= { this.props.teamName }
									savingChangesMode		= { this.props.savingChangesMode }
									handleChange			= { this.props.handleChange }
									handleChangeTeamName	= { this.props.handleChangeTeamName }
					/>
				</If>
				<If condition={ this.props.viewMode === ManagerConsts.VIEW_MODE.OLD_TEAM_VIEW}>
					<OldTeamMode	originalTeamName		= { this.props.originalTeamName }
									teamName				= { this.props.teamName }
									savingChangesMode		= { this.props.savingChangesMode }
									handleChange			= { this.props.handleChange }
									handleChangeTeamName	= { this.props.handleChangeTeamName }
					/>
				</If>
			</div>
		);
	}
});

module.exports = TeamSaveModePanel;