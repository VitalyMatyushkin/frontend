import * as React from 'react'

import * as EventRivals from 'module/shared_pages/student/view/event-rivals';
import {AchievementMainInfo} from "module/shared_pages/student/view/achievements/components/achievement_main_info";

export interface TeamSportAchievementProps {
	activeSchoolId: string
	event: any
	handleClick: (eventId: string) => void
}

export class TeamSportAchievement extends React.Component<TeamSportAchievementProps, {}> {
	render() {
		return (
			<div
				id={'challenge-' + this.props.event.id}
				className="bAchievement"
				onClick={() => this.props.handleClick(this.props.event.id)}
			>
				<AchievementMainInfo activeSchoolId={this.props.activeSchoolId} event={this.props.event}/>
				<EventRivals event={this.props.event} activeSchoolId={this.props.activeSchoolId}/>
				<br/>
			</div>
		);
	}
}