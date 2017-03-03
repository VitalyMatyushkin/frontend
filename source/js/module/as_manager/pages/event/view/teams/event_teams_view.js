const	If				= require('module/ui/if/if'),
		InvitesMixin 	= require('module/as_manager/pages/invites/mixins/invites_mixin'),
		EventHelper		= require('module/helpers/eventHelper'),
		TeamHelper		= require('module/ui/managers/helpers/team_helper'),
		eventConst		= require('module/helpers/consts/events'),
		Score			= require('./../../../../../ui/score/score'),
		React			= require('react'),
		Immutable		= require('immutable'),
		Morearty		= require('morearty'),

		classNames		= require('classnames');


const EventTeamsView = React.createClass({
	mixins: [Morearty.Mixin, InvitesMixin],

	propTypes: {
		activeSchoolId	: React.PropTypes.string,
		customCss		: React.PropTypes.string
	},

	getPointsByStudent: function(event, userId) {
		const userScoreDataIndex = event.results.individualScore.findIndex(userScoreData => userScoreData.userId === userId);

		return  userScoreDataIndex === -1 ? 0 : event.results.individualScore[userScoreDataIndex].score;
	},
	handleChangeScore: function(event, teamId, player, score) {
		const self = this;

		// Order of score changes is important!
		// 1) Team score
		// 2) Individual score

		// Sum current player points with other player points = team points
		// But only for team games
		self.changePointsForPlayer(event, teamId, player, score);
		if(	typeof teamId !== 'undefined' && TeamHelper.isTeamSport(event)) {
			self.changePointsForTeam(event, teamId);
		}
	},
	changePointsForPlayer: function(event, teamId, player, score) {
		const 	self 		= this;
		let		scoreData	= event.results.individualScore.find(s => s.userId === player.userId && s.teamId === teamId);

		if(!scoreData) {
			scoreData = {
				userId:			player.userId,
				teamId: 		teamId,
				permissionId:	player.permissionId,
				score:			0
			};
			event.results.individualScore.push(scoreData);
		}
		/** set score */
		scoreData.score = score.value;
		scoreData.isChanged = true;
		scoreData.isValid = score.isValid;
		self.getBinding('event').set(Immutable.fromJS(event));
	},
	changePointsForTeam: function(event, teamId) {
		const 	self 		= this;
		let		scoreData	= event.results.teamScore.find(s => s.teamId === teamId);

		if(!scoreData) {
			scoreData = {
				teamId:	teamId,
				score:	0
			};
			event.results.teamScore.push(scoreData);
		}
		/** set score */
		scoreData.score = TeamHelper.calculateTeamPoints(event, teamId);
		scoreData.isChanged = true;
		self.getBinding('event').set(Immutable.fromJS(event));
	},
	renderIndividualPlayersForInternalEventForOneOnOneSportByOrder: function(order) {
		const self = this;

		const	event	= self.getBinding('event').toJS(),
				player	= self.getDefaultBinding().toJS(`players.${order}`),
				players	= player ? [ player ] : [];

		if(players.length === 0) {
			return self.renderPlayerTeamLater();
		} else {
			return (
				<div className="bEventTeams_team">
					{self.renderPlayers(undefined, players, true, true)}
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
	renderIndividualPlayersBySchoolId: function(schoolId, individualScoreAvailable) {
		const self = this;

		const	event	= self.getBinding('event').toJS(),
				players	= self.getDefaultBinding().toJS('players').filter(p => p.schoolId === schoolId);

		if(players.length === 0) {
			return self.renderSelectTeamLater();
		} else {
			return (
				<div className="bEventTeams_team">
					{self.renderPlayers(undefined, players, true, individualScoreAvailable)}
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
					{'Team members have not been added yet'}
				</div>
			</div>
		);
	},
	renderOpponentSelectTeamLater: function() {
		return (
			<div className="bEventTeams_team">
				<div className="eEventTeams_awaiting">
					{'Accepted by opponent'}
				</div>
			</div>
		);
	},
	renderIndividualPlayersByHouseId: function(houseId, individualScoreAvailable) {
		const self = this;

		const	event	= self.getBinding('event').toJS(),
				players	= self.getDefaultBinding().toJS('players').filter(p => p.houseId === houseId);

		if(players.length === 0) {
			return self.renderSelectTeamLater();
		} else {
			return (
				<div className="bEventTeams_team">
					{self.renderPlayers(undefined, players, true, individualScoreAvailable)}
				</div>
			);
		}
	},
	_getActiveSchoolId: function() {
		if(typeof this.props.activeSchoolId !== "undefined") {
			return this.props.activeSchoolId;
		} else {
			return this.getActiveSchoolId();
		}
	},
	renderPlayersForLeftSide: function() {
		const self = this;

		const	event						= self.getBinding('event').toJS(),
				eventType					= event.eventType,
				teamsData					= event.teamsData,
				housesData					= event.housesData,
				activeSchoolId				= self._getActiveSchoolId(),
				isaBinding 					= self.getBinding('individualScoreAvailable'),
				individualScoreAvailable	= isaBinding && isaBinding.toJS('0.value');

		if(TeamHelper.isNonTeamSport(event)) {
			switch (eventType) {
				case EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools']:
					const schoolId = event.inviterSchool.id === activeSchoolId ?
						event.inviterSchool.id :
						event.invitedSchools[0].id;
					return self.renderIndividualPlayersBySchoolId(schoolId, individualScoreAvailable);
				case EventHelper.clientEventTypeToServerClientTypeMapping['houses']:
					return self.renderIndividualPlayersByHouseId(housesData[0].id, individualScoreAvailable);
				case EventHelper.clientEventTypeToServerClientTypeMapping['internal']:
					if(TeamHelper.isOneOnOneSport(event)) {
						return self.renderIndividualPlayersForInternalEventForOneOnOneSportByOrder(0);
					} else if(TeamHelper.isIndividualSport(event)) {
						return self.renderIndividualPlayersForInternalEventForIndividualSport();
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
				return self.renderTeamPlayersByOrder(order, individualScoreAvailable);
			} else if (eventType === EventHelper.clientEventTypeToServerClientTypeMapping['houses']
			) {
				const teamIndex = teamsData.findIndex(t => t.houseId === housesData[0].id);
				if(teamIndex !== -1) {
					return self.renderTeamPlayersByOrder(teamIndex, individualScoreAvailable);
				} else {
					return self.renderSelectTeamLater();
				}
			} else if (
				(
					teamsData.length >= 1
				) &&
				eventType !== EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools']
			) {
				return self.renderTeamPlayersByOrder(0, individualScoreAvailable);
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
	renderPlayersForRightSide: function() {
		const self = this;

		const	event						= self.getBinding('event').toJS(),
				eventType					= event.eventType,
				teamsData					= event.teamsData,
				housesData					= event.housesData,
				activeSchoolId				= self._getActiveSchoolId(),
				isaBinding 					= self.getBinding('individualScoreAvailable'),
				individualScoreAvailable	= isaBinding && isaBinding.toJS('1.value');

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
							return self.renderIndividualPlayersBySchoolId(schoolId, individualScoreAvailable);
						}
					} else {
						return self.renderAwaitingOpponentTeam();
					}
				case EventHelper.clientEventTypeToServerClientTypeMapping['houses']:
					return self.renderIndividualPlayersByHouseId(housesData[1].id, individualScoreAvailable);
				case EventHelper.clientEventTypeToServerClientTypeMapping['internal']:
					if(TeamHelper.isOneOnOneSport(event)) {
						return self.renderIndividualPlayersForInternalEventForOneOnOneSportByOrder(1);
					} else {
						return null;
					}
			}
		} else {
			if(
				eventType === EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools'] &&
				teamsData.length === 0
			) {
				if(
					event.status === EventHelper.EVENT_STATUS.ACCEPTED ||
					event.status === EventHelper.EVENT_STATUS.FINISHED
				) {
					return self.renderOpponentSelectTeamLater();
				} else {
					return self.renderAwaitingOpponentTeam();
				}
			} else if (
				teamsData.length === 1 &&
				eventType === EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools'] &&
				teamsData[0].schoolId !== activeSchoolId
			) {
				return self.renderTeamPlayersByOrder(0, individualScoreAvailable);
			} else if(
				teamsData.length > 1 &&
				eventType === EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools'] &&
				teamsData[0].schoolId !== activeSchoolId
			) {
				return self.renderTeamPlayersByOrder(0, individualScoreAvailable);
			} else if (
				teamsData.length > 1 &&
				eventType === EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools'] &&
				teamsData[1].schoolId !== activeSchoolId
			) {
				return self.renderTeamPlayersByOrder(1, individualScoreAvailable);
			} else if (
				teamsData.length === 1 &&
				eventType === EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools']
			) {
				if(
					event.status === EventHelper.EVENT_STATUS.ACCEPTED ||
					event.status === EventHelper.EVENT_STATUS.FINISHED
				) {
					return self.renderOpponentSelectTeamLater();
				} else {
					return self.renderAwaitingOpponentTeam();
				}
			} else if (
				eventType === EventHelper.clientEventTypeToServerClientTypeMapping['houses']
			) {
				const teamIndex = teamsData.findIndex(t => t.houseId === housesData[1].id);
				if(teamIndex !== -1) {
					return self.renderTeamPlayersByOrder(teamIndex, individualScoreAvailable);
				} else {
					return self.renderSelectTeamLater();
				}
			} else if (
				teamsData.length <= 1 &&
				eventType === EventHelper.clientEventTypeToServerClientTypeMapping['internal']
			) {
				return self.renderSelectTeamLater();
			} else {
				return self.renderTeamPlayersByOrder(1, individualScoreAvailable);
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
	renderPlayers: function(teamId, players, isOwner, individualScoreAvailable) {
		const self = this;

		return players.map((player, playerIndex) => {
			const 	mode						= self.getBinding('mode').toJS(),
					event						= self.getBinding('event').toJS();

			let eventPlayerCss = classNames('_bPlayer _mMini', this.props.customCss, {
				mIndividuals: TeamHelper.isIndividualSport(self.getBinding('event').toJS())
			});

			return (
				<div key={playerIndex} className={eventPlayerCss}>
					<span className="ePlayer_name">
						<span>{`${playerIndex + 1}. `}</span>
						<span>{player.firstName}</span>
						<span>{player.lastName}</span>
					</span>
					<If condition = {Boolean(player.isCaptain)}>
							<span className="ePlayer_star">
								<i className = "fa fa-star fa-lg" aria-hidden="true"></i>
							</span>
					</If>
					<If condition={
						!self.isNonInternalEventForOneOnOneSport(event)
						&& (event.status === eventConst.EVENT_STATUS.FINISHED || mode === 'closing')
						&& individualScoreAvailable
					}>
						<span className="ePlayer_scoreContainer">
							<Score	isChangeMode	= {EventHelper.isShowScoreButtons(event, mode, isOwner, individualScoreAvailable)}
									plainPoints		= {self.getPointsByStudent(event, player.userId)}
									pointsStep		= {event.sport.points.pointsStep}
									pointsType		= {event.sport.points.display}
									pointsMask		= {event.sport.points.inputMask}
									onChange		= {self.handleChangeScore.bind(self, event, teamId, player)}
							/>
						</span>
					</If>
				</div>
			);
		});
	},
	isNonInternalEventForOneOnOneSport: function(event) {
		return TeamHelper.isOneOnOneSport(event) && !EventHelper.isInternalEvent(event);
	},
	renderIndividualPlayersForInternalEventForIndividualSport: function() {
		const self = this;

		const	event	= self.getBinding('event').toJS(),
				players	= self.getDefaultBinding().toJS('players');

		if(players.length === 0) {
			return self.renderSelectPlayersLater();
		} else {
			return (
				<div className="bEventTeams_team">
					{self.renderPlayers(undefined, players, true, true)}
				</div>)
		}
	},
	renderTeamPlayersByOrder: function(order, individualScoreAvailable) {
		const	self	= this;
		let		players	= null;

		const playersBinding = self.getDefaultBinding().get(['players', order]);

		if(
			typeof playersBinding !== 'undefined' &&
			typeof playersBinding.toJS() !== 'undefined' &&
			typeof playersBinding.toJS().length !== 'undefined'
		) {
			const	event	= self.getBinding('event').toJS(),
					isOwner	= event.eventType === 'inter-schools' ?
								event.teamsData[order].schoolId === self._getActiveSchoolId() :
								true;

			players = self.renderPlayers(
				event.teamsData[order].id,
				playersBinding.toJS(),
				isOwner,
				individualScoreAvailable
			);
		}

		return (
			<div className="bEventTeams_team">
				{players}
			</div>
		);
	},
	render: function() {
		const self = this;

		let eventTeamsCss = classNames('bEventTeams', this.props.customCss, {
			mIndividuals: TeamHelper.isInternalEventForIndividualSport(self.getBinding('event').toJS())
		});

		if(self.getBinding('isSync').toJS()) {
			return (
				<div className={eventTeamsCss}>
					<div className="bEventTeams_row mEqualHeight">
						<div className="bEventTeams_col mLeft">
							{self.renderPlayersForLeftSide()}
						</div>
						<div className="bEventTeams_col mHiddenInIndividuals">
							{self.renderPlayersForRightSide()}
						</div>
					</div>
				</div>
			);
		} else {
			return null;
		}
	}
});

module.exports = EventTeamsView;