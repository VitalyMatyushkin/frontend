const	React				= require('react'),
		Immutable			= require('immutable'),
		Morearty			= require('morearty'),

		PencilButton		= require('../../../../../ui/pencil_button'),
		InvitesMixin		= require('module/as_manager/pages/invites/mixins/invites_mixin'),
		StarRatingBar		= require('./../../../../../ui/star_rating_bar/star_rating_bar'),
		EventHelper			= require('module/helpers/eventHelper'),
		TeamHelper			= require('module/ui/managers/helpers/team_helper'),
		EventConst			= require('module/helpers/consts/events'),

		PerformanceStyle    = require('../../../../../../../styles/pages/event/b_event_performance_teams.scss');

const PerformanceView = React.createClass({
	mixins: [Morearty.Mixin, InvitesMixin],
	propTypes: {
		handleClickChangeMode: React.PropTypes.func.isRequired
	},
	handleValueChange: function(player, permissionId, performanceId, value) {
		const self = this;

		const	event = self.getBinding('event').toJS(),
			pDataIndex = event.results.individualPerformance.findIndex(pData =>
				pData.userId === player.userId &&
				pData.permissionId === permissionId &&
				pData.performanceId === performanceId
			);

		if(pDataIndex === -1) {
			const newPerformancePlayerData = {
				userId:			player.userId,
				permissionId:	permissionId,
				performanceId:	performanceId,
				value:			value
			}

			if(TeamHelper.isTeamSport(event)) {
				event.teamsData.forEach((t) => {
					if(!newPerformancePlayerData.teamId) {
						const foundPlayer = t.players.find(p => p.id === player.id);

						foundPlayer && (newPerformancePlayerData.teamId = t.id);
					}
				})
			}

			event.results.individualPerformance.push(newPerformancePlayerData);
		} else {
			event.results.individualPerformance[pDataIndex].value = value;
		}

		self.getBinding('event').set(Immutable.fromJS(event));
	},
	// TODO: All these render methods are copypaste from event_teams_view!
	renderInternalEventForOneOnOneEvent: function(order) {
		const self = this;

		const	event	= self.getBinding('event').toJS(),
			player	= self.getDefaultBinding().toJS(`players.${order}`),
			players	= player ? [ player ] : [];

		if(players.length === 0) {
			return self.renderPlayerTeamLater();
		} else {
			return (
				<div className="bEventPerformance_team">
					{self.renderPlayers(players)}
				</div>
			);
		}
	},
	renderPlayerTeamLater: function() {
		return (
			<div className="bEventPerformance_team">
				<div className="eEventTeams_awaiting">
					{'Select players later...'}
				</div>
			</div>
		);
	},
	renderIndividualPlayersBySchoolId: function(schoolId) {
		const self = this;

		const	event	= self.getBinding('event').toJS(),
				players	= self.getDefaultBinding().toJS('players').filter(p => p.schoolId === schoolId);

		if(players.length === 0) {
			return self.renderSelectTeamLater();
		} else {
			return (
				<div className="bEventPerformance_team">
					{self.renderPlayers(players)}
				</div>
			);
		}
	},
	renderSelectPlayersLater: function() {
		return (
			<div className="bEventPerformance_team">
				<div className="eEventTeams_awaiting">
					{'Select players later...'}
				</div>
			</div>
		);
	},
	renderSelectTeamLater: function() {
		return (
			<div className="bEventPerformance_team">
				<div className="eEventTeams_awaiting">
					{'Select team later...'}
				</div>
			</div>
		);
	},
	renderOpponentSelectTeamLater: function() {
		return (
			<div className="bEventPerformance_team">
				<div className="eEventTeams_awaiting">
					{'Accepted by opponent'}
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
				<div className="bEventPerformance_team">
					{self.renderPlayers(players)}
				</div>
			);
		}
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
	renderPlayersForRightSide: function() {
		const self = this;

		const	event			= self.getBinding('event').toJS(),
				eventType		= event.eventType,
				teamsData		= event.teamsData,
				activeSchoolId	= self.getActiveSchoolId();

		if(TeamHelper.isNonTeamSport(event)) {
			switch (eventType) {
				case EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools']:
					if(event.status === EventConst.EVENT_STATUS.ACCEPTED || event.status === EventConst.EVENT_STATUS.FINISHED) {
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
			<div className="bEventPerformance_team">
				<div className="eEventTeams_awaiting">
					{'Awaiting opponent...'}
				</div>
			</div>
		);
	},
	renderPlayers: function(players) {
		const self = this;

		return players.map((player, playerIndex) => {
			return (
				<div key={playerIndex} className="bPlayer mPerformance">
					<div className="ePlayer_name mBold">
						<span>{player.firstName} {player.lastName}</span>
					</div>
					<div className="ePlayer_performance">
						{self.renderPlayerPerformance(player)}
					</div>
				</div>
			);
		});
	},
	renderPlayerPerformance: function(player) {
		const self = this;

		const event = self.getBinding('event').toJS();

		return event && event.sport && event.sport.performance && event.sport.performance.map(pItem => {
				// player performance data
				const pData = (
						event.results &&
						event.results.individualPerformance &&
						event.results.individualPerformance.find(pUserData => pUserData.performanceId === pItem._id && pUserData.userId === player.userId)
					),
					value = pData ? pData.value : 0;

				return (
					<div key={pItem._id} className="ePlayer_performanceItem">
						<div className="ePlayer_performanceItemName">
							{pItem.name}
						</div>
						<div className="ePlayer_performanceItemValueContainer">
							<StarRatingBar	starCount			= {5}
											isEditMode			= {false}
											value				= {value}
											handleValueChanges	= {() => {}}
							/>
						</div>
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
			return self.renderPlayers(players);
		}
	},
	renderTeamPlayersByOrder: function(order) {
		const	self	= this;
		let		players	= null;

		const playersBinding = self.getDefaultBinding().get(['players', order]);

		if(playersBinding) {
			const event = self.getBinding('event').toJS();

			players = self.renderPlayers(playersBinding.toJS());
		}

		return (
			<div className="bEventPerformance_team">
				{players}
			</div>
		);
	},

	render: function() {
		const	self	= this;
		let		teams	= null;

		const event = self.getBinding('event').toJS();

		switch (true) {
			case TeamHelper.isInternalEventForIndividualSport(event):
				teams = (
					<div className="eEventPerformance_teams mIndivid">
						{self.renderIndividuals()}
					</div>
				);
				break;
			default:
				teams = (
					<div className="eEventPerformance_teams">
						<div className="eEventPerformance_col">
							{self.renderPlayersForLeftSide()}
						</div>
						<div className="eEventPerformance_col">
							{self.renderPlayersForRightSide()}
						</div>
					</div>
				);
				break;
		}

		return (
			<div className="bEventPerformance">
				<div className="eEventPerformance_header">
					<PencilButton handleClick={this.props.handleClickChangeMode}/>
				</div>
				<div className="eEventPerformance_body">
					{teams}
				</div>
			</div>
		);
	}
});

module.exports = PerformanceView;