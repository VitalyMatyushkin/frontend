/**
 * Created by wert on 03.09.16.
 */

const 	React		= require('react'),
		SportIcon	= require('module/ui/icons/sport_icon'),
		EventHelper	= require('module/helpers/eventHelper'),
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

	getScore: function(event, teamBundleName, order) {
		return TeamHelper.getCountPoints(event, teamBundleName, order);
	},
	renderGameTypeColumn: function(event, model) {
		const	self	= this;
		let		result	= null;

		if(EventHelper.isEventWithOneIndividualTeam(event)) {
			result = (
				<div className="eChallenge_rivals">
					{"Individual Game"}
				</div>
			);
		} else {
			const	leftSideRivalName	= self._getRivalNameLeftSide(event, model.rivals),
					rightSideRivalName	= self._getRivalNameRightSide(event, model.rivals);

			result = (
				<div className="eChallenge_rivals">
					<span className="eChallenge_rivalName" title={leftSideRivalName}>{leftSideRivalName}</span>
					<span>vs</span>
					<span className="eChallenge_rivalName" title={rightSideRivalName}>{rightSideRivalName}</span>
				</div>
			);
		}

		return result;
	},

	_getRivalNameLeftSide: function(event, rivals) {
		const self = this;

		const	eventType		= event.eventType,
				participants	= event.teamsData;

		if(TeamHelper.isNonTeamSport(event)) {
			switch (eventType) {
				case EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools']:
					const foundRival = rivals.find(r => r.id === self.activeSchoolId);

					return foundRival ? foundRival.name : 'n/a';
				case EventHelper.clientEventTypeToServerClientTypeMapping['houses']:
					return rivals[0].name;
			}
		} else if(
			eventType === EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools'] &&
			participants.length === 0
		) {
			return 'n/a';
		} else if (
			eventType === EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools'] &&
			participants.length === 1 &&
			participants[0].schoolId !== self.activeSchoolId
		) {
			return 'n/a';
		} else if (
			eventType === EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools'] &&
			participants[0].schoolId === self.activeSchoolId
		) {
			return rivals.find(rival => rival.id === participants[0].id).name;
		} else if(
			eventType === EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools'] &&
			participants[1].schoolId === self.activeSchoolId
		) {
			return rivals.find(rival => rival.id === participants[1].id).name;
		} else if (
			participants.length === 1 &&
			eventType !== EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools']
		) {
			return rivals.find(rival => rival.id === participants[0].id).name;
		} else if (
			(
				participants.length === 0 ||
				participants.length === 1
			) &&
			eventType !== EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools']
		) {
			return 'n/a';
		} else if(eventType !== EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools']) {
			return rivals.find(rival => rival.id === participants[0].id).name;
		}
	},
	_getRivalNameRightSide: function(event, rivals) {
		const	self	= this;

		const	eventType		= event.eventType,
			participants	= event.teamsData;

		if(TeamHelper.isNonTeamSport(event)) {
			switch (eventType) {
				case EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools']:
					const foundRival = rivals.find(r => r.id !== self.activeSchoolId);

					return foundRival ? foundRival.name : 'n/a';
				case EventHelper.clientEventTypeToServerClientTypeMapping['houses']:
					return rivals[1].name;
			}
		} else if(
			eventType === EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools'] &&
			participants.length === 0
		) {
			return rivals.find(rival => rival.id === event.invitedSchools[0].id).name;
		} else if (// if inter school event and participant[0] is our school
		participants.length > 1 &&
		eventType === EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools'] &&
		participants[0].schoolId !== self.activeSchoolId
		) {
			return rivals.find(rival => rival.id === participants[0].id).name;
		} else if (// if inter school event and participant[1] is our school
		participants.length > 1 &&
		eventType === EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools'] &&
		participants[1].schoolId !== self.activeSchoolId
		) {
			return rivals.find(rival => rival.id === participants[1].id).name;
		} else if(// if inter school event and opponent school is not yet accept invitation
		participants.length === 1 &&
		eventType === EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools']
		) {
			return rivals.find(rival => rival.id === event.invitedSchools[0].id).name;
		} else if (// if it isn't inter school event
		participants.length > 1 &&
		eventType !== EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools']
		) {
			return rivals.find(rival => rival.id === participants[1].id).name;
		} else if (
			(
				participants.length === 0 ||
				participants.length === 1
			) &&
			eventType !== EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools']
		) {
			return 'n/a';
		}
	},

	render: function () {
		const 	event 			= this.props.event,
				model			= this.props.model,
				onEventClick 	= this.props.onClick,
				activeSchoolId	= this.props.activeSchoolId;

		return (
			<div key={'event-' + event.id} className='eChallenge' onClick={() => onEventClick(event.id)}>
				<div className="eChallenge_sport"><SportIcon name={model.sport} className="bIcon_invites" /></div>
				<div className="eChallenge_date">{model.date}</div>

				<div className="eChallenge_name" title={model.name}>{model.name}</div>
				{this.renderGameTypeColumn(event, model)}
				<div className="eChallenge_score">
					{
						`${TeamHelper.callFunctionForLeftContext(
							activeSchoolId, event, this.getScore.bind(this, event)
						)}
										-
										${TeamHelper.callFunctionForRightContext(
							activeSchoolId, event, this.getScore.bind(this, event)
						)}`
					}
				</div>
			</div>
		);
	}

});


module.exports = ChallengeListItem;