/**
 * Created by vitaly on 22.12.17.
 */

import * as	React from 'react';
import 'styles/pages/event/b_achievement.scss';

interface AchievementTableProps {
	achievement: Achievement[]
	children: Child[]
	showEvents: (title: string, childId: string) => void
}

interface Child {
	activatedAt: 		string
	birthday: 			string
	createdAt: 			string
	firstName: 			string
	formId: 			string
	gender: 			string
	houseId: 			string
	id: 				string
	lastName: 			string
	nextOfKin: 			any
	permissionId: 		string
	schoolId: 			string
	status: 			string
	updatedAt: 			string
	webIntroEnabled: 	boolean
}

interface Achievement {
	drewCount: 		number
	lostCount: 		number
	name: 			string
	playedCount:	number
	userId:			string
	schoolId:			string
	wonCount: 		number
}

const clickableColumn = ['playedCount', 'wonCount', 'drewCount', 'lostCount'];

export const AchievementAllSchoolTable = (React as any).createClass({
	renderHead: function(titles: string[]): React.ReactNode {
		const columns = titles.map( (title, i) => {
			return <th key={title + i}>{title}</th>;
		});
		
		return (
			<thead>
			<tr>
				<th>#</th>
				{columns}
			</tr>
			</thead>
		);
	},
	
	renderBody: function(titles: string[], achievementData: Achievement[]): React.ReactNode {
		const rows = achievementData.filter(rowObj => rowObj.playedCount !== 0)
			.map( (rowObj, i) => {
				const school = this.props.schools.find(c => c.id === rowObj.schoolId);

				rowObj.name = school.name;

				const cells = titles.map( title => {
					if (clickableColumn.indexOf(title) !== -1) {
						return (
							<td
								key={title+i}
								className="eClickable_cell"
								onClick={() => this.props.showEvents(title, rowObj.userId, rowObj.schoolId)}
							>
								{rowObj[title]}
							</td>
						);
					} else {
						return <td key={title+i}>{rowObj[title]}</td>;
					}
				});

				return (
					<tr key={i}>
						<th scope="row">{i + 1}</th>
						{cells}
					</tr>
				);
			});
		
		return (<tbody>{rows}</tbody>);
	},
	
	render: function(){
		const achievements = this.props.achievements;
		const titles = ['name', 'wonCount', 'drewCount', 'lostCount', 'playedCount'];
		const displayTitles = ['Name', 'Won', 'Drew', 'Lost', 'Played'];
		
		return (
			<div className="eAchievement_scoreTableWrapper">
				<div className="table-responsive">
					<table className="table table-striped">
						{this.renderHead(displayTitles)}
						{this.renderBody(titles, achievements)}
					</table>
				</div>
			</div>
		);
	}
});