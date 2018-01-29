/**
 * Created by wert on 03.09.16.
 */

const 	React				= require('react'),
		SportIcon			= require('module/ui/icons/sport_icon'),
		SportHelper 		= require('module/helpers/sport_helper'),
		EventCalendarStyle	= require('../../../../styles/pages/events/b_events_calendar.scss');

/** Object to draw event details in challenge list.
 *  Have a lot of undocumented shit inside - it was just compiled from already existed code.
 *  I believe somebody one day will refactor it and bring all event view to common denominator... yeah.
 *  Be carefull here.
 */
const ChallengeListItem = React.createClass({

	propTypes: {
		event: 				React.PropTypes.any,
		model:				React.PropTypes.any,
		onClick: 			React.PropTypes.func, 	// first argument is eventId
		onClickDeleteEvent: React.PropTypes.func,
		isUserSchoolWorker: React.PropTypes.bool
	},

	onClick: function(eventId) {
		if(typeof this.props.onClick === 'function')
			this.props.onClick(eventId);
	},
	render: function () {
		const 	event 			= this.props.event,
				model			= this.props.model,
				isCancelled		= event.status === 'CANCELED',
				isRejected		= event.status === 'REJECTED',
				isInvitesSent	= event.status === 'INVITES_SENT';

		let eventResult;

		// TODO: I'm not sure it should be here. Models as they are implemented sucks, but they hide that kind of code
		switch (true) {
			case isCancelled:
				if (this.props.isUserSchoolWorker) {
					eventResult = <span>Cancelled <a onClick={ () => {this.props.onClickDeleteEvent(event.id)}}>(X)</a></span>;
				} else {
					eventResult = 'Cancelled';
				}
				break;
			case isRejected:
				if (this.props.isUserSchoolWorker) {
					eventResult = <span>Rejected <a onClick={ () => {this.props.onClickDeleteEvent(event.id)}}>(X)</a></span>;
				} else {
					eventResult = 'Rejected';
				}
				break;
			case isInvitesSent:
				eventResult = <span>Awaiting<br/>opponent</span>;
				break;
			case typeof model.textResult === 'undefined':
				eventResult = model.score;
				break;
			case SportHelper.isCricket(event.sport.name):
				eventResult = <span>{model.textResult}</span>;
				break;
			default:
				eventResult = <span>{model.textResult}<br/>{model.score}</span>
		}

		/* calculating styles. cancelled and rejected events have their own inactive style */
		const	isInactive	= isCancelled || isRejected,
				topClassName	= 'eChallenge ' + (isInactive ? 'mInactive' : ''),
				iconClassName	= 'bIcon_invites ' + (isInactive ? 'mInactive' : '');

		// TODO: actually it shouldn't be here. Click event should be triggered on any event and dispatched on
		// TODO: top levels of hierarchy. But this is faster solution.
		const handler = () => {
			if(!isCancelled) this.onClick(event.id)
		};

		return (
			<div key={'event-' + event.id} className={topClassName} onClick={handler}>
				<div className="eChallenge_sport">
					<SportIcon title={model.sport} name={model.sport} className={iconClassName} />
				</div>
				<div className="eChallenge_date">
					{model.time}
				</div>
				<div className="eChallenge_name" title={model.name}>
					{model.name}
				</div>
				<div className="eChallenge_score">
					{eventResult}
				</div>
			</div>
		);
	}

});


module.exports = ChallengeListItem;