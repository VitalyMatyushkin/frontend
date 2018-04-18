/**
 * Created by wert on 03.09.16.
 */

import * as React from 'react';

export class ChallengeListTitle extends React.Component<{}, {}> {
	render() {
		return (
			<div className="eChallenge_title">
				<span className="eChallenge_sport">Sport</span>
				<span className="eChallenge_date">Time</span>
				<span className="eChallenge_name">Fixture</span>
				<div className="eChallenge_score">Result</div>
			</div>
		);
	}
}