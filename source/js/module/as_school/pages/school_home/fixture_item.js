/**
 * Created by wert on 06.09.16.
 */

const 	React 			= require('react'),
		DateTimeMixin	= require('module/mixins/datetime'),
		EventHelper		= require('module/helpers/eventHelper'),
		SportIcon		= require('module/ui/icons/sport_icon');

const FixtureItem = React.createClass({

	mixins: [DateTimeMixin],

	propTypes: {
		event:			React.PropTypes.any.isRequired,
		activeSchoolId: React.PropTypes.string.isRequired
	},

	getFixtureInfo: function(event) {
		return(
			<div>
				<div className="bFix_date">{`${this.getDateFromIso(event.startTime)} ${this.getTimeFromIso(event.startTime)}`}</div>
				<div className="bFix_name">{event.name}</div>
				<div className="bFix_type">{EventHelper.serverEventTypeToClientEventTypeMapping[event.eventType]}</div>
			</div>
		)
	},

	_renderTeamLeftSide: function(event) {
		const 	activeSchoolId	= this.props.activeSchoolId,
				eventType		= event.eventType,
				participants	= event.participants;

		if(
			eventType === EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools'] &&
			participants[0].schoolId === activeSchoolId
		) {
			return (
				<div className="bFixtureOpponent bFixture_item no-margin">
					{this.getParticipantEmblem(event.participants[0], event.eventType)}
				</div>
			);
		} else if(
			eventType === EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools'] &&
			participants[1].schoolId === activeSchoolId
		) {
			return (
				<div className="bFixtureOpponent bFixture_item no-margin">
					{this.getParticipantEmblem(event.participants[1], event.eventType)}
				</div>
			);
		} else if(eventType !== EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools']) {
			return (
				<div className="bFixtureOpponent bFixture_item no-margin">
					{this.getParticipantEmblem(event.participants[0], event.eventType)}
				</div>
			);
		}
	},
	_renderTeamRightSide: function(event) {
		const 	activeSchoolId	= this.props.activeSchoolId,
				eventType		= event.eventType,
				participants	= event.participants;

		// if inter school event and participant[0] is our school
		if (
			participants.length > 1 &&
			eventType === EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools'] &&
			participants[0].schoolId !== activeSchoolId
		) {
			return (
				<div className="bFixtureOpponent bFixture_item no-margin">
					{this.getParticipantEmblem(event.participants[0], event.eventType)}
				</div>
			);
			// if inter school event and participant[1] is our school
		} else if (
			participants.length > 1 &&
			eventType === EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools'] &&
			participants[1].schoolId !== activeSchoolId
		) {
			return (
				<div className="bFixtureOpponent bFixture_item no-margin">
					{this.getParticipantEmblem(event.participants[1], event.eventType)}
				</div>
			);
			// if it isn't inter school event
		} else if (
			participants.length > 1 &&
			eventType !== EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools']
		) {
			return (
				<div className="bFixtureOpponent bFixture_item no-margin">
					{this.getParticipantEmblem(event.participants[1], event.eventType)}
				</div>
			);
		}
	},

	getParticipantEmblem: function(participant, type){
		const 	activeSchoolId		= this.props.activeSchoolId;
		let		participantEmblem	= '';

		if(typeof participant !== 'undefined'){
			switch(type) {
				case EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools']:
					let teamName;

					if(activeSchoolId == participant.school.id) {
						teamName = participant.name;
					} else {
						teamName = participant.school.name;
					}

					participantEmblem = (
						<div>
							<img src={participant.school.pic}/>
							<span>{teamName}</span>
						</div>
					);
					break;
				case EventHelper.clientEventTypeToServerClientTypeMapping['houses']:
					participantEmblem = (
						<div>
							<img src={participant.school.pic}/>
							<span>{participant.house.name}</span>
						</div>
					);
					break;
				case EventHelper.clientEventTypeToServerClientTypeMapping['internal']:
					participantEmblem = (
						<div>
							<img src={participant.school.pic}/>
							<span>{participant.name}</span>
						</div>
					);
					break;
			}
		}

		return participantEmblem;
	},

	getFixtureResults:function(event) {
		let	firstPoint	= "?",
			secondPoint	= "?";

		if(typeof event.result !== 'undefined' && event.status === EventHelper.EVENT_STATUS.FINISHED){
			const eventSummary = EventHelper.getTeamsSummaryByEventResult(event.result);

			firstPoint	= this._getLeftPoint(event, eventSummary);
			secondPoint	= this._getRightPoint(event, eventSummary);
		} else if (typeof event.result === 'undefined' && event.status === EventHelper.EVENT_STATUS.FINISHED) {
			// if result === undef, but event is finished, then result of event is 0:0
			// because teams doesn't have points
			firstPoint = "0";
			secondPoint  = "0";
		}

		return (
			<div>
				<div className="bFix_scoreText">{'Score'}</div>
				<div className="bFix_scoreResult">{`${firstPoint} : ${secondPoint}`}</div>
			</div>
		);
	},

	_getLeftPoint: function(event, eventSummary) {
		const 	activeSchoolId	= this.props.activeSchoolId,
				eventType		= event.eventType,
				participants	= event.participants;

		if(
			eventType === EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools'] &&
			participants[0].schoolId === activeSchoolId
		) {
			return eventSummary[event.participants[0].id] !== undefined ? eventSummary[event.participants[0].id] : 0
		} else if(
			eventType === EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools'] &&
			participants[1].schoolId === activeSchoolId
		) {
			return eventSummary[event.participants[1].id] !== undefined ? eventSummary[event.participants[1].id] : 0
		} else if(eventType !== EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools']) {
			return eventSummary[event.participants[0].id] !== undefined ? eventSummary[event.participants[0].id] : 0
		}
	},
	_getRightPoint: function(event, eventSummary) {
		const 	activeSchoolId	= this.props.activeSchoolId,
				eventType		= event.eventType,
				participants	= event.participants;

		// if inter school event and participant[0] is our school
		if (
			participants.length > 1 &&
			eventType === EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools'] &&
			participants[0].schoolId !== activeSchoolId
		) {
			return eventSummary[event.participants[0].id] !== undefined ? eventSummary[event.participants[0].id] : 0
			// if inter school event and participant[1] is our school
		} else if (
			participants.length > 1 &&
			eventType === EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools'] &&
			participants[1].schoolId !== activeSchoolId
		) {
			return eventSummary[event.participants[1].id] !== undefined ? eventSummary[event.participants[1].id] : 0
			// if it isn't inter school event
		} else if (
			participants.length > 1 &&
			eventType !== EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools']
		) {
			return eventSummary[event.participants[1].id] !== undefined ? eventSummary[event.participants[1].id] : 0
		}
	},

	render: function() {
		const 	event 		= this.props.event,
				sportName	= event.sport.name;

		return (
			<div className="bFixtureContainer">
				<div className="bFixtureIcon bFixture_item">
					<SportIcon name={sportName || ''} className="bIcon_mSport" />
				</div>
				<div className="bFixtureInfo bFixture_item">
					{this.getFixtureInfo(event)}
				</div>
				{this._renderTeamLeftSide(event)}
				<div className="bFixtureResult bFixture_item no-margin">
					{this.getFixtureResults(event)}
				</div>
				{this._renderTeamRightSide(event)}
			</div>
		)
	}
});

module.exports = FixtureItem;