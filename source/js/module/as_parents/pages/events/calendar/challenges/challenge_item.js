/**
 * Created by Anatoly on 08.10.2016.
 */

const	React 		= require('react'),
		Immutable 	= require('immutable'),
		DateHelper 	= require('module/helpers/date_helper'),
		Sport		= require('module/ui/icons/sport_icon');

const ChallengeItem = function(props){
	const	event 		= props.event,
			stringDate	= DateHelper.getDate(event.get('startTime')),
			sport		= event.get('sport').get('name');

	return(
		<div className={'eChallenge eChallenge_basicMod'} onClick={() => props.onClick && props.onClick(event.get('id'))}>
			<span className="eChallenge_sport">
				<Sport name={sport} className="bIcon_invites" />
			</span>
			<span className="eChallenge_date">{stringDate}</span>
			<div className="eChallenge_name" title={event.get('name')}>{event.get('name')}</div>
		</div>
	);
};

ChallengeItem.propTypes = {
	event: 		React.PropTypes.instanceOf(Immutable.Map).isRequired,			// Immutable map event
	onClick: 	React.PropTypes.func
};

module.exports = ChallengeItem;