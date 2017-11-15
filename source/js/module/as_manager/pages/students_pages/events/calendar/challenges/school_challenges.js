/**
 * Created by Anatoly on 08.10.2016.
 */

const	React			= require('react'),
		Immutable		= require('immutable'),

		ChallengeItem	= require('./challenge_item');

const SchoolChallenges = function(props) {
	const school = props.school;
	const events = props.events.filter(event =>
		Boolean(
			event.get('studentSchools').find(id => id === school.get('id'))
		)
	);

	let result = null;
	if(events.count() > 0) {
		const schoolFixtures = events.map(event =>
			<ChallengeItem
				key				= { event.get('id') }
				activeSchoolId	= { school.get('id') }
				event			= { event.toJS() }
				onClick			= { props.onClick.bind(null, school.toJS().id) }
			/>
		).toArray();

		result = (
			<div className= "eChallenge_all">
				<div className="eChildFixturesAll">
					{schoolFixtures}
				</div>
				<div className="eChallenge_childName">
					{`${school.get('name')}`}
				</div>
			</div>
		);
	}

	return result;
};

SchoolChallenges.propTypes = {
	school:		React.PropTypes.instanceOf(Immutable.Map).isRequired,
	events:		React.PropTypes.instanceOf(Immutable.List),				// Immutable map events
	onClick: 	React.PropTypes.func
};

module.exports = SchoolChallenges;