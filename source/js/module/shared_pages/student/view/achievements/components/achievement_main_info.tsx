import * as React from 'react'
import {AchievementHelper} from "module/shared_pages/student/view/achievements/achievement_helper";
import * as SportConsts from 'module/helpers/consts/sport';
import * as ScoreHelper	from 'module/ui/score/score_helper';

export interface AchievementMainInfoProps {
	activeSchoolId: string
	event: any
}

export class AchievementMainInfo extends React.Component<AchievementMainInfoProps, {}> {
	getScore() {
		// default
		let score = this.props.event.studentScore;

		// if score is number then it's a plain points and it must be convert to user view
		if(typeof this.props.event.studentScore === 'number') {
			switch (this.props.event.sport.points.display) {
				case SportConsts.SPORT_POINTS_TYPE.PLAIN:
					score = this.props.event.studentScore;
					break;
				case SportConsts.SPORT_POINTS_TYPE.TIME:
					score = ScoreHelper.plainPointsToTimeString(
						this.props.event.studentScore,
						this.props.event.sport.points.inputMask
					);
					break;
				case SportConsts.SPORT_POINTS_TYPE.DISTANCE:
					score = ScoreHelper.plainPointsToDistanceString(
						this.props.event.studentScore,
						this.props.event.sport.points.inputMask
					);
					break;
			}
		}

		return score;
	}
	render() {
		const eventName = this.props.event.generatedNames[this.props.activeSchoolId];

		const schoolNameText = ` ${AchievementHelper.getSchoolName(this.props.event, this.props.activeSchoolId)}`;
		const scoredText = ` ${this.getScore()}`;

		return (
			<div>
				<h4 className='eAchievement_eventName'>{eventName}</h4>
				<div className='eAchievement_simpleField'>
					<b>School:</b>{schoolNameText}
				</div>
				<div className='eAchievement_simpleField'>
					<b>Scored:</b>{scoredText}
				</div>
			</div>
		);
	}
}