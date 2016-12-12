/**
 * Created by Anatoly on 22.09.2016.
 */

const React = require('react');

function FixtureTitle(){
	return (
		<div className="eChallenge_title mFixtures">
			<span className="eChallengeDate_date">Date</span>
			<div className="bChallenge mTitle">
				<span className="eChallenge_hours">Time</span>
				<span className="eChallenge_sport">Sport</span>
				<span className="eChallenge_event">Event Name</span>
				<span className="eChallenge_rivals">Game Type</span>
				<span className="eChallenge_results">Score</span>
			</div>
		</div>
	);
}

module.exports = FixtureTitle;