const	If				= require('module/ui/if/if'),
		SVG				= require('module/ui/svg'),
		InvitesMixin	= require('module/as_manager/pages/invites/mixins/invites_mixin'),
		EventHelper		= require('module/helpers/eventHelper'),
		Sport			= require('module/ui/icons/sport_icon'),
		Morearty		= require('morearty'),
		Immutable		= require('immutable'),
		React			= require('react');

const EventRival = React.createClass({
	mixins: [Morearty.Mixin, InvitesMixin],
	getPic: function (order) {
		const	self = this,
				binding = self.getDefaultBinding(),
				eventType = binding.get('model.eventType'),
				participant = binding.sub(['teamsData', order]);
		let		pic = null;

		switch (eventType) {
			case EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools']:
				if(order === 0) {
					pic = binding.get('model.inviterSchool.pic');
				} else if(order === 1) {
					pic = binding.get('model.invitedSchools.0.pic');
				}
				break;
			case EventHelper.clientEventTypeToServerClientTypeMapping['houses']:
				pic = participant.get('house.pic');
				break;
		};

		return (
			eventType !== EventHelper.clientEventTypeToServerClientTypeMapping['internal'] ?
				pic !== undefined ?
					<img className="eEventRivals_pic"
						 src={pic}
						 alt={participant.get('name')}
						 title={participant.get('name')}
						/>
					:
					<div className="eEventRivals_text">{participant.get('name')}</div>
				: null
		);
	},
	getName: function (order) {
		const	self		= this,
				binding		= self.getDefaultBinding(),
				eventType	= binding.get('model.eventType'),
				participant	= binding.sub(['teamsData', order]);
		let		name		= null;

		switch (eventType) {
			case EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools']:
				if(order === 0) {
					name = binding.get('model.inviterSchool.name');
				} else if(order === 1) {
					name = binding.get('model.invitedSchools.0.name');
				}
				break;
			case EventHelper.clientEventTypeToServerClientTypeMapping['houses']:
				name = participant.get('house.name');
				break;
			case EventHelper.clientEventTypeToServerClientTypeMapping['internal']:
				name = participant.get('name');
				break;
		}

		return name;
	},
	getSportIcon:function(sport){
		return <Sport name={sport} className="bIcon_invites" />;
	},
	getCountPoint: function (order) {
		const	self	= this,
				binding	= self.getDefaultBinding();

		const	event	= binding.toJS('model');
		let		points	= 0;

		const currentTeamScoreData = event.results.teamScore.find(t => t.teamId === binding.toJS(`teamsData.${order}.id`));
		currentTeamScoreData && (points = currentTeamScoreData.score);

		const	mode	= binding.toJS('mode'),
				status	= binding.toJS('model.status');

		return (
			<div className="eEventResult_PointSideWrapper">
				<If condition={EventHelper.isShowScoreButtons(status, mode, true)}>
					<div className="eEventResult_SignContainer" onClick={self.handleClickPointSign.bind(self, "minus", order)}>
						<SVG classes={"eEventResult_Sign"} icon="icon_minus" />
					</div>
				</If>
				<div className="eEventResult_Point">{points}</div>
				<If condition={EventHelper.isShowScoreButtons(status, mode, true)}>
					<div className="eEventResult_SignContainer" onClick={self.handleClickPointSign.bind(self, "plus", order)}>
						<SVG classes={"eEventResult_Sign"} icon="icon_plus" />
					</div>
				</If>
			</div>
		);
	},
	/**
	 * Return TRUE if team has zero points in event
	 * @private
	 */
	_isTeamHaveZeroPoints: function(teamId, event, eventSummary) {
		return !eventSummary[teamId] && event.status === EventHelper.EVENT_STATUS.FINISHED;
	},
	handleClickPointSign: function(operation, order) {
		const	self	= this,
				binding	= self.getDefaultBinding();

		const	event	= binding.toJS('model'),
				teamId	= binding.toJS(`teamsData.${order}.id`);

		const teamScoreDataIndex = event.results.teamScore.findIndex(t => t.teamId === teamId);

		switch (operation) {
			case "plus":
				if(teamScoreDataIndex === -1) {
					event.results.teamScore.push({
						teamId:	teamId,
						score:	1
					})
				} else {
					event.results.teamScore[teamScoreDataIndex].score += 1;
				}
				break;
			case "minus":
				if(teamScoreDataIndex === -1) {
					event.results.teamScore.push({
						teamId:	teamId,
						score:	0
					})
				} else {
					event.results.teamScore[teamScoreDataIndex].score > 0 ?
						event.results.teamScore[teamScoreDataIndex].score -= 1 :
						event.results.teamScore[teamScoreDataIndex].score = 0;
				}
				break;
		};

		binding.set('model', Immutable.fromJS(event));
	},
	_renderTeamLeftSide: function() {
		const	self	= this,
				binding	= self.getDefaultBinding();

		const	eventType		= binding.get('model.eventType'),
				teamsData		= binding.toJS('teamsData'),
				activeSchoolId	= self.getActiveSchoolId();

		if(binding.toJS('model.sportModel.players') === "INDIVIDUAL") {
			return self._renderTeamByOrder(0);
		} else if(
			eventType === EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools'] &&
			teamsData[0].schoolId === activeSchoolId
		) {
			return self._renderTeamByOrder(0);
		} else if(
			eventType === EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools'] &&
			teamsData[1].schoolId === activeSchoolId
		) {
			return self._renderTeamByOrder(1);
		} else if(eventType !== EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools']) {
			return self._renderTeamByOrder(0);
		}
	},
	_renderTeamRightSide: function() {
		const	self	= this,
				binding	= self.getDefaultBinding();

		const	eventType		= binding.get('model.eventType'),
				teamsData	= binding.toJS('teamsData'),
				activeSchoolId	= self.getActiveSchoolId();

		if(binding.toJS('model.sportModel.players') === "INDIVIDUAL") {
			return self._renderTeamByOrder(1);
			// if inter school event and participant[0] is our school
		} else if (
			teamsData.length > 1 &&
			eventType === EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools'] &&
			teamsData[0].schoolId !== activeSchoolId
		) {
			return self._renderTeamByOrder(0);
		// if inter school event and participant[1] is our school
		} else if (
			teamsData.length > 1 &&
			eventType === EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools'] &&
			teamsData[1].schoolId !== activeSchoolId
		) {
			return self._renderTeamByOrder(1);
		// if inter school event and opponent school is not yet accept invitation
		} else if(
			teamsData.length === 1 &&
			eventType === EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools']
		) {
			return self._renderTeamByOrder(1);
		// if it isn't inter school event
		} else if (
			teamsData.length > 1 &&
			eventType !== EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools']
		) {
			return self._renderTeamByOrder(1);
		}
	},
	_renderTeamByOrder: function(order) {
		const self = this;

		return (
			<div className="bEventRival">
				<div className="eEventRival_rival">{self.getPic(order)}</div>
				<div className="eEventRival_name" title={self.getName(order)}>{self.getName(order)}</div>
			</div>
		);
	},
	_renderCountPointLeftSide: function() {
		const	self	= this,
				binding	= self.getDefaultBinding();

		const	eventType		= binding.get('model.eventType'),
				teamsData	= binding.toJS('teamsData'),
				activeSchoolId	= self.getActiveSchoolId();

		if(
			eventType === EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools'] &&
			teamsData[0].schoolId === activeSchoolId
		) {
			return self.getCountPoint(0);
		} else if(
			eventType === EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools'] &&
			teamsData[1].schoolId === activeSchoolId
		) {
			return self.getCountPoint(1);
		} else if(eventType !== EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools']) {
			return self.getCountPoint(0);
		}
	},
	_renderCountPointRightSide: function() {
		const	self	= this,
				binding	= self.getDefaultBinding();

		const	eventType		= binding.get('model.eventType'),
				teamsData	= binding.toJS('teamsData'),
				activeSchoolId	= self.getActiveSchoolId();

		if(
			eventType === EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools'] &&
			teamsData[0].schoolId !== activeSchoolId
		) {
			return self.getCountPoint(0);
		} else if (
			eventType === EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools'] &&
			teamsData[1].schoolId !== activeSchoolId
		) {
			return self.getCountPoint(1);
		} else if (
			eventType !== EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools']
		) {
			return self.getCountPoint(1);
		}
	},
	_renderPoints: function() {
		const	self	= this,
				binding	= self.getDefaultBinding();

		const	mode	= binding.toJS('mode'),
				status	= binding.toJS('model.status');

		if(EventHelper.isNotFinishedEvent(binding) && mode !== 'closing') {
			return (
				<div className="eEventResult_score">
					<div className="eEventResult_PointsWrapper">
						<span>-</span>
						<span className="eEventResult_colon"> : </span>
						<span>-</span>
					</div>
				</div>
			);
		} else if(status === "FINISHED" || mode === 'closing') {
			return (
				<div className="eEventResult_score">
					<div className="eEventResult_PointsWrapper">
						{self._renderCountPointLeftSide()}
						<div className="eEventResult_Colon"> : </div>
						{self._renderCountPointRightSide()}
					</div>
				</div>
			);
		}
	},
	render: function() {
		const	self	= this,
				binding	= self.getDefaultBinding();
		let		body	= null;

		const	rivals		= binding.get('rivals'),
				sportName	= binding.get('sport.name'),
				sportIcon	= self.getSportIcon(sportName),
				event		= binding.toJS('model'),
				eventType	= EventHelper.serverEventTypeToClientEventTypeMapping[event.eventType];

		const isEventWithOneIndividualTeam	= EventHelper.isEventWithOneIndividualTeam(event);

		if(isEventWithOneIndividualTeam) {
			body = (
				<div className="bEventInfo">
					<div className="eEventInfo_InfoContainer">
						<div className="eEventInfo_SportInfo">
							<div className="eEventSport_icon">{sportIcon}</div>
							<div className="eEventSport_name mBig">{sportName}</div>
						</div>
						<div className="eEventInfo_EventTypeInfo">
							{eventType}
						</div>
					</div>
				</div>
			);
		} else {
			body = (
				<div className="bEventInfo">
					<div className="bEventRivals">
						{self._renderTeamLeftSide()}
						<div className="bEventResult">
							{self._renderPoints()}
							<div className="eEventSport">
								<span className="eEventSport_icon">{sportIcon}</span>
								<span className="eEventSport_name">{sportName}</span>
							</div>
						</div>
						{self._renderTeamRightSide()}
					</div>
					<div className="eEventInfo_type">
						{eventType}
					</div>
				</div>
			);
		}

		return body;
	}
});


module.exports = EventRival;
