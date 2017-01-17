/**
 * Created by Anatoly on 08.10.2016.
 */

const	React			= require('react'),
		Immutable		= require('immutable'),

		ChallengeItem	= require('./challenge_item');

const SchoolChallenges = function(props){
	const	school 	= props.school,
			events	= props.events.filter(function(ev){
				/**
				 * TODO What is ascription?
				 */
				//return !!ev.get('ascription').get('childrenTakePart').find(id => id === school.get('id'));
				/**
				 * fake check
				 */
				return !!ev.get('invitedSchoolIds').find(id => id === school.get('id'));
						});

	if(events.count()) {
		//Iterate over the children present in the bag
		const	schoolFixtures	= events.map(event => {
			return <ChallengeItem key={event.get('id')} event={event} onClick={props.onClick.bind(null, school.toJS().schoolId)} />;
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