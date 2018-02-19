import {Event} from '../events';
import {Player} from '../events';

export interface TeamWrapper{
	isActive: boolean
	isLoadingTeam: boolean
	isSetTeamLater: boolean
	isTeamChanged: boolean
	isTeamNameChanged: boolean
	isTeamPlayersChanged: boolean
	prevPlayers: Player[]
	prevSelectedTeamId: string
	prevTeamName: any
	removedPlayers: Player[]
	rivalId: string
	savingChangesMode: string
	schoolId: string
	selectedTeamId: string
	teamName: {initName: string, name: string}
	teamsSaveMode: string
	___teamManagerBinding: any
}

export class SavingPlayerChangesPopupHelper {
	static isUserCreateNewTeam (event: Event, teamWrappers: TeamWrapper[], activeSchoolId: string) {
		const resultArray = teamWrappers
			.filter(tw => tw.schoolId === activeSchoolId)
			.map(tw => this.isUserCreateNewTeamByTeamWrapper(tw));

		let result = false;
		for(let i = 0; i < resultArray.length; i++) {
			if(resultArray[i]) {
				result = true;
				break;
			}
		}

		return result;
	}

	static isUserCreateNewTeamByTeamWrapper (teamWrapper: TeamWrapper) {
		return (
			typeof teamWrapper.selectedTeamId === 'undefined' &&
			!teamWrapper.isSetTeamLater
		);
	}

	static isAnyTeamChanged (event: Event, teamWrappers: TeamWrapper[], activeSchoolId: string) {
		const resultArray = teamWrappers
			.filter(tw => tw.schoolId === activeSchoolId)
			.map(tw => this.isTeamChangedByTeamWrapper(tw));

		let result = false;
		for(let i = 0; i < resultArray.length; i++) {
			if(resultArray[i]) {
				result = true;
				break;
			}
		}

		return result;
	}

	static isTeamChangedByTeamWrapper (teamWrapper: TeamWrapper) {
		return teamWrapper.isTeamChanged;
	}
}