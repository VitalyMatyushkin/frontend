import * as React from 'react';
import * as Morearty from 'morearty';
import * as Immutable from 'immutable';

import {ConfirmPopup} from 'module/ui/confirm_popup';
import * as TeamSaveModePanel from '../../../../ui/managers/saving_player_changes_mode_panel/saving_player_changes_mode_panel';
import * as ManagerConsts from '../../../../ui/managers/helpers/manager_consts';
import * as EventHelper from 'module/helpers/eventHelper';
import * as TeamHelper from 'module/ui/managers/helpers/team_helper';
import {SavingPlayerChangesPopupHelper} from './helper';
import {TeamWrapper} from './helper';
import {Event} from '../events';

import '../../../../../../styles/pages/events/b_events_manager.scss';

interface SavingPlayerChangesPopupProps {
	activeSchoolId:	string
	submit:			() => void
}

export const SavingPlayerChangesPopup = (React as any).createClass({
	mixins: [Morearty.Mixin],

	getOriginalTeamName: function(teamWrappers: TeamWrapper[], order: number) {
		switch (true) {
			case SavingPlayerChangesPopupHelper.isUserCreateNewTeamByTeamWrapper(teamWrappers[order]):
				return teamWrappers[order].teamName.name;
			case SavingPlayerChangesPopupHelper.isTeamChangedByTeamWrapper(teamWrappers[order]):
				return teamWrappers[order].prevTeamName;
		}
	},

	getViewMode: function(order: number, teamWrappers: TeamWrapper[]) {
		switch (true) {
			case SavingPlayerChangesPopupHelper.isTeamChangedByTeamWrapper(teamWrappers[order]) && !SavingPlayerChangesPopupHelper.isUserCreateNewTeamByTeamWrapper(teamWrappers[order]):
				return ManagerConsts.VIEW_MODE.OLD_TEAM_VIEW;
			case SavingPlayerChangesPopupHelper.isUserCreateNewTeamByTeamWrapper(teamWrappers[order]):
				return ManagerConsts.VIEW_MODE.NEW_TEAM_VIEW;

		}
	},

	handleClickOkButton: function () {
		this.getDefaultBinding().set('isSubmitProcessing', true);
		this.props.submit();
	},

	closeSavingChangesModePopup: function() {
		const teamWrappers = this.getDefaultBinding().toJS('teamModeView.teamWrapper');
		teamWrappers.forEach(tw => {
			tw.savingChangesMode = ManagerConsts.SAVING_CHANGES_MODE.DOESNT_SAVE_CHANGES;
		});

		this.getDefaultBinding().set('isSavingChangesModePopupOpen', false);
		this.getDefaultBinding().set('teamModeView.teamWrapper', Immutable.fromJS(teamWrappers));
	},

	handleClickSavingPlayerChangesModeRadioButton: function(teamWrapperIndex: number, currentMode: string) {
		this.getDefaultBinding().set(
			`teamModeView.teamWrapper.${teamWrapperIndex}.savingChangesMode`,
			Immutable.fromJS(currentMode)
		);
	},

	handleChangeTeamName: function(teamWrapperIndex: number, name: string) {
		const self = this;

		self.getDefaultBinding().set(
			`teamModeView.teamWrapper.${teamWrapperIndex}.teamName.name`,
			Immutable.fromJS(name)
		);
	},

	renderSavingPlayerChangesPopupBody: function(event: Event): React.ReactNode {
		const activeSchoolId = this.props.activeSchoolId;

		const savingPlayerChangesModePanels = [];

		const teamWrappers = this.getDefaultBinding().toJS('teamModeView.teamWrapper');

		switch (true) {
			case EventHelper.isInterSchoolsEvent(event) && TeamHelper.isMultiparty(event): {
				teamWrappers.forEach((tw, index) => {
					if(
						(
							SavingPlayerChangesPopupHelper.isTeamChangedByTeamWrapper(teamWrappers[index]) ||
							SavingPlayerChangesPopupHelper.isUserCreateNewTeamByTeamWrapper(teamWrappers[index])
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
						SavingPlayerChangesPopupHelper.isTeamChangedByTeamWrapper(teamWrappers[index]) ||
						SavingPlayerChangesPopupHelper.isUserCreateNewTeamByTeamWrapper(teamWrappers[index])
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
				<ConfirmPopup
					okButtonText			= "Create event"
					cancelButtonText		= "Back"
					isOkButtonDisabled		= { binding.toJS('isSubmitProcessing') }
					handleClickOkButton		= { () => this.handleClickOkButton() }
					handleClickCancelButton	= { () => this.closeSavingChangesModePopup() }
				>
					{ this.renderSavingPlayerChangesPopupBody(event) }
				</ConfirmPopup>
			);
		} else {
			return null;
		}
	}
});