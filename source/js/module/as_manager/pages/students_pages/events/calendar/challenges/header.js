/**
 * Created by Anatoly on 08.10.2016.
 */

const	React = require('react');

const Header = function(){
	return (
		<div className="eChallenge_title">
			<div className="eChildFixturesAll">
				<div className="eChallenge_sport">Sport</div>
				<div className="eChallenge_date">Time</div>
				<div className="eChallenge_name">Event Name</div>
			</div>
			<div className="eChallenge_childName">Name</div>
		</div>
	);
};

module.exports = Header;