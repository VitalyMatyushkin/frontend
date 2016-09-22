/**
 * Created by Anatoly on 22.09.2016.
 */

const 	React 			= require('react'),
		Sport           = require('module/ui/icons/sport_icon'),
		classNames      = require('classnames'),
		ChallengeModel  = require('module/ui/challenges/challenge_model');

function FixtureItem(props){
	function renderGameTypeColumn(model) {
		const	leftSideRivalName	= model.rivals[0].value,
				rightSideRivalName	= model.rivals[1].value;

		if(model.isIndividualSport) {
			return (
				<div className="eChallenge_rivals">
					{"Individual Game"}
				</div>
			);
		}

		return (
			<div className="eChallenge_rivals">
				<span className="eChallenge_rivalName" title={leftSideRivalName}>{leftSideRivalName}</span>
				<span>vs</span>
				<span className="eChallenge_rivalName" title={rightSideRivalName}>{rightSideRivalName}</span>
			</div>
		);
	}
	function onClickChallenge(eventId) {
		document.location.hash = 'event/' + eventId + '?tab=teams';
	}

	const   model           = new ChallengeModel(props.event, props.activeSchoolId),
			sportIcon       = <Sport name={model.sport} className="bIcon_invites" />,
			scoreClasses 	= classNames({eChallenge_results:true, mDone:model.isFinished});

	return (
		<div className="bChallenge" onClick={onClickChallenge.bind(null, model.id)}>
			<span className="eChallenge_sport">{sportIcon}</span>
			<span className="eChallenge_event" title={model.name}>{model.name}</span>
			<div className="eChallenge_hours">{model.time}</div>
			{renderGameTypeColumn(model)}
			<div className={scoreClasses}>{model.score}</div>
		</div>
	);
}
FixtureItem.propTypes = {
	event: 			React.PropTypes.object,
	activeSchoolId: React.PropTypes.string
};


module.exports = FixtureItem;