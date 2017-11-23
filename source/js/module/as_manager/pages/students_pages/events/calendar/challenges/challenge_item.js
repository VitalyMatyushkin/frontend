/**
 * Created by Anatoly on 08.10.2016.
 */

const	React		= require('react'),
		{DateHelper}	= require('../../../../../../helpers/date_helper'),
		Sport		= require('../../../../../../ui/icons/sport_icon');

const ChallengeItem = function(props){
	const eventName = getEventNameBySchoolId(props.activeSchoolId, props.event);
	const time = DateHelper.getTime(props.event.startTime);
	const sport = props.event.sport.name;

	return (
		<div
			className	= 'eChallenge eChallenge_basicMod'
			onClick		= { () => props.onClick && props.onClick(props.event.id) }
		>
			<span className="eChallenge_sport">
				<Sport
					name		= { sport }
					title		= { sport }
					className	= "bIcon_invites"
				/>
			</span>
			<span className="eChallenge_date">
				{time}
			</span>
			<div
				className	= "eChallenge_name"
				title		= { eventName }
			>
				{eventName}
			</div>
		</div>
	);
};

function getEventNameBySchoolId(schoolId, event) {
	const name = event.generatedNames[schoolId];

	return typeof name !== 'undefined' ? name : '';
}

ChallengeItem.propTypes = {
	event:			React.PropTypes.object.isRequired,
	activeSchoolId:	React.PropTypes.string.isRequired,
	onClick:		React.PropTypes.func
};

module.exports = ChallengeItem;