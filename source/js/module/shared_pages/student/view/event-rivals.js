/**
 * Created by Anatoly on 31.08.2016.
 */
const 	React 			= require('react'),
		ChallengeModel 	= require('module/ui/challenges/challenge_model'),
		Sport 			= require('module/ui/icons/sport_icon'),
		classNames 		= require('classnames');

function EventRivals(props){
	const 	event 				= props.event,
			activeSchoolId 		= props.activeSchoolId,
			model 				= new ChallengeModel(event, activeSchoolId),
			classResults 		= classNames({
										eAchievement_results:true,
										mDone: model.isFinished
									}),
			firstName 		= model.rivals[0].value,
			secondName 		= model.rivals[1].value,
			firstPic 		= model.rivals[0].schoolPic,
			secondPic 		= model.rivals[1].schoolPic;

	if(firstName === 'individual'){
		return (
			<div className="eChallenge_in">
				{"Individual Game"}
			</div>
		)
	}else {
		return (
			<div className="eAchievement_in">
				<div className="eAchievement_rivalName">
					{firstPic ? <span className="eChallenge_rivalPic"><img src={firstPic}/></span> : ''}
					<span className="eAchievement_rival">{firstName}</span>
				</div>
				<div className="eAchievement_rivalInfo">
					<div className={classResults}>
						{model.score}
					</div>
					<div className="eEventSport">
						<span className="eEventSport_icon"><Sport name={model.sport} /></span>
						<span className="eEventSport_name">{model.sport}</span>
					</div>
					<div className="eAchievement_info">
						{model.eventType}
					</div>
				</div>
				<div className="eAchievement_rivalName">
					{secondPic ? <span className="eChallenge_rivalPic"><img src={secondPic}/></span> : ''}
					<span className="eAchievement_rival">{secondName}</span>
				</div>
			</div>
		)
	}
}

module.exports = EventRivals;
