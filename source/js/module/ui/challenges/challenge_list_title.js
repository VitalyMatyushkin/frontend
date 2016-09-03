/**
 * Created by wert on 03.09.16.
 */

const React = require('react');

function ChallengeListTitle(){
	return (
		<div className="eChallenge_title">
			<span className="eChallenge_sport">Sport</span>
			<span className="eChallenge_date">Date</span>
			<span className="eChallenge_name">Event Name</span>
			<span className="eChallenge_rivals">Game Type</span>
			<div className="eChallenge_score">Score</div>
		</div>
	);
}

module.exports = ChallengeListTitle;