const	React			= require('react'),

		RadioButton		= require('./../../../radio_button/radio_button'),
		ManagerConsts	= require('./../../helpers/manager_consts');

const Header = React.createClass({
	propTypes: {
		teamName:				React.PropTypes.string.isRequired,
		savingChangesMode:		React.PropTypes.string.isRequired,
		handleChange:			React.PropTypes.func.isRequired,
		handleChangeTeamName:	React.PropTypes.func.isRequired
	},

	isChecked: function(savingChangesMode) {
		return this.props.savingChangesMode === savingChangesMode;
	},
	handleChangeTeamName: function(e) {
		if(this.props.savingChangesMode === ManagerConsts.SAVING_CHANGES_MODE.SAVE_CHANGES_TO_NEW_PROTOTYPE_TEAM) {
			this.props.handleChangeTeamName(e.target.value);
		}
	},

	render: function() {
		return (
			<div>
				<div className="eSavingPlayerChangesModePanel_text">
					You create new team. Please select one of the following options:
				</div>
				<div className="eSavingPlayerChangesModePanel_radioButtons">
					<RadioButton	id			= { "new-team-mode-save-as-new-team-radio-button" }
									text		= { 'Save as new team' }
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
					<RadioButton	id			= { "new-team-mode-use-only-for-this-team-radio-button" }
									text		= { 'Use team only for this event' }
									isChecked	= { this.isChecked(ManagerConsts.SAVING_CHANGES_MODE.DOESNT_SAVE_CHANGES) }
									onClick		= { this.props.handleChange.bind(null, ManagerConsts.SAVING_CHANGES_MODE.DOESNT_SAVE_CHANGES) }
					/>
				</div>
			</div>
		);
	}
});

module.exports = Header;