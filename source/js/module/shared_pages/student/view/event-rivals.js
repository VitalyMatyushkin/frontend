/**
 * Created by Anatoly on 31.08.2016.
 */
const 	React 			= require('react'),
		ChallengeModel 	= require('module/ui/challenges/challenge_model'),
		Sport 			= require('module/ui/icons/sport_icon');

function EventRivals(props){
	const 	event 				= props.event,
			activeSchoolId 		= props.activeSchoolId,
			model 				= new ChallengeModel(event, activeSchoolId),
			firstName 		= model.rivals[0].value,
			secondName 		= model.rivals[1].value,
			firstPic 		= model.rivals[0].schoolPic,
			secondPic 		= model.rivals[1].schoolPic;
	
	if(firstName === 'individual'){
		return (
			<div className="eAchievement_in">
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
					{!model.isFinished ? <div className="eResults">- : -</div> : (
						<div className="eResults">
							<span className="eScore">{model.scoreAr[0]}</span>
							<span className="eColon"> : </span>
							<span className="eScore">{model.scoreAr[1]}</span>
						</div>
					)}
					<div className="eEventSport">
						<span className="eEventSport_icon"><Sport name={model.sport} /></span>
						<span className="eEventSport_name">{model.sport}</span>
					</div>
					<div className="eAchievement_info">
						{model.eventType}
					</div>
					<div className="eAchievement_date">
						{model.date}
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

EventRivals.propTypes = {
	event: 			React.PropTypes.object.isRequired,
	activeSchoolId: React.PropTypes.string
};

module.exports = EventRivals;
