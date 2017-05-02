/**
 * Created by Anatoly on 08.10.2016.
 */

const	React		= require('react'),
		Immutable	= require('immutable'),

		DateHelper	= require('../../../../../../helpers/date_helper'),
		Sport		= require('../../../../../../ui/icons/sport_icon');

const ChallengeItem = function(props){
	const	event 		= props.event,
			eventName	= event.toJS().generatedNames.official,
			time		= DateHelper.getTime(event.get('startTime')),
			sport		= event.get('sport').get('name');
	
	const 	isCancelled	= event.get('status') === 'CANCELED';
	
	/* calculating styles. cancelled and rejected events have their own inactive style */
	const	topClassName	= 'eChallenge ' + (isCancelled ? 'mInactive' : ''),
			iconClassName	= 'bIcon_invites ' + (isCancelled ? 'mInactive' : '');
	
	// TODO: actually it shouldn't be here. Click event should be triggered on any event and dispatched on
	// TODO: top levels of hierarchy. But this is faster solution.
	const handler = () => {
		if (!isCancelled) {
			props.onClick && props.onClick(event.get('id'));
		}
	};

	
	return(
		<div className={`eChallenge eChallenge_basicMod ${topClassName}`} onClick={handler}>
			<span className="eChallenge_sport">
				<Sport name={sport} title={sport} className={`bIcon_invites ${iconClassName}`} />
			</span>
			<span className="eChallenge_date">{time}</span>
			<div className="eChallenge_name" title={eventName}>{eventName}</div>
		</div>
	);
};

ChallengeItem.propTypes = {
	event: 		React.PropTypes.instanceOf(Immutable.Map).isRequired,			// Immutable map event
	onClick: 	React.PropTypes.func
};

module.exports = ChallengeItem;