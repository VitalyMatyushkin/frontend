const	If					= require('module/ui/if/if'),
		SVG					= require('module/ui/svg'),
		InvitesMixin 		= require('module/as_manager/pages/invites/mixins/invites_mixin'),
		EventHelper			= require('module/helpers/eventHelper'),
		TeamHelper			= require('module/ui/managers/helpers/team_helper'),
		React				= require('react'),
		Immutable			= require('immutable'),
		Morearty			= require('morearty');

const EventTeamsView = React.createClass({
	mixins: [Morearty.Mixin, InvitesMixin],
	getPlainPointsByStudent: function(userId) {
		const self = this;

		const event = self.getBinding('event').toJS();

		const userScoreDataIndex = event.results.individualScore.findIndex(userScoreData => userScoreData.userId === userId);

		return  userScoreDataIndex === -1 ? 0 : event.results.individualScore[userScoreDataIndex].score;
	},
	getPointsByStudent: function(userId) {
		const self = this;

		const	sport		= self.getBinding('event').toJS('sport'),
				plainPoints	= self.getPlainPointsByStudent(userId);
		let		viewPoints;

		switch (sport.points.display) {
			case 'PLAIN':
				viewPoints = plainPoints;
				break;
			case 'TIME':
				viewPoints = self.getTimePoints(plainPoints);
				break;
			case 'DISTANCE':
				viewPoints = self.getDistancePoints(plainPoints);
				break;
		}

		return viewPoints;
	},
	renderPlayersPointsWithScore: function(player, pointsType) {
		const self = this;

		switch (pointsType) {
			case 'PLAIN':
				return self.renderPlayerPlainPoints(player);
			case 'TIME':
				return self.renderPlayerTimePoints(player);
			case 'DISTANCE':
				return self.renderPlayerDistancePoints(player);
		}
	},
	renderPlayerPlainPoints: function(player) {
		const self = this;

		const plainPoints = self.getPlainPointsByStudent(player.id);

		return (
			<span>
				<span className="ePlayer_minus" onClick={self.handleClickPointSign.bind(self, 'minus', 'plain', player.id, player.permissionId, player.teamId)}>
					<SVG icon="icon_minus" />
				</span>
					<span className="ePlayer_score">{plainPoints}</span>
				<span className="ePlayer_plus" onClick={self.handleClickPointSign.bind(self, 'plus', 'plain', player.id, player.permissionId, player.teamId)}>
					<SVG icon="icon_plus" />
				</span>
			</span>
		);
	},
	renderPlayerTimePoints: function(player) {
		const self = this;

		const plainPoints = self.getPlainPointsByStudent(player.id);

		const	hour	= Math.floor(plainPoints / 3600),
				min		= Math.floor((plainPoints - hour * 3600) / 60),
				sec		= plainPoints - hour * 3600 - min * 60;

		return (
			<span>
					<span className="ePlayer_minus" onClick={self.handleClickPointSign.bind(self, 'minus', 'h', player.id, player.permissionId, player.teamId)}>
						<SVG icon="icon_minus" />
					</span>
						<span className="ePlayer_score">{`${hour}h`}</span>
					<span className="ePlayer_plus" onClick={self.handleClickPointSign.bind(self, 'plus', 'h', player.id, player.permissionId, player.teamId)}>
						<SVG icon="icon_plus" />
					</span>
					<span className="ePlayer_minus" onClick={self.handleClickPointSign.bind(self, 'minus', 'min', player.id, player.permissionId, player.teamId)}>
						<SVG icon="icon_minus" />
					</span>
						<span className="ePlayer_score">{`${min}min`}</span>
					<span className="ePlayer_plus" onClick={self.handleClickPointSign.bind(self, 'plus', 'min', player.id, player.permissionId, player.teamId)}>
						<SVG icon="icon_plus" />
					</span>
					<span className="ePlayer_minus" onClick={self.handleClickPointSign.bind(self, 'minus', 'sec', player.id, player.permissionId, player.teamId)}>
						<SVG icon="icon_minus" />
					</span>
						<span className="ePlayer_score">{`${sec}sec`}</span>
					<span className="ePlayer_plus" onClick={self.handleClickPointSign.bind(self, 'plus', 'sec', player.id, player.permissionId, player.teamId)}>
						<SVG icon="icon_plus" />
					</span>
				</span>
		);
	},
	renderPlayerDistancePoints: function(player) {
		const self = this;

		const plainPoints = self.getPlainPointsByStudent(player.id);

		const	km	= Math.floor(plainPoints / 10000),
				m	= Math.floor((plainPoints - km * 10000) / 100),
				cm	= plainPoints - km * 10000 - m * 100;

		return (
			<span>
					<span className="ePlayer_minus" onClick={self.handleClickPointSign.bind(self, 'minus', 'km', player.id, player.permissionId, player.teamId)}>
						<SVG icon="icon_minus" />
					</span>
						<span className="ePlayer_score">{`${km}km`}</span>
					<span className="ePlayer_plus" onClick={self.handleClickPointSign.bind(self, 'plus', 'km', player.id, player.permissionId, player.teamId)}>
						<SVG icon="icon_plus" />
					</span>
					<span className="ePlayer_minus" onClick={self.handleClickPointSign.bind(self, 'minus', 'm', player.id, player.permissionId, player.teamId)}>
						<SVG icon="icon_minus" />
					</span>
						<span className="ePlayer_score">{`${m}m`}</span>
					<span className="ePlayer_plus" onClick={self.handleClickPointSign.bind(self, 'plus', 'm', player.id, player.permissionId, player.teamId)}>
						<SVG icon="icon_plus" />
					</span>
					<span className="ePlayer_minus" onClick={self.handleClickPointSign.bind(self, 'minus', 'cm', player.id, player.permissionId, player.teamId)}>
						<SVG icon="icon_minus" />
					</span>
						<span className="ePlayer_score">{`${cm}cm`}</span>
					<span className="ePlayer_plus" onClick={self.handleClickPointSign.bind(self, 'plus', 'cm', player.id, player.permissionId, player.teamId)}>
						<SVG icon="icon_plus" />
					</span>
				</span>
		);
	},
	renderPlayerPoints: function(player, mode, eventStatus, isOwner) {
		const self = this;

		if(EventHelper.isShowScoreButtons(eventStatus, mode, isOwner)) {
			const gameType = self.getBinding('event').toJS('sport.points.display');

			return self.renderPlayersPointsWithScore(player, gameType);
		} else {
			return (
				<span className="ePlayer_score">{self.getPointsByStudent(player.id)}</span>
			);
		}

	},
	getTimePoints: function(plainPoints) {
		const	hour = Math.floor(plainPoints / 3600),
				min = Math.floor((plainPoints - hour * 3600) / 60),
				sec = plainPoints - hour * 3600 - min * 60;

		if(hour === 0 && min === 0) {
			return `${sec}sec`;
 		} else if(hour === 0) {
			return `${min}min ${sec}sec`;
		} else {
			return `${hour}h ${min}min ${sec}sec`;
		}
	},
	getDistancePoints: function(plainPoints) {
		const	km	= Math.floor(plainPoints / 10000),
				m	= Math.floor((plainPoints - km * 10000) / 100),
				cm	= plainPoints - km * 10000 - m * 100;

		if(km === 0 && m === 0) {
			return `${cm}cm`;
		} else if(km === 0) {
			return `${m}m ${cm}cm`;
		} else {
			return `${km}h ${m}m ${cm}cm`;
		}
	},
	handleClickPointSign: function(operation, pointType, userId, permissionId, teamId) {
		const self = this;

		const	event		= self.getBinding('event').toJS(),
			pointsStep	= event.sport.points.pointsStep;

		const userScoreDataIndex = event.results.individualScore.findIndex(userScoreData => userScoreData.userId === userId);

		switch (operation) {
			case "plus":
				if(userScoreDataIndex === -1) {
					event.results.individualScore.push({
						userId:			userId,
						teamId:			teamId,
						permissionId:	permissionId,
						score:			self.incByType(
											0,
											pointType,
											pointsStep
										)
					})
				} else {
					event.results.individualScore[userScoreDataIndex].score = self.incByType(
						event.results.individualScore[userScoreDataIndex].score,
						pointType,
						pointsStep
					);
				}
				break;
			case "minus":
				if(userScoreDataIndex === -1) {
					event.results.individualScore.push({
						userId:			userId,
						permissionId:	permissionId,
						teamId:			teamId,
						score:			self.decByType(
											0,
											pointType,
											pointsStep
										)
					})
				} else {
					event.results.individualScore[userScoreDataIndex].score = self.decByType(
						event.results.individualScore[userScoreDataIndex].score,
						pointType,
						pointsStep
					);
				}
				break;
		};

		self.getBinding('event').set(Immutable.fromJS(event));
	},
	incByType:function(value, type, pointsStep) {
		switch (type) {
			case 'plain':
			case 'sec':
			case 'cm':
				return value += pointsStep;
			case 'min':
				return value = value + 60;
			case 'h':
				return value = value + 3600;
			case 'm':
				return value = value + 100;
			case 'km':
				return value = value + 10000;
		}
	},
	decByType:function(value, type, pointsStep) {
		let result;

		switch (type) {
			case 'plain':
			case 'sec':
			case 'cm':
				result = value - pointsStep;
				break;
			case 'min':
				result = value - 60;
				break;
			case 'h':
				result = value - 3600;
				break;
			case 'm':
				result = value - 100;
				break;
			case 'km':
				result = value - 10000;
				break;
		}

		return result > 0 ? result : value;
	},
	renderInternalEventForOneOnOneEvent: function(order) {
		const self = this;

		const	event	= self.getBinding('event').toJS(),
				player	= self.getDefaultBinding().toJS(`players.${order}`),
				players	= player ? [ player ] : [];

		return (
			<div className="bEventTeams_team">
				{self.renderPlayers(players, event.status, true)}
			</div>
		);
	},
	renderPlayersForLeftSide: function() {
		const self = this;

		const	event			= self.getBinding('event').toJS(),
				eventType		= event.eventType,
				teamsData		= event.teamsData,
				activeSchoolId	= self.getActiveSchoolId();

		if(TeamHelper.isNonTeamSport(event)) {
			switch (eventType) {
				case EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools']:
					const schoolId = event.inviterSchool.id === activeSchoolId ?
						event.inviterSchool.id :
						event.invitedSchools[0].id;
					return self.renderIndividualPlayersBySchoolId(schoolId);
				case EventHelper.clientEventTypeToServerClientTypeMapping['houses']:
					return self.renderIndividualPlayersByHouseId(event.houses[0]);
				case EventHelper.clientEventTypeToServerClientTypeMapping['internal']:
					if(TeamHelper.isOneOnOneSport(event)) {
						return self.renderInternalEventForOneOnOneEvent(0);
					} else {
						return null;
					}
			}
		} else {
			if(
				(
					eventType === EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools'] &&
					teamsData.length === 0
				) || (
					teamsData.length === 1 &&
					eventType === EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools'] &&
					teamsData[0].schoolId !== activeSchoolId
				)
			) {
				return self.renderSelectTeamLater();
			} else if (
				eventType === EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools']
			) {
				const order = teamsData[0].schoolId === activeSchoolId ? 0 : 1;
				return self.renderTeamPlayersByOrder(order);
			} else if (
				(
					teamsData.length >= 1
				) &&
				eventType !== EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools']
			) {
				return self.renderTeamPlayersByOrder(0);
			} else if (
				(
					teamsData.length === 0
				) &&
				eventType !== EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools']
			) {
				return self.renderSelectTeamLater();
			}
		}
	},
	renderIndividualPlayersBySchoolId: function(schoolId) {
		const self = this;

		const	event	= self.getBinding('event').toJS(),
				players	= self.getDefaultBinding().toJS('players').filter(p => p.schoolId === schoolId);

		if(players.length === 0) {
			return self.renderSelectTeamLater();
		} else {
			return (
				<div className="bEventTeams_team">
					{self.renderPlayers(players, event.status, true)}
				</div>
			);
		}
	},
	renderSelectPlayersLater: function() {
		return (
			<div className="bEventTeams_team">
				<div className="eEventTeams_awaiting">
					{'Select players later...'}
				</div>
			</div>
		);
	},
	renderSelectTeamLater: function() {
		return (
			<div className="bEventTeams_team">
				<div className="eEventTeams_awaiting">
					{'Select team later...'}
				</div>
			</div>
		);
	},
	renderIndividualPlayersByHouseId: function(houseId) {
		const self = this;

		const	event	= self.getBinding('event').toJS(),
				players	= self.getDefaultBinding().toJS('players').filter(p => p.houseId === houseId);

		if(players.length === 0) {
			return self.renderSelectTeamLater();
		} else {
			return (
				<div className="bEventTeams_team">
					{self.renderPlayers(players, event.status, true)}
				</div>
			);
		}
	},
	renderPlayersForRightSide: function() {
		const self = this;

		const	event			= self.getBinding('event').toJS(),
				eventType		= event.eventType,
				teamsData		= event.teamsData,
				activeSchoolId	= self.getActiveSchoolId();

		if(TeamHelper.isNonTeamSport(event)) {
			switch (eventType) {
				case EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools']:
					if(event.status === 'ACCEPTED' || event.status === 'FINISHED') {
						if(event.individuals.length === 0) {
							return self.renderAwaitingOpponentTeam();
						} else {
							const schoolId = event.inviterSchool.id !== activeSchoolId ?
								event.inviterSchool.id :
								event.invitedSchools[0].id;
							return self.renderIndividualPlayersBySchoolId(schoolId);
						}
					} else {
						return self.renderAwaitingOpponentTeam();
					}
				case EventHelper.clientEventTypeToServerClientTypeMapping['houses']:
					return self.renderIndividualPlayersByHouseId(event.houses[1]);
				case EventHelper.clientEventTypeToServerClientTypeMapping['internal']:
					if(TeamHelper.isOneOnOneSport(event)) {
						return self.renderInternalEventForOneOnOneEvent(1);
					} else {
						return null;
					}
			}
		} else {
			if(
				eventType === EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools'] &&
				teamsData.length === 0
			) {
				return self.renderAwaitingOpponentTeam();
			} else if (
				teamsData.length === 1 &&
				eventType === EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools'] &&
				teamsData[0].schoolId !== activeSchoolId
			) {
				return self.renderTeamPlayersByOrder(0);
			} else if(
				teamsData.length > 1 &&
				eventType === EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools'] &&
				teamsData[0].schoolId !== activeSchoolId
			) {
				return self.renderTeamPlayersByOrder(0);
			} else if (
				teamsData.length > 1 &&
				eventType === EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools'] &&
				teamsData[1].schoolId !== activeSchoolId
			) {
				return self.renderTeamPlayersByOrder(1);
			} else if (
				teamsData.length > 1 &&
				eventType !== EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools']
			) {
				return self.renderTeamPlayersByOrder(1);
			} else if (
				teamsData.length === 1 &&
				eventType === EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools']
			) {
				return self.renderAwaitingOpponentTeam();
			} else if (
				(
					teamsData.length === 0 ||
					teamsData.length === 1
				) &&
				eventType !== EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools']
			) {
				return self.renderSelectTeamLater();
			}
		}
	},
	renderAwaitingOpponentTeam: function() {
		return (
			<div className="bEventTeams_team">
				<div className="eEventTeams_awaiting">
					{'Awaiting opponent...'}
				</div>
			</div>
		);
	},
	renderPlayers: function(players, eventStatus, isOwner) {
		const self = this;

		return players.map((player, playerIndex) => {
			const isMale = player.gender === 'male';

			const mode = self.getBinding('mode').toJS();

			return (
				<div key={playerIndex} className="_bPlayer _mMini">
					<If condition={mode !== 'closing' && isOwner}>
						<span className="ePlayer_gender">
							{isMale ? <SVG icon="icon_man" /> : <SVG icon="icon_woman" />}
						</span>
					</If>
					<span className="ePlayer_name">
						<span>{player.firstName} </span>
						<span>{player.lastName}</span>
					</span>
					<If condition={eventStatus === "FINISHED" || mode === 'closing'}>
						{self.renderPlayerPoints(player, mode, eventStatus, isOwner)}
					</If>
				</div>
			);
		});
	},
	renderIndividuals: function() {
		const self = this;

		const	event	= self.getBinding('event').toJS(),
				players	= self.getDefaultBinding().toJS('players');

		if(players.length === 0) {
			return self.renderSelectPlayersLater();
		} else {
			return self.renderPlayers(players, event.status, true);
		}
	},
	renderTeamPlayersByOrder: function(order) {
		const	self	= this;
		let		players	= null;

		const playersBinding = self.getDefaultBinding().get(['players', order]);

		if(playersBinding) {
			const	event	= self.getBinding('event').toJS(),
					isOwner	= event.eventType === 'inter-schools' ?
								event.teamsData[order].schoolId === self.getActiveSchoolId() :
								true;

			players = self.renderPlayers(
				playersBinding.toJS(),
				event.status,
				isOwner
			);
		}

		return (
			<div className="bEventTeams_team">
				{players}
			</div>
		);
	},
	render: function() {
		const	self	= this;
		let		result	= null;

		const event = self.getBinding('event').toJS();

		if(TeamHelper.isInternalEventForIndividualSport(event)) {
			result = (
				<div className="bEventTeams">
					{self.renderIndividuals()}
				</div>
			);
		} else {
			result = (
				<div className="bEventTeams">
					{self.renderPlayersForLeftSide()}
					{self.renderPlayersForRightSide()}
				</div>
			);
		}

		return result;
	}
});

module.exports = EventTeamsView;
