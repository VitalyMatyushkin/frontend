/**
 * Created by Anatoly on 08.10.2016.
 */

const	React			= require('react'),
		Immutable		= require('immutable'),
		ChallengeItem	= require('./challenge_item');

const ChildChallenges = function(props){
	const child = props.child;
	const events = props.events.filter(event => {
		return Boolean(
			event.get('ascription').get('childrenTakePart').find(id => id === child.get('id'))
		);
	});

	if(events.count() > 0) {
		const childFixtures = events.map(event => {
			return (
				<ChallengeItem
					key				= { event.get('id') }
					activeSchoolId	= { child.get('schoolId') }
					event			= { event }
					onClick			= { props.onClick.bind(null, child.toJS().schoolId) }
				/>
			);
		}).toArray();

		return (
			<div className = "eChallenge_all">
				<div className="eChildFixturesAll">
					{childFixtures}
				</div>
				<div className="eChallenge_childName">
					{`${child.get('firstName')} ${child.get('lastName')}`}
				</div>
			</div>
		);
	}

	return null;
};

ChildChallenges.propTypes = {
	child:		React.PropTypes.instanceOf(Immutable.Map).isRequired,
	events:		React.PropTypes.instanceOf(Immutable.List),				// Immutable map events
	onClick: 	React.PropTypes.func
};

module.exports = ChildChallenges;