const	If					= require('module/ui/if/if'),
		SVG					= require('module/ui/svg'),
		InvitesMixin 		= require('module/as_manager/pages/invites/mixins/invites_mixin'),
		EventHelper			= require('module/helpers/eventHelper'),
		TeamHelper			= require('module/ui/managers/helpers/team_helper'),
		userConst			= require('module/helpers/consts/user'),
		eventConst			= require('module/helpers/consts/events'),
		Score				= require('./../../../../../ui/score/score'),
		React				= require('react'),
		Immutable			= require('immutable'),
		Morearty			= require('morearty');

const EventTeamsView = React.createClass({
	mixins: [Morearty.Mixin, InvitesMixin],
	getPlainPointsByStudent: function(event, userId) {
		const userScoreDataIndex = event.results.individualScore.findIndex(userScoreData => userScoreData.userId === userId);

		return  userScoreDataIndex === -1 ? 0 : event.results.individualScore[userScoreDataIndex].score;
	},
	handleClickPointSign: function(event, userId, permissionId, teamId, operation, pointType) {
		const self = this;

		const pointsStep = event.sport.points.pointsStep;

		const userScoreDataIndex = event.results.individualScore.findIndex(userScoreData => userScoreData.userId === userId);

		switch (operation) {
			case "plus":
				if(userScoreDataIndex === -1) {
					event.results.individualScore.push({
						userId:			userId,
						teamId:			teamId,
						permissionId:	permissionId,
						score:			TeamHelper.incByType(
											0,
											pointType,
											pointsStep
										)
					})
				} else {
					event.results.individualScore[userScoreDataIndex].score = TeamHelper.incByType(
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
						score:			TeamHelper.decByType(
											0,
											pointType,
											pointsStep
										)
					})
				} else {
					event.results.individualScore[userScoreDataIndex].score = TeamHelper.decByType(
						event.results.individualScore[userScoreDataIndex].score,
						pointType,
						pointsStep
					);
				}
				break;
		};

		self.getBinding('event').set(Immutable.fromJS(event));
	},
	renderInternalEventForOneOnOneEvent: function(order) {
		const self = this;

		const	event	= self.getBinding('event').toJS(),
				player	= self.getDefaultBinding().toJS(`players.${order}`),
				players	= player ? [ player ] : [];

		if(players.length === 0) {
			return self.renderPlayerTeamLater();
		} else {
			return (
				<div className="bEventTeams_team">
					{self.renderPlayers(players, true)}
				</div>
			);
		}
	},
	renderPlayerTeamLater: function() {
		return (
			<div className="bEventTeams_team">
				<div className="eEventTeams_awaiting">
					{'Select players later...'}
				</div>
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
			} else if (eventType === EventHelper.clientEventTypeToServerClientTypeMapping['houses']
			) {
				const teamIndex = teamsData.findIndex(t => t.houseId === event.housesData[0].id);
				if(teamIndex !== -1) {
					return self.renderTeamPlayersByOrder(teamIndex);
				} else {
					return self.renderSelectTeamLater();
				}
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
					{self.renderPlayers(players, true)}
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
	renderOpponentSelectTeamLater: function() {
		return (
			<div className="bEventTeams_team">
				<div className="eEventTeams_awaiting">
					{'Opponent select team later...'}
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
					{self.renderPlayers(players, true)}
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
					if(event.status === eventConst.EVENT_STATUS.ACCEPTED || event.status === eventConst.EVENT_STATUS.FINISHED) {
						const schoolId = event.inviterSchool.id !== activeSchoolId ?
							event.inviterSchool.id :
							event.invitedSchools[0].id;

						const players = self.getDefaultBinding().toJS('players').filter(p => p.schoolId === schoolId);

						if(players.length === 0) {
							return self.renderOpponentSelectTeamLater();
						} else {
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
				if(event.status === EventHelper.EVENT_STATUS.ACCEPTED) {
					return self.renderOpponentSelectTeamLater();
				} else {
					return self.renderAwaitingOpponentTeam();
				}
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
				teamsData.length === 1 &&
				eventType === EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools']
			) {
				if(event.status === EventHelper.EVENT_STATUS.ACCEPTED) {
					return self.renderOpponentSelectTeamLater();
				} else {
					return self.renderAwaitingOpponentTeam();
				}
			} else if (
				eventType === EventHelper.clientEventTypeToServerClientTypeMapping['houses']
			) {
				const teamIndex = teamsData.findIndex(t => t.houseId === event.housesData[1].id);
				if(teamIndex !== -1) {
					return self.renderTeamPlayersByOrder(teamIndex);
				} else {
					return self.renderSelectTeamLater();
				}
			} else if (
				teamsData.length <= 1 &&
				eventType === EventHelper.clientEventTypeToServerClientTypeMapping['internal']
			) {
				return self.renderSelectTeamLater();
			} else {
				return self.renderTeamPlayersByOrder(1);
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
	renderPlayers: function(players, isOwner) {
		const self = this;

		return players.map((player, playerIndex) => {
			const isMale = player.gender === userConst.GENDER.MALE;

			const mode = self.getBinding('mode').toJS();

			const event = self.getBinding('event').toJS();

			return (
				<div key={playerIndex} className="_bPlayer _mMini">
					<If condition={mode !== 'closing' && isOwner}>
						<span className="ePlayer_gender">
							{isMale ? <SVG icon="icon_man" /> : <SVG icon="icon_woman" />}
						</span>
					</If>
					<span className="ePlayer_name">
						<span>{player.firstName}</span>
						<span>{player.lastName}</span>
					</span>
					<If condition={!TeamHelper.isOneOnOneSport(event) && (event.status === eventConst.EVENT_STATUS.FINISHED || mode === 'closing')}>
						<Score	isChangeMode			={EventHelper.isShowScoreButtons(event.status, mode, isOwner)}
								plainPoints				={self.getPlainPointsByStudent(event, player.id)}
								pointsType				={event.sport.points.display}
								handleClickPointSign	={self.handleClickPointSign.bind(self, event, player.id, player.permissionId, player.teamId)}
						/>
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
			return self.renderPlayers(players, true);
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

		const	event = self.getBinding('event').toJS(),
				isSync = self.getBinding('isSync').toJS();

		if(isSync) {
			switch (true) {
				case TeamHelper.isInternalEventForIndividualSport(event):
					result = (
						<div className="bEventTeams">
							{self.renderIndividuals()}
						</div>
					);
					break;
				default:
					result = (
						<div className="bEventTeams">
							{self.renderPlayersForLeftSide()}
							{self.renderPlayersForRightSide()}
						</div>
					);
					break;
			}
		}

		return result;
	}
});

module.exports = EventTeamsView;
