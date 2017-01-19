/**
 * Created by Anatoly on 08.10.2016.
 */

const	React			= require('react'),
		Immutable		= require('immutable'),

		ChallengeItem	= require('./challenge_item');

const SchoolChallenges = function(props){
	const	school 	= props.school,
			/**
			 * I dont know why it check
			 * Maybe it use when student reguster in two and more schools
			 */
			events	= props.events.filter(function(ev){
				return ev.get('inviterSchoolId') === school.get('id');
			});

	if(events.count()) {
		//Iterate over the children present in the bag
		const	schoolFixtures	= events.map(event => {
			return <ChallengeItem key={event.get('id')} event={event} onClick={props.onClick.bind(null, school.toJS().id)} />;
		}).toArray();

		return (
			<div className= "eChallenge eChallenge_all">
				<div className="eChildFixturesAll"> {schoolFixtures}</div>
				<div className="eChallenge_childName">{`${school.get('name')}`}</div>
			</div>
		);
	}

	return null;
};

SchoolChallenges.propTypes = {
	school:		React.PropTypes.instanceOf(Immutable.Map).isRequired,
	events:		React.PropTypes.instanceOf(Immutable.List),				// Immutable map events
	onClick: 	React.PropTypes.func
};

module.exports = SchoolChallenges;