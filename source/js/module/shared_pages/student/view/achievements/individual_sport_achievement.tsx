import * as React from 'react'
import {AchievementMainInfo} from "module/shared_pages/student/view/achievements/components/achievement_main_info";
import {AchievementPositionText} from "module/shared_pages/student/view/achievements/components/achievement_position_label";
import {AchievementHelper} from "module/shared_pages/student/view/achievements/achievement_helper";

import * as propz from 'propz';

export interface IndividualSportAchievementProps {
	activeSchoolId: string
	userId: string
	permissionId: string
	event: any
	handleClick: (eventId: string) => void
}

export class IndividualSportAchievement extends React.Component<IndividualSportAchievementProps, {}> {
	renderSchoolLogo() {
		const activeSchool = AchievementHelper.getActiveSchool(this.props.event, this.props.activeSchoolId);
		const schoolPic = propz.get(activeSchool, ['pic'], undefined);

		let schoolLogo = null;
		switch (true) {
			case typeof schoolPic !== 'undefined': {
				schoolLogo = <div className="eChallenge_rivalPic"><img src={schoolPic}/></div>;
				break;
			}
			default: {
				schoolLogo = <div className="eChallenge_rivalPic"><div className='eChallenge_blankImage'/></div>;
				break;
			}
		}

		return schoolLogo;
	}
	render() {
		return (
			<div
				id={'challenge-' + this.props.event.id}
				className="bAchievement mIndividualSport"
				onClick={() => this.props.handleClick(this.props.event.id)}
			>
				<div className="eAchievement_column mShort mMarginRight">
					{this.renderSchoolLogo()}
				</div>
				<div className="eAchievement_column">
					<AchievementMainInfo activeSchoolId={this.props.activeSchoolId} event={this.props.event}/>
					<AchievementPositionText
						event={this.props.event}
						userId={this.props.userId}
						permissionId={this.props.permissionId}
					/>
				</div>
			</div>
		);
	}
}