const	React							= require('react'),
		Morearty						= require('morearty'),
		Immutable						= require('immutable'),

		ConfirmPopup					= require('../../../../ui/confirm_popup'),
		TeamSaveModePanel				= require('../../../../ui/managers/saving_player_changes_mode_panel/saving_player_changes_mode_panel'),
		ManagerConsts					= require('../../../../ui/managers/helpers/manager_consts'),
		EventHelper						= require('module/helpers/eventHelper'),
		TeamHelper						= require('module/ui/managers/helpers/team_helper'),
		SavingPlayerChangesPopupHelper	= require('./helper'),

		ManagerStyles					= require('../../../../../../styles/pages/events/b_events_manager.scss');

const SavingPlayerChangesPopup = React.createClass({
	mixins: [Morearty.Mixin],

	propTypes: {
		activeSchoolId:	React.PropTypes.string.isRequired,
		submit:			React.PropTypes.func.isRequired
	},

	getOriginalTeamName: function(teamWrappers, order) {
		switch (true) {
			case SavingPlayerChangesPopupHelper.isUserCreateNewTeamByOrder(order, teamWrappers):
				return teamWrappers[order].teamName.name;
			case SavingPlayerChangesPopupHelper.isTeamChangedByOrder(order, teamWrappers):
				return teamWrappers[order].prevTeamName;
		}
	},
	getViewMode: function(order, teamWrappers) {
		switch (true) {
			case SavingPlayerChangesPopupHelper.isTeamChangedByOrder(order, teamWrappers) && !SavingPlayerChangesPopupHelper.isUserCreateNewTeamByOrder(order, teamWrappers):
				return ManagerConsts.VIEW_MODE.OLD_TEAM_VIEW;
			case SavingPlayerChangesPopupHelper.isUserCreateNewTeamByOrder(order, teamWrappers):
				return ManagerConsts.VIEW_MODE.NEW_TEAM_VIEW;

		}
	},

	closeSavingChangesModePopup: function() {
		this.getDefaultBinding().atomically()
			.set('isSavingChangesModePopupOpen',					false)
			.set('teamModeView.teamWrapper.0.savingChangesMode',	Immutable.fromJS(ManagerConsts.SAVING_CHANGES_MODE.DOESNT_SAVE_CHANGES))
			.set('teamModeView.teamWrapper.1.savingChangesMode',	Immutable.fromJS(ManagerConsts.SAVING_CHANGES_MODE.DOESNT_SAVE_CHANGES))
			.commit();
	},

	handleClickSavingPlayerChangesModeRadioButton: function(teamWrapperIndex, currentMode) {
		this.getDefaultBinding().set(
			`teamModeView.teamWrapper.${teamWrapperIndex}.savingChangesMode`,
			Immutable.fromJS(currentMode)
		);
	},
	handleChangeTeamName: function(teamWrapperIndex, name) {
		const self = this;

		self.getDefaultBinding().set(
			`teamModeView.teamWrapper.${teamWrapperIndex}.teamName.name`,
			Immutable.fromJS(name)
		);
	},

	renderSavingPlayerChangesPopupBody: function(event) {
		const activeSchoolId = this.props.activeSchoolId;

		const savingPlayerChangesModePanels = [];

		const teamWrappers = this.getDefaultBinding().toJS('teamModeView.teamWrapper');

		switch (true) {
			case EventHelper.isInterSchoolsEvent(event) && TeamHelper.isMultiparty(event): {
				teamWrappers.forEach((tw, index) => {
					if(
						(
							SavingPlayerChangesPopupHelper.isTeamChangedByOrder(index, teamWrappers) ||
							SavingPlayerChangesPopupHelper.isUserCreateNewTeamByOrder(index, teamWrappers)
						) && activeSchoolId === tw.schoolId
					) {
						if(savingPlayerChangesModePanels.length !== 0) {
							savingPlayerChangesModePanels.push(
								<div className="eSavingChangesBlock_changesSeparator"></div>
							);
						}
						savingPlayerChangesModePanels.push(
							<TeamSaveModePanel
								key						= { `team-wrapper-${index}` }
								originalTeamName		= { this.getOriginalTeamName(teamWrappers, index) }
								teamName				= { teamWrappers[index].teamName.name }
								savingChangesMode		= { teamWrappers[index].savingChangesMode }
								viewMode				= { this.getViewMode(index, teamWrappers) }
								handleChange			= { this.handleClickSavingPlayerChangesModeRadioButton.bind(null, index) }
								handleChangeTeamName	= { this.handleChangeTeamName.bind(null, index) }
							/>
						);
					}
				});
				break;
			}
			case EventHelper.isInterSchoolsEvent(event): {
				savingPlayerChangesModePanels.push(
					<TeamSaveModePanel
						key						= { `team-wrapper-0` }
						originalTeamName		= { this.getOriginalTeamName(teamWrappers, 0) }
						teamName				= { teamWrappers[0].teamName.name }
						savingChangesMode		= { teamWrappers[0].savingChangesMode }
						viewMode				= { this.getViewMode(0, teamWrappers) }
						handleChange			= { this.handleClickSavingPlayerChangesModeRadioButton.bind(null, 0) }
						handleChangeTeamName	= { this.handleChangeTeamName.bind(null, 0) }
					/>
				);
				break;
			}
			// for other event types check all teams
			default: {
				teamWrappers.forEach((tw, index) => {
					if(
						SavingPlayerChangesPopupHelper.isTeamChangedByOrder(index, teamWrappers) ||
						SavingPlayerChangesPopupHelper.isUserCreateNewTeamByOrder(index, teamWrappers)
					) {
						if(savingPlayerChangesModePanels.length !== 0) {
							savingPlayerChangesModePanels.push(
								<div className="eSavingChangesBlock_changesSeparator"></div>
							);
						}
						savingPlayerChangesModePanels.push(
							<TeamSaveModePanel
								key						= { `team-wrapper-${index}` }
								originalTeamName		= { this.getOriginalTeamName(teamWrappers, index) }
								teamName				= { teamWrappers[index].teamName.name }
								savingChangesMode		= { teamWrappers[index].savingChangesMode }
								viewMode				= { this.getViewMode(index, teamWrappers) }
								handleChange			= { this.handleClickSavingPlayerChangesModeRadioButton.bind(null, index) }
								handleChangeTeamName	= { this.handleChangeTeamName.bind(null, index) }
							/>
						);
					}
				});
				break;
			}
		}

		return (
			<div className="bSavingChangesBlock">
				{ savingPlayerChangesModePanels }
			</div>
		);
	},
	render: function() {
		const binding = this.getDefaultBinding();

		const event = binding.toJS('model');

		const isSavingChangesModePopupOpen = !!binding.toJS('isSavingChangesModePopupOpen');

		if(isSavingChangesModePopupOpen) {
			return (
				<ConfirmPopup	okButtonText			= "Create event"
								cancelButtonText		= "Back"
								isOkButtonDisabled		= { binding.toJS('isSubmitProcessing') }
								handleClickOkButton		= {
									() => {
										binding.set('isSubmitProcessing', true);
										this.props.submit();
									}
								}
								handleClickCancelButton	= { this.closeSavingChangesModePopup }
				>
					{ this.renderSavingPlayerChangesPopupBody(event) }
				</ConfirmPopup>
			);
		} else {
			return null;
		}
	}
});

module.exports = SavingPlayerChangesPopup;