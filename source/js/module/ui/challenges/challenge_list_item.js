/**
 * Created by wert on 03.09.16.
 */

const 	React		= require('react'),
		SportIcon	= require('module/ui/icons/sport_icon'),
		TeamHelper	= require('module/ui/managers/helpers/team_helper');

/** Object to draw event details in challenge list.
 *  Have a lot of undocumented shit inside - it was just compiled from already existed code.
 *  I believe somebody one day will refactor it and bring all event view to common denominator... yeah.
 *  Be carefull here.
 */
const ChallengeListItem = React.createClass({

	propTypes: {
		event: 			React.PropTypes.any,
		model:			React.PropTypes.any,
		activeSchoolId: React.PropTypes.string.isRequired,
		onClick: 		React.PropTypes.func 	// first argument is eventId
	},

	renderGameTypeColumn: function(event, model) {
		const	leftSideRivalName	= model.rivals[0].value,
				rightSideRivalName	= model.rivals[1].value;

		if(TeamHelper.isIndividualSport(event)) {
			return (
				<div className="eChallenge_rivals">
					{"Individual Game"}
				</div>
			);
		}

		return (
			<div className="eChallenge_rivals">
				<span className="eChallenge_rivalName" title={leftSideRivalName}>{leftSideRivalName}</span>
				<span>vs</span>
				<span className="eChallenge_rivalName" title={rightSideRivalName}>{rightSideRivalName}</span>
			</div>
		);
	},
	render: function () {
		const 	event 			= this.props.event,
				model			= this.props.model,
				onEventClick 	= this.props.onClick;

		return (
			<div key={'event-' + event.id} className='eChallenge' onClick={() => onEventClick(event.id)}>
				<div className="eChallenge_sport"><SportIcon name={model.sport} className="bIcon_invites" /></div>
				<div className="eChallenge_date">{model.date}</div>

				<div className="eChallenge_name" title={model.name}>{model.name}</div>
				{this.renderGameTypeColumn(event, model)}
				<div className="eChallenge_score">{model.score}</div>
			</div>
		);
	}

});


module.exports = ChallengeListItem;