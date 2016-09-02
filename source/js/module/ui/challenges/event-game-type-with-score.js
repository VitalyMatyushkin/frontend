/**
 * Created by Anatoly on 30.08.2016.
 */
const 	React 		= require('react'),
		EventHelper = require('module/helpers/eventHelper'),
		TeamHelper 	= require('module/ui/managers/helpers/team_helper'),
		classNames 	= require('classnames');

function EventGameTypeWithScore(props){
	const 	event = props.event,
			activeSchoolId = props.activeSchoolId,
			isFinished = event.status === EventHelper.EVENT_STATUS.FINISHED,
			classResults = classNames({
				eChallenge_results:true,
				mDone: isFinished
			}),
			firstName 	= TeamHelper.getRivalNameForLeftContext(event, activeSchoolId).value,
			secondName 	= TeamHelper.getRivalNameForRightContext(event, activeSchoolId).value,
			firstPoint = TeamHelper.callFunctionForLeftContext(activeSchoolId, event, TeamHelper.getCountPoints.bind(TeamHelper, event)),
			secondPoint = TeamHelper.callFunctionForRightContext(activeSchoolId, event, TeamHelper.getCountPoints.bind(TeamHelper, event));


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
					{isFinished ? [firstPoint, secondPoint].join(':') : '- : -'}
				</div>
				<div className="eChallenge_rivalName">
					{secondName}
				</div>
			</div>
		)
	}
}

module.exports = EventGameTypeWithScore;
