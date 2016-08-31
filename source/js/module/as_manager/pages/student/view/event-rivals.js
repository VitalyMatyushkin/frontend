/**
 * Created by Anatoly on 31.08.2016.
 */
const 	React 		= require('react'),
		EventHelper = require('module/helpers/eventHelper'),
		TeamHelper 	= require('module/ui/managers/helpers/team_helper'),
		classNames 	= require('classnames');

function EventGameTypeWithScore(props){
	const 	event 				= props.event,
			activeSchoolId 		= props.activeSchoolId,
			isFinished 			= event.status === EventHelper.EVENT_STATUS.FINISHED,
			isInterSchoolsEvent = EventHelper.isInterSchoolsEvent(event),
			classResults 		= classNames({
										eAchievement_results:true,
										mDone: isFinished
									}),
			leftContext 	= TeamHelper.getRivalNameForLeftContext(event, activeSchoolId),
			rightContext 	= TeamHelper.getRivalNameForRightContext(event, activeSchoolId),
			firstName 		= leftContext.value,
			secondName 		= rightContext.value,
			firstPoint 		= TeamHelper.callFunctionForLeftContext(activeSchoolId, event,
											TeamHelper.getCountPoints.bind(TeamHelper, event)),
			secondPoint 	= TeamHelper.callFunctionForRightContext(activeSchoolId, event,
											TeamHelper.getCountPoints.bind(TeamHelper, event)),
			teamBundles		= TeamHelper.getTeamBundles(event);

	let firstPic, secondPic;

	if (isInterSchoolsEvent) {
		firstPic = teamBundles.schoolsData.find(s => s.name === leftContext.from).pic;
		secondPic = teamBundles.schoolsData.find(s => s.name === rightContext.from).pic;
	} else {
		firstPic = teamBundles.schoolsData[0].pic;
		secondPic = teamBundles.schoolsData[0].pic;
	}


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
						{isFinished ? [firstPoint, secondPoint].join(':') : '? : ?'}
					</div>
					<div className="eAchievement_info">
						{EventHelper.serverEventTypeToClientEventTypeMapping[event.eventType]}
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

module.exports = EventGameTypeWithScore;
