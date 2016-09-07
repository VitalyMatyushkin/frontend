/**
 * Created by Anatoly on 30.08.2016.
 */
const 	React 			= require('react'),
		ChallengeModel 	= require('module/ui/challenges/challenge_model'),
		classNames 		= require('classnames');

function EventGameTypeWithScore(props){
	const 	event 			= props.event,
			activeSchoolId 	= props.activeSchoolId,
			model 			= new ChallengeModel(event, activeSchoolId),
			classResults 	= classNames({
									eChallenge_results:true,
									mDone: model.isFinished
								}),
			firstName 		= model.rivals[0].value,
			secondName 		= model.rivals[1].value;


	if(firstName === 'individual'){
		return (
			<div className="eChallenge_in">
				{"Individual Game"}
			</div>
		)
	}else {
		return (
			<div className="eChallenge_in">
				<div className="eChallenge_rivalName">
					{firstName}
				</div>
				<div className={classResults}>
					{model.score}
				</div>
				<div className="eChallenge_rivalName">
					{secondName}
				</div>
			</div>
		)
	}
}

EventGameTypeWithScore.propTypes = {
	event: 			React.PropTypes.object.isRequired,
	activeSchoolId: React.PropTypes.string
};

module.exports = EventGameTypeWithScore;
