/**
 * Created by wert on 03.09.16.
 */

const 	React		= require('react'),
		SportIcon	= require('module/ui/icons/sport_icon');

/** Object to draw event details in challenge list.
 *  Have a lot of undocumented shit inside - it was just compiled from already existed code.
 *  I believe somebody one day will refactor it and bring all event view to common denominator... yeah.
 *  Be carefull here.
 */
const ChallengeListItem = React.createClass({

	propTypes: {
		event: 			React.PropTypes.any,
		model:			React.PropTypes.any,
		onClick: 		React.PropTypes.func 	// first argument is eventId
	},

	onClick: function(eventId) {
		if(typeof this.props.onClick === 'function')
			this.props.onClick(eventId);
	},
	render: function () {
		const 	event 			= this.props.event,
				model			= this.props.model,
				isCancelled		= event.status === 'CANCELED',
				isRejected		= event.status === 'REJECTED';

		let eventResult;

		// TODO: I'm not sure it should be here. Models as they are implemented sucks, but they hide that kind of code
		switch (true) {
			case isCancelled:
				eventResult = 'Canceled';
				break;
			case isRejected:
				eventResult = 'Rejected';
				break;
			case typeof model.textResult === 'undefined':
				eventResult = model.score;
				break;
			default:
				eventResult = <span>{model.textResult}<br/>{model.score}</span>
		}

		return (
			<div key={'event-' + event.id} className='eChallenge' onClick={() => this.onClick(event.id)}>
				<div className="eChallenge_sport">
					<SportIcon name={model.sport} className="bIcon_invites" />
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