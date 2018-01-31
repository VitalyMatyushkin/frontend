import * as React from 'react'
import {AchievementHelper} from "module/shared_pages/student/view/achievements/achievement_helper";
import * as TeamHelper from 'module/ui/managers/helpers/team_helper';

export interface AchievementPositionTextProps {
	userId: string
	permissionId: string
	event: any
}

export class AchievementPositionText extends React.Component<AchievementPositionTextProps, {}> {
	getPositionText() {
		let text;

		const event = this.props.event;

		switch (true) {
			case TeamHelper.isTeamSport(event) && TeamHelper.isMultiparty(event): {
				const teamSortedScores = AchievementHelper.getSortedTeamScoreArray(
					this.props.userId,
					this.props.permissionId,
					event.results,
					event
				);

				const player = event.players.find(player => player.userId === this.props.userId &&
					player.permissionId === this.props.permissionId
				);

				const userTeamScoreDataIndex = teamSortedScores.findIndex(scoreData => scoreData.teamId === player.teamId);
				text = ` ${userTeamScoreDataIndex + 1} out of ${teamSortedScores.length} teams`;
				break;
			}
			default: {
				const sortedScores = AchievementHelper.getSortedScoreArray(
					event.results.individualScore,
					event.sport
				);
				const userScoreDataIndex = sortedScores.findIndex(scoreData => scoreData.userId === this.props.userId &&
					scoreData.permissionId === this.props.permissionId);

				text = ` ${userScoreDataIndex + 1} of ${sortedScores.length}`;
				break;
			}
		}

		return text;
	}
	render() {
		return (
			<div className='eAchievement_simpleField'>
				<b>Position</b>{this.getPositionText()}
			</div>
		);
	}
}