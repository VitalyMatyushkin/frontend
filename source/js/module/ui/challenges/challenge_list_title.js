/**
 * Created by wert on 03.09.16.
 */

const React = require('react');

function ChallengeListTitle(){
	return (
		<div className="eChallenge_title">
			<span className="eChallenge_sport">Sport</span>
			<span className="eChallenge_date">Time</span>
			<span className="eChallenge_name">Fixture</span>
			<div className="eChallenge_score">Result</div>
		</div>
	);
}

module.exports = ChallengeListTitle;