const	If				= require('module/ui/if/if'),
		SVG				= require('module/ui/svg'),
		InvitesMixin	= require('module/as_manager/pages/invites/mixins/invites_mixin'),
		EventHelper		= require('module/helpers/eventHelper'),
		TeamHelper		= require('./../../../../ui/managers/helpers/team_helper'),
		Sport			= require('module/ui/icons/sport_icon'),
		Morearty		= require('morearty'),
		MoreartyHelper	= require('module/helpers/morearty_helper'),
		Immutable		= require('immutable'),
		React			= require('react');

const EventRival = React.createClass({
	mixins: [Morearty.Mixin, InvitesMixin],
	getPic: function (order) {
		const	self = this,
				binding = self.getDefaultBinding();

		const	event		= binding.toJS('model'),
				eventType	= event.eventType,
				participant	= binding.sub(['teamsData', order]);
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
				if(TeamHelper.isNonTeamSport(event)) {
					pic = event.housesData[order].pic;
				} else {
					pic = participant.get('house.pic') ? participant.get('house.pic') : event.housesData[order].pic;
				}
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
				event		= binding.toJS('model'),
				eventType	= event.eventType,
				participant	= binding.sub(['teamsData', order]);
		let		name		= null;

		const activeSchoolId = MoreartyHelper.getActiveSchoolId(self);

		switch (eventType) {
			case EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools']:
				const	inviterSchool = binding.toJS('model.inviterSchool'),
						invitedSchool = binding.toJS('model.invitedSchools.0');

				if(order === 0) {
					name = inviterSchool.id === activeSchoolId ?
						inviterSchool.name :
						invitedSchool.name;
				} else if(order === 1) {
					name = inviterSchool.id !== activeSchoolId ?
						inviterSchool.name :
						invitedSchool.name;
				}
				break;
			case EventHelper.clientEventTypeToServerClientTypeMapping['houses']:
				if(TeamHelper.isNonTeamSport(event)) {
					name = event.housesData[order].name;
				} else {
					name = participant.toJS('house.name') ? participant.toJS('house.name') : event.housesData[order].name;
				}
				break;
			case EventHelper.clientEventTypeToServerClientTypeMapping['internal']:
				name = participant.get('name');
				break;
		}

		return name;
	},
	getSportIcon:function(sport) {
		return <Sport name={sport} className="bIcon_invites" />;
	},
	/**
	 * Return TRUE if team has zero points in event
	 * @private
	 */
	_isTeamHaveZeroPoints: function(teamId, event, eventSummary) {
		return !eventSummary[teamId] && event.status === EventHelper.EVENT_STATUS.FINISHED;
	},
	handleClickPointSign: function(operation, teamBundleName, order) {
		const	self	= this,
				binding	= self.getDefaultBinding();

		const event = binding.toJS('model');

		if(TeamHelper.isTeamSport(event)) {
			switch (teamBundleName) {
				case 'schoolsData':
					self.changeSchoolPoints(operation, order);
					break;
				case 'housesData':
					self.changeHousesPoints(operation, order);
					break;
				case 'teamsData':
					self.changeTeamPoints(operation, order);
					break;
			}
		}
	},
	renderCountPoints: function (teamBundleName, order) {
		const	self	= this,
				binding	= self.getDefaultBinding();

		const	event	= binding.toJS('model'),
				points	= TeamHelper.getCountPoints(event, teamBundleName, order);

		const	mode	= binding.toJS('mode'),
				status	= binding.toJS('model.status');

		return (
			<div className="eEventResult_PointSideWrapper">
				<If condition={EventHelper.isShowScoreButtons(status, mode, true)}>
					<div className="eEventResult_SignContainer" onClick={self.handleClickPointSign.bind(self, "minus", teamBundleName, order)}>
						<SVG classes={"eEventResult_Sign"} icon="icon_minus" />
					</div>
				</If>

				<div className="eEventResult_Point">{points}</div>

				<If condition={EventHelper.isShowScoreButtons(status, mode, true)}>
					<div className="eEventResult_SignContainer" onClick={self.handleClickPointSign.bind(self, "plus", teamBundleName, order)}>
						<SVG classes={"eEventResult_Sign"} icon="icon_plus" />
					</div>
				</If>
			</div>
		);
	},
	changeTeamPoints: function(operation, order) {
		const	self	= this,
				binding	= self.getDefaultBinding();

		const	event				= binding.toJS('model'),
				teamId				= binding.toJS(`teamsData.${order}.id`),
				teamScoreDataIndex	= event.results.teamScore.findIndex(t => t.teamId === teamId);

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
	changeSchoolPoints: function(operation, order) {
		const	self	= this,
				binding	= self.getDefaultBinding();

		const	event					= binding.toJS('model'),
				currentSchoolId			= binding.toJS(`schoolsData.${order}.id`),
				schoolScoreDataIndex	= event.results.schoolScore.findIndex(s => s.schoolId === currentSchoolId);

		switch (operation) {
			case "plus":
				if(schoolScoreDataIndex === -1) {
					event.results.schoolScore.push({
						schoolId:	currentSchoolId,
						score:		1
					});
				} else {
					event.results.schoolScore[schoolScoreDataIndex].score += 1;
				}
				break;
			case "minus":
				if(schoolScoreDataIndex === -1) {
					event.results.schoolScore.push({
						schoolId:	currentSchoolId,
						score:		0
					})
				} else {
					event.results.schoolScore[schoolScoreDataIndex].score > 0 ?
						event.results.schoolScore[schoolScoreDataIndex].score -= 1 :
						event.results.schoolScore[schoolScoreDataIndex].score = 0;
				}
				break;
		};

		binding.set('model', Immutable.fromJS(event));
	},
	changeHousesPoints: function(operation, order) {
		const	self	= this,
				binding	= self.getDefaultBinding();

		const	event					= binding.toJS('model'),
				currentHouseId			= binding.toJS(`housesData.${order}.id`),
				housesScoreDataIndex	= event.results.housesScore.findIndex(s => s.housesId === currentHouseId);

		switch (operation) {
			case "plus":
				if(housesScoreDataIndex === -1) {
					event.results.housesScore.push({
						schoolId:	currentHouseId,
						score:		1
					});
				} else {
					event.results.housesScore[housesScoreDataIndex].score += 1;
				}
				break;
			case "minus":
				if(housesScoreDataIndex === -1) {
					event.results.housesScore.push({
						schoolId:	currentHouseId,
						score:		0
					})
				} else {
					event.results.housesScore[housesScoreDataIndex].score > 0 ?
						event.results.housesScore[housesScoreDataIndex].score -= 1 :
						event.results.housesScore[housesScoreDataIndex].score = 0;
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

		if(TeamHelper.isNonTeamSport(binding.toJS('model'))) {
			return self._renderTeamByOrder(0);
		} else if(
			eventType === EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools'] &&
			teamsData.length === 0
		) {
			return self._renderTeamByOrder(0);
		} else if(
			eventType === EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools'] &&
			teamsData[0].schoolId === activeSchoolId
		) {
			return self._renderTeamByOrder(0);
		} else if(
			eventType === EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools'] &&
			teamsData[0].schoolId !== activeSchoolId
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
				teamsData		= binding.toJS('teamsData'),
				activeSchoolId	= self.getActiveSchoolId();

		if(TeamHelper.isNonTeamSport(binding.toJS('model'))) {
			return self._renderTeamByOrder(1);
		} else if (
			// if inter school event and participant[0] is our school
			teamsData.length > 1 &&
			eventType === EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools']
		) {
			return self._renderTeamByOrder(1);
		} else if(
			// if inter school event and opponent school is not yet accept invitation
			teamsData.length === 1 &&
			eventType === EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools']
		) {
			return self._renderTeamByOrder(1);
		} else {
			// if it isn't inter school event
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
	renderCountPointLeftSide: function() {
		const	self	= this,
				binding	= self.getDefaultBinding();

		const	activeSchoolId	= MoreartyHelper.getActiveSchoolId(self),
				event			= binding.toJS('model');

		return TeamHelper.callFunctionForLeftContext(activeSchoolId, event, self.renderCountPoints.bind(self));
	},
	renderCountPointRightSide: function() {
		const	self	= this,
				binding	= self.getDefaultBinding();

		const	activeSchoolId	= MoreartyHelper.getActiveSchoolId(self),
				event			= binding.toJS('model');

		return TeamHelper.callFunctionForRightContext(activeSchoolId, event, self.renderCountPoints.bind(self));
	},
	_renderPoints: function() {
		const	self	= this,
				binding	= self.getDefaultBinding();

		const	event	= binding.toJS('model'),
				mode	= binding.toJS('mode'),
				status	= binding.toJS('model.status');

		if(!TeamHelper.isNonTeamSport(event)) {
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
							{self.renderCountPointLeftSide()}
							<div className="eEventResult_Colon"> : </div>
							{self.renderCountPointRightSide()}
						</div>
					</div>
				);
			}
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
