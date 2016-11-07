const	React			= require('react'),
		RadioButton		= require('./../radio_button/radio_button'),
		ManagerConsts	= require('./helpers/manager_consts');

const TeamSaveModePanel = React.createClass({
	propTypes: {
		originalTeamName:		React.PropTypes.string.isRequired,
		teamName:				React.PropTypes.string.isRequired,
		mode:					React.PropTypes.string.isRequired,
		handleChange:			React.PropTypes.func.isRequired,
		handleChangeTeamName:	React.PropTypes.func.isRequired
	},
	isChecked: function(mode) {
		return this.props.mode === mode;
	},

	handleChangeTeamName: function(e) {
		if(this.props.mode === ManagerConsts.SAVING_CHANGES_MODE.SAVE_CHANGES_TO_NEW_PROTOTYPE_TEAM) {
			this.props.handleChangeTeamName(e.target.value);
		}
	},

	render: function() {
		return (
			<div className="bSavingPlayerChangesModePanel">
				<h3>
					{ this.props.originalTeamName }
				</h3>
				<div className="eSavingPlayerChangesModePanel_radioButtons">
					<RadioButton	text		= { 'Update original team' }
									isChecked	= { this.isChecked(ManagerConsts.SAVING_CHANGES_MODE.SAVE_CHANGES_TO_PROTOTYPE_TEAM) }
									onClick		= { this.props.handleChange.bind(null, ManagerConsts.SAVING_CHANGES_MODE.SAVE_CHANGES_TO_PROTOTYPE_TEAM) }
					/>
					<RadioButton	text		= { 'Save as new team' }
									isChecked	= { this.isChecked(ManagerConsts.SAVING_CHANGES_MODE.SAVE_CHANGES_TO_NEW_PROTOTYPE_TEAM) }
									onClick		= { this.props.handleChange.bind(null, ManagerConsts.SAVING_CHANGES_MODE.SAVE_CHANGES_TO_NEW_PROTOTYPE_TEAM) }
									customCSS	= { 'mSaveAsNewTeam' }
					/>
					<input	className	= "eTeamName_nameForm mSaveAsNewTeam"
							type		= { 'text' }
							placeholder	= { 'Enter team name' }
							onChange	= { this.handleChangeTeamName }
							value		= { typeof this.props.teamName !== 'undefined' ? this.props.teamName : '' }
					/>
					<RadioButton	text		= { 'Use team only for this event' }
									isChecked	= { this.isChecked(ManagerConsts.SAVING_CHANGES_MODE.DOESNT_SAVE_CHANGES) }
									onClick		= { this.props.handleChange.bind(null, ManagerConsts.SAVING_CHANGES_MODE.DOESNT_SAVE_CHANGES) }
					/>
				</div>
			</div>
		);
	}
});

module.exports = TeamSaveModePanel;