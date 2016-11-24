const	EventHelper		= require('module/helpers/eventHelper'),
		TeamHelper		= require('./../../../../ui/managers/helpers/team_helper'),
		Sport			= require('module/ui/icons/sport_icon'),
		Score			= require('./../../../../ui/score/score'),
		ScoreConsts		= require('./../../../../ui/score/score_consts'),
		Morearty		= require('morearty'),
		MoreartyHelper	= require('module/helpers/morearty_helper'),
		Immutable		= require('immutable'),
		React			= require('react'),

		classNames		= require('classnames');

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
				const house = event.housesData[order];
				team = teamsData.find(t => house && house.id === t.houseId);
			break;
		};

		if(typeof pic !== 'undefined') {
			return (
				<img	className="eEventRivals_logoPic"
						src={pic}
				/>
			);
		} else {
			return null;
		}
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
	handleChangeScore: function(teamBundleName, order, score) {
		const	self	= this,
				binding	= self.getDefaultBinding();

		const 	event 	= binding.toJS('model');

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

			if(scoreData.teamId){
				TeamHelper.clearIndividualScore(event, scoreData.teamId)
			}

			/** set score */
			scoreData.score = score.value;
			scoreData.isValid = score.isValid;
			binding.set('model', Immutable.fromJS(event));
		}
	},
	renderCountPoints: function (teamBundleName, order, individualScoreAvailable) {
		const	self	= this,
				binding	= self.getDefaultBinding();

		const	event	= binding.toJS('model'),
				points	= TeamHelper.getCountPoints(event, teamBundleName, order);

		const	mode						= binding.toJS('mode'),
				status						= binding.toJS('model.status'),
				isa 						= !individualScoreAvailable || teamBundleName != 'teamsData';

		return (
			<div className="eEventResult_PointSideWrapper">
				<Score	isChangeMode	= {EventHelper.isShowScoreButtons(event, mode, true, isa)}
						plainPoints		= {points}
						pointsStep		= {event.sport.points.pointsStep}
						pointsType		= {event.sport.points.display}
						pointsMask		= {event.sport.points.inputMask}
						onChange		= {self.handleChangeScore.bind(self, teamBundleName, order)}
						modeView		= {ScoreConsts.SCORE_MODES_VIEW.BIG}
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

		const	currentSchoolId	= binding.toJS(`model.schoolsData.${order}.id`);

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

		const	currentHouseId = binding.toJS(`model.housesData.${order}.id`);

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
		const	currentPlayer	= event.individualsData[order];
		let		scoreData		= event.results.individualScore.find(s => s.userId === currentPlayer.userId);

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

	getTeamNameForInterSchoolsGameByOrder: function(order) {
		const	self		= this,
				binding		= self.getDefaultBinding();

		const	event		= binding.toJS('model');
		let		name		= undefined;

		const activeSchoolId = MoreartyHelper.getActiveSchoolId(self);

		if(order === 0) {
			const foundTeam = event.teamsData.find(t => t.schoolId === activeSchoolId);

			typeof foundTeam !== 'undefined' && (name = foundTeam.name);
		} else if(order === 1) {
			const foundTeam = event.teamsData.find(t => t.schoolId !== activeSchoolId);

			typeof foundTeam !== 'undefined' && (name = foundTeam.name);
		}

		return name;
	},
	getTeamNameForHousesGameByOrder: function(order) {
		const	binding	= this.getDefaultBinding();

		const	event	= binding.toJS('model');

		const	house	= event.housesData[order],
				team	= event.teamsData.find(t => house && house.id === t.houseId);

		if(typeof team !== 'undefined') {
			return team.name;
		} else {
			return undefined;
		}
	},
	getTeamNameForInternalGameByOrder: function(order) {
		const	binding	= this.getDefaultBinding();

		const	event	= binding.toJS('model');

		return event.teamsData[order] ? event.teamsData[order].name : undefined;
	},

	getTeamName: function(order) {
		const event = this.getDefaultBinding().toJS('model');

		switch (true) {
			case EventHelper.isInterSchoolsEvent(event):
				return this.getTeamNameForInterSchoolsGameByOrder(order);
			case EventHelper.isHousesEvent(event):
				return this.getTeamNameForHousesGameByOrder(order);
			case EventHelper.isInternalEvent(event):
				return this.getTeamNameForInternalGameByOrder(order);
		}
	},
	getAdditionalName: function (order) {
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
				name = event.housesData[order] && event.housesData[order].name;
				break;
			case EventHelper.clientEventTypeToServerClientTypeMapping['internal']:
				return undefined;
		}

		return name;
	},
	getRivalNameByOrder: function(order) {
		const	teamName		= this.getTeamName(order),
				additionalName	= this.getAdditionalName(order);

		switch (true) {
			case typeof teamName === "undefined":
				return additionalName;
			case typeof additionalName === "undefined":
				return teamName;
			default:
				return `${teamName} (${additionalName})`;
		}
	},

	renderCountPointLeftSide: function() {
		const	binding	= this.getDefaultBinding();

		const	activeSchoolId				= MoreartyHelper.getActiveSchoolId(this),
				individualScoreAvailable 	= binding.toJS('individualScoreAvailable.0.value'),
				event						= binding.toJS('model'),
				params 						= TeamHelper.getParametersForLeftContext(activeSchoolId, event);

		return this.renderCountPoints(params.bundleName, params.order, individualScoreAvailable);
	},
	renderCountPointRightSide: function() {
		const	binding	= this.getDefaultBinding();

		const	activeSchoolId				= MoreartyHelper.getActiveSchoolId(this),
				individualScoreAvailable 	= binding.toJS('individualScoreAvailable.1.value'),
				event						= binding.toJS('model'),
				params 						= TeamHelper.getParametersForRightContext(activeSchoolId, event);

		return this.renderCountPoints(params.bundleName, params.order, individualScoreAvailable);
	},
	renderCountPointsByOrder: function(order) {
		switch (order) {
			case 0:
				return this.renderCountPointLeftSide();
			case 1:
				return this.renderCountPointRightSide();
		}
	},
	_renderPoints: function(order) {
		const	self	= this,
				binding	= self.getDefaultBinding();

		const	event	= binding.toJS('model'),
				mode	= binding.toJS('mode'),
				status	= binding.toJS('model.status');

		if(TeamHelper.isTeamSport(event) || TeamHelper.isOneOnOneSport(event)) {
			if(EventHelper.isNotFinishedEvent(binding) && mode !== 'closing') {
				return (
					<div className="eEventRival_score">
					</div>
				);
			} else if(status === "FINISHED" || mode === 'closing') {
				return (
					<div className="eEventRival_score">
						{ this.renderCountPointsByOrder(order) }
					</div>
				);
			}
		}
	},
	_renderTeamByOrder: function(order) {
		const eventRivalClassName = classNames({
			"bEventRival":	true,
			"mRight":		order === 1
		});

		return (
			<div className={eventRivalClassName}>
				<div className="eEventRival_logo">{ this.getPic(order) }</div>
				<div className="eEventRival_rivalName">{ this.getRivalNameByOrder(order) }</div>
				{ this._renderPoints(order) }
			</div>
		);
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
	render: function() {
		const	self	= this,
				binding	= self.getDefaultBinding();
		let		body	= null;

		const	event	= binding.toJS('model');

		const isEventWithOneIndividualTeam	= EventHelper.isEventWithOneIndividualTeam(event);

		if(!isEventWithOneIndividualTeam) {
			body = (
				<div className="bEventInfo">
					<div className="bEventRivals">
						{self._renderTeamLeftSide()}
						{self._renderTeamRightSide()}
					</div>
				</div>
			);
		} else {
			body = null;
		}

		return body;
	}
});

module.exports = EventRival;