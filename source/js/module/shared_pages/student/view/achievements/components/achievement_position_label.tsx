import * as React from 'react'
import {AchievementHelper} from "module/shared_pages/student/view/achievements/achievement_helper";

export interface AchievementPositionTextProps {
	userId: string
	permissionId: string
	event: any
}

export class AchievementPositionText extends React.Component<AchievementPositionTextProps, {}> {
	getPositionText() {
		const sortedScores = AchievementHelper.getSortedScoreArray(
			this.props.event.results.individualScore,
			this.props.event.sport
		);
		const userScoreDataIndex = sortedScores.findIndex(scoreData => scoreData.userId === this.props.userId &&
			scoreData.permissionId === this.props.permissionId);

		return ` ${userScoreDataIndex + 1} of ${sortedScores.length + 1}`;
	}
	render() {
		return (
			<div className='eAchievement_simpleField'>
				<b>Position</b>{this.getPositionText()}
			</div>
		);
	}
}