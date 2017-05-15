const	If				= require('module/ui/if/if'),
		InvitesMixin 	= require('module/as_manager/pages/invites/mixins/invites_mixin'),
		EventHelper		= require('module/helpers/eventHelper'),
		SportHelper 	= require('module/helpers/sport_helper'),
		TeamHelper		= require('module/ui/managers/helpers/team_helper'),
		eventConst		= require('module/helpers/consts/events'),
		Score			= require('./../../../../../ui/score/score'),
		ScoreCricket	= require('./../../../../../ui/score/score_cricket'),
		React			= require('react'),
		Immutable		= require('immutable'),
		Morearty		= require('morearty'),

		classNames		= require('classnames');


const EventTeamsView = React.createClass({
	mixins: [Morearty.Mixin, InvitesMixin],
	SELECT_PLAYERS_LATER:	'Select players later...',
	MEMBERS_NOT_ADDED:		'Team members have not been added yet',
	ACCEPTED_BY_OPPONENT:	'Accepted by opponent but team members have not been added yet',
	AWAITING_OPPONENT:		'Awaiting opponent...',
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
			return self.renderText(this.SELECT_PLAYERS_LATER);
		} else {
			return (
				<div className="bEventTeams_team">
					{self.renderPlayers(undefined, players, true, true)}
				</div>
			);
		}
	},
	renderIndividualPlayersBySchoolId: function(schoolId, individualScoreAvailable) {
		const self = this;

		const	event	= self.getBinding('event').toJS(),
				players	= self.getDefaultBinding().toJS('players').filter(p => p.schoolId === schoolId);

		if(players.length === 0) {
			return self.renderText(this.MEMBERS_NOT_ADDED);
		} else {
			return (
				<div className="bEventTeams_team">
					{self.renderPlayers(undefined, players, true, individualScoreAvailable)}
				</div>
			);
		}
	},
	renderText: function(text) {
		return (
			<div className="bEventTeams_team">
				<div className="eEventTeams_awaiting">
					{text}
				</div>
			</div>
		);
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
	renderIndividualPlayersByHouseId: function(houseId, individualScoreAvailable) {
		const self = this;

		const	event	= self.getBinding('event').toJS(),
				players	= self.getDefaultBinding().toJS('players').filter(p => p.houseId === houseId);

		if(players.length === 0) {
			return self.renderText(this.MEMBERS_NOT_ADDED);
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
				return self.renderText(this.MEMBERS_NOT_ADDED);
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
					return self.renderText(this.MEMBERS_NOT_ADDED);
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
				return self.renderText(this.MEMBERS_NOT_ADDED);
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
					if(
						event.status === eventConst.EVENT_STATUS.ACCEPTED ||
						event.status === eventConst.EVENT_STATUS.FINISHED
					) {
						const schoolId = event.inviterSchool.id !== activeSchoolId ?
							event.inviterSchool.id :
							event.invitedSchools[0].id;

						const players = self.getDefaultBinding().toJS('players').filter(p => p.schoolId === schoolId);

						if(players.length === 0) {
							// if inviter school at right side
							if(schoolId === event.inviterSchoolId) {
								return self.renderText(this.MEMBERS_NOT_ADDED);
							} else {
								return self.renderText(this.ACCEPTED_BY_OPPONENT);
							}
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
					// if inviter school at right side
					if(activeSchoolId !== event.inviterSchoolId) {
						return self.renderText(this.MEMBERS_NOT_ADDED);
					} else {
						return self.renderText(this.ACCEPTED_BY_OPPONENT);
					}
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
					// if inviter school at right side
					if(activeSchoolId !== event.inviterSchoolId) {
						return self.renderText(this.MEMBERS_NOT_ADDED);
					} else {
						return self.renderText(this.ACCEPTED_BY_OPPONENT);
					}
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
					return self.renderText(this.MEMBERS_NOT_ADDED);
				}
			} else if (
				teamsData.length <= 1 &&
				eventType === EventHelper.clientEventTypeToServerClientTypeMapping['internal']
			) {
				return self.renderText(this.MEMBERS_NOT_ADDED);
			} else {
				return self.renderTeamPlayersByOrder(1, individualScoreAvailable);
			}
		}
	},
	/**
	 * Return array of players sorted by individual score
	 */
	sortPlayersByScore: function(players) {
		const 	rootBinding 		= this.getMoreartyContext().getBinding(),
				isEventInitResult 	= Boolean(rootBinding.get('events.model.initResults')),
			 	mode 				= this.getBinding('mode').toJS(),
				scoring 			= this.getBinding('event').toJS('sport.scoring');
		
		//we add individual score in array of players (player.result) and then sort array by DESC
		//we get individual score from different source, because when we change score, immediately triggered sort
		if (!isEventInitResult || mode !== 'closing') {
			players.forEach( player => {
				player.result = this.getPointsByStudent(this.getBinding('event').toJS(), player.userId);
			});
		} else {
			players.forEach( player => {
				const 	initResults = rootBinding.get('events.model.initResults.individualScore').toJS(),
						userScoreDataIndex = initResults.findIndex(userScoreData => userScoreData.userId === player.userId);
				
				player.result = userScoreDataIndex === -1 ? 0 : initResults[userScoreDataIndex].score;
			});
		}
		//Depending on the sport, we change the order of sorting the results of players (desc or asc)
		if (scoring === 'MORE_SCORES' || scoring === 'MORE_TIME' || scoring === 'MORE_RESULT' || scoring === 'FIRST_TO_N_POINTS') {
			this.sortPlayersByScoreDesc(players);
		} else {
			this.sortPlayersByScoreAsc(players);
		}
		
		return players;
	},
	sortPlayersByScoreDesc: function (players){
		return players = players.sort( (player1, player2) => {
			return player2.result - player1.result;
		});
	},
	sortPlayersByScoreAsc: function (players){
		return players = players.sort( (player1, player2) => {
			return player1.result - player2.result;
		});
	},
	
	renderScore: function(event, mode, isOwner, individualScoreAvailable, player, teamId){
		//For cricket we use separate component (because cricket no usual game, with very strange rules)
		//We save score in format {number}: <Runs>999.<Wickets>9 (example 200.5, mean Runs: 200, Wickets: 5)
		if (SportHelper.isCricket(event.sport.name)) {
			return (
				<span className="ePlayer_scoreCricketContainer">
					<ScoreCricket	isChangeMode	= { EventHelper.isShowScoreButtons(event, mode, isOwner, individualScoreAvailable) }
									plainPoints		= { this.getPointsByStudent(event, player.userId) }
									pointsStep		= { event.sport.points.pointsStep }
									onChange		= { this.handleChangeScore.bind(this, event, teamId, player) }
									isPlayerScore 	= { true }
					/>
				</span>
			);
		} else {
			return (
				<span className="ePlayer_scoreContainer">
					<Score	isChangeMode	= { EventHelper.isShowScoreButtons(event, mode, isOwner, individualScoreAvailable) }
							plainPoints		= { this.getPointsByStudent(event, player.userId) }
							pointsStep		= { event.sport.points.pointsStep }
							pointsType		= { event.sport.points.display }
							pointsMask		= { event.sport.points.inputMask }
							onChange		= { this.handleChangeScore.bind(this, event, teamId, player) }
					/>
				</span>
			);
		}
	},
	
	renderPlayers: function(teamId, players, isOwner, individualScoreAvailable) {
		const self = this;

		//we sort array of players by individual score
		this.sortPlayersByScore(players);

		return players.map((player, playerIndex) => {
			const 	mode	= self.getBinding('mode').toJS(),
					event	= self.getBinding('event').toJS();

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
						{this.renderScore(event, mode, isOwner, individualScoreAvailable, player, teamId)}
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
			return self.renderText(this.SELECT_PLAYERS_LATER);
		} else {
			return (
				<div className="bEventTeams_team">
					{self.renderPlayers(undefined, players, true, true)}
				</div>)
		}
	},
	renderTeamPlayersByOrder: function(order, individualScoreAvailable) {
		let xmlPlayers = null;

		const playersBinding = this.getDefaultBinding().get(['players', order]);

		if(typeof playersBinding !== 'undefined' && typeof playersBinding.toJS() !== 'undefined') {
			const playersData = playersBinding.toJS();

			if(playersData.length === 0) {
				xmlPlayers = this.renderText(this.MEMBERS_NOT_ADDED);
			} else {
				const	event	= this.getBinding('event').toJS(),
						isOwner	= event.eventType === 'inter-schools' ?
							event.teamsData[order].schoolId === this._getActiveSchoolId() :
							true;

				xmlPlayers = (
					<div className="bEventTeams_team">
						{
							this.renderPlayers(
								event.teamsData[order].id,
								playersData,
								isOwner,
								individualScoreAvailable
							)
						}
					</div>
				);
			}
		}

		return xmlPlayers;
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