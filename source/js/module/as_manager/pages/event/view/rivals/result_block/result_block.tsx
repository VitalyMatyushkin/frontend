import * as React from 'react';

import 'styles/ui/b_cancel_event_manual_notification.scss';

export interface ResultBlockProps {
	rivals: any[],
	event: any,
	activeSchoolId: string
}

export class ResultBlock extends React.Component<ResultBlockProps, {}> {
	getResult() {
		let text = '';

		const normalizeScoreArray = [];
		this.props.rivals.forEach(rival => {
			let currentRivalScore = this.props.event.results.schoolScore.find(score => score.schoolId === rival.school.id);
			if(typeof currentRivalScore !== 'undefined') {
				normalizeScoreArray.push({schoolId: rival.school.id, score: currentRivalScore.score});
			} else {
				currentRivalScore = this.props.event.results.teamScore.find(score => score.teamId === rival.team.id);
				normalizeScoreArray.push({schoolId: rival.school.id, score: currentRivalScore.score});
			}
		});

		// Check for draw result
		let isDraw = true;
		let i = 1;
		const tmpScore = normalizeScoreArray[0].score;
		while(i < normalizeScoreArray.length) {
			if(normalizeScoreArray[i].score !== tmpScore) {
				isDraw = false;
			}
			i++;
		}

		if(isDraw) {
			text = 'Draw';
		} else {
			normalizeScoreArray.sort((s1, s2) => {
				if(s1.score > s2.score) {
					return -1;
				} else if(s1.score < s2.score) {
					return 1;
				} else {
					return 0;
				}
			});

			if(isDraw) {
				text = 'Draw';
			} else if(normalizeScoreArray.findIndex(score => score.schoolId === this.props.activeSchoolId) === 0) {
				text = 'Win';
			} else {
				text = 'Lost';
			}
		}

		return text;
	}

	render() {
		return (
			<div className='bResultBlock'>
				<div className='eResultBlock_resultColumn'>
					<div className='eResultBlock_result'>
						{this.getResult()}
					</div>
				</div>
			</div>
		);
	}
}