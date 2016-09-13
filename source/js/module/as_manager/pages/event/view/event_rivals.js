const	EventHelper		= require('module/helpers/eventHelper'),
		TeamHelper		= require('./../../../../ui/managers/helpers/team_helper'),
		Sport			= require('module/ui/icons/sport_icon'),
		Score			= require('./../../../../ui/score/score'),
		Morearty		= require('morearty'),
		MoreartyHelper	= require('module/helpers/morearty_helper'),
		Immutable		= require('immutable'),
		React			= require('react');

const EventRival = React.createClass({
	mixins: [Morearty.Mixin],
	getPic: function (order) {
		const	self = this,
				binding = self.getDefaultBinding();

		const	event		= binding.toJS('model'),
				eventType	= event.eventType,
				teamsData	= event.teamsData;

		let team, pic;

		switch (eventType) {
			case EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools']:
				let school;
				switch (order) {
					case 0:
						school = binding.toJS('model.inviterSchool.id') === MoreartyHelper.getActiveSchoolId(self) ?
							binding.toJS('model.inviterSchool') :
							binding.toJS('model.invitedSchools.0');
						break;
					case 1:
						school = binding.toJS('model.inviterSchool.id') !== MoreartyHelper.getActiveSchoolId(self) ?
							binding.toJS('model.inviterSchool') :
							binding.toJS('model.invitedSchools.0');
						break;
				}

				pic = school.pic;
				team = teamsData.find(t => t.schoolId === school.id);
			break;
			case EventHelper.clientEventTypeToServerClientTypeMapping['houses']:
				pic = event.housesData[order].pic;
				team = teamsData.find(t => t.houseId === event.housesData[order].id);
			break;
		};

		if(typeof pic !== 'undefined') {
			return (
				<img	className="eEventRivals_pic"
						src={pic}
				/>
			);
		} else if(typeof team !== 'undefined') {
			return (
				<div className="eEventRivals_text">{team.name}</div>
			);
		} else {
			return null;
		}
	},
	getName: function (order) {
		const	self		= this,
				binding		= self.getDefaultBinding(),
				event		= binding.toJS('model'),
				eventType	= event.eventType;
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
					name = event.housesData[order].name ;
				}
				break;
			case EventHelper.clientEventTypeToServerClientTypeMapping['internal']:
				name = event.teamsData[order] ? event.teamsData[order].name : null;
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
	/** click handler on the '+' and '-' for result settings*/
	handleClickPointSign: function(teamBundleName, order, operation, pointType) {
		const	self	= this,
				binding	= self.getDefaultBinding();

		const 	event 		= binding.toJS('model'),
				pointsStep	= event.sport.points.pointsStep;
		let scoreData;
		if(TeamHelper.isTeamSport(event) || TeamHelper.isOneOnOneSport(event)) {
			/** get the correct object(scoreData) to store the result of the game */
			switch (teamBundleName) {
				case 'schoolsData':
					scoreData = self.getSchoolScoreData(event, order);
					break;
				case 'housesData':
					scoreData = self.getHouseScoreData(event, order);
					break;
				case 'teamsData':
					scoreData = self.getTeamScoreData(event, order);
					break;
				case 'individualsData':
					scoreData = self.getIndividualScoreData(event, order);
					break;
			}

			/** set score */
			scoreData.score = TeamHelper.operationByType(operation, scoreData.score, pointType, pointsStep);
			binding.set('model', Immutable.fromJS(event));
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
				<Score	isChangeMode			={teamBundleName !== 'teamsData' && EventHelper.isShowScoreButtons(event, mode, true)}
						plainPoints				={points}
						pointsType				={event.sport.points.display}
						handleClickPointSign	={self.handleClickPointSign.bind(self, teamBundleName, order)}
				/>
			</div>
		);
	},
	getTeamScoreData: function(event, order) {
		const	self	= this,
				binding	= self.getDefaultBinding();

		const	teamId	= binding.toJS(`model.teamsData.${order}.id`);

		let scoreData = event.results.teamScore.find(t => t.teamId === teamId);
		if(!scoreData) {
			scoreData = {
				teamId:	teamId,
				score:	0
			};
			event.results.teamScore.push(scoreData);
		}
		return scoreData;
	},
	getSchoolScoreData: function(event, order) {
		const	self	= this,
				binding	= self.getDefaultBinding();

		const	currentSchoolId	= binding.toJS(`schoolsData.${order}.id`);

		let scoreData= event.results.schoolScore.find(s => s.schoolId === currentSchoolId);

		if(!scoreData) {
			scoreData = {
				schoolId:	currentSchoolId,
				score:		0
			};
			event.results.schoolScore.push(scoreData);
		}
		return scoreData;
	},
	getHouseScoreData: function(event, order) {
		const	self	= this,
				binding	= self.getDefaultBinding();

		const	currentHouseId = binding.toJS(`housesData.${order}.id`);

		let scoreData= event.results.houseScore.find(s => s.houseId === currentHouseId);

		if(!scoreData) {
			scoreData = {
				houseId:	currentHouseId,
				score:		0
			};
			event.results.houseScore.push(scoreData);
		}
		return scoreData;
	},
	getIndividualScoreData: function(event, order) {
		const	currentPlayer = event.individualsData[order];
		let scoreData = event.results.individualScore.find(s => s.userId === currentPlayer.userId);

		if(!scoreData) {
			scoreData = {
				userId:			currentPlayer.userId,
				permissionId:	currentPlayer.permissionId,
				score:			0
			};
			event.results.individualScore.push(scoreData);
		}
		return scoreData;
	},
	_renderTeamLeftSide: function() {
		const	self	= this,
				binding	= self.getDefaultBinding();

		const	eventType		= binding.get('model.eventType'),
				teamsData		= binding.toJS('model.teamsData'),
				activeSchoolId	= MoreartyHelper.getActiveSchoolId(self);

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

		const	eventType	= binding.get('model.eventType'),
				teamsData	= binding.toJS('model.teamsData');

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

		return TeamHelper.callFunctionForLeftContext(activeSchoolId, event, self.renderCountPoints);
	},
	renderCountPointRightSide: function() {
		const	self	= this,
				binding	= self.getDefaultBinding();

		const	activeSchoolId	= MoreartyHelper.getActiveSchoolId(self),
				event			= binding.toJS('model');

		return TeamHelper.callFunctionForRightContext(activeSchoolId, event, self.renderCountPoints);
	},
	_renderPoints: function() {
		const	self	= this,
				binding	= self.getDefaultBinding();

		const	event	= binding.toJS('model'),
				mode	= binding.toJS('mode'),
				status	= binding.toJS('model.status');

		if(TeamHelper.isTeamSport(event) || TeamHelper.isOneOnOneSport(event)) {
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
					{self._renderPoints()}
				</div>
			);
		}

		return body;
	}
});


module.exports = EventRival;
