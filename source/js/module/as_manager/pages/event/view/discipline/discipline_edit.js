const	React			= require('react'),
		Score			= require('./../../../../../ui/score/score'),
	{If}			= require('../../../../../ui/if/if'),
		TabHelper		= require('../tab_helper'),
		EventHelper		= require('module/helpers/eventHelper'),
		TeamHelper		= require('module/ui/managers/helpers/team_helper'),
		EventConst		= require('module/helpers/consts/events'),
		classNames		= require('classnames'),
		SportConsts		= require('module/helpers/consts/sport');

const DisciplineEdit = React.createClass({
	propTypes: {
		event					: React.PropTypes.object.isRequired,
		players					: React.PropTypes.array.isRequired,
		disciplineItems			: React.PropTypes.array.isRequired,
		disciplineValues		: React.PropTypes.array.isRequired,
		activeSchoolId			: React.PropTypes.string.isRequired,
		handleChange			: React.PropTypes.func.isRequired,
		onSave					: React.PropTypes.func.isRequired,
		onCancel				: React.PropTypes.func.isRequired
	},
	// TODO: All these render methods are copypaste from event_teams_view!
	renderInternalEventForOneOnOneEvent: function(order) {
		const	player	= this.props.players[order],
			players	= player ? [ player ] : [];

		if(players.length === 0) {
			return this.renderPlayerTeamLater();
		} else {
			return (
				<div className="eEventPerformance_team">
					{this.renderPlayers(players)}
				</div>
			);
		}
	},
	renderPlayerTeamLater: function() {
		return (
			<div className="eEventPerformance_team">
				<div className="eEventTeams_awaiting">
					{'Select players later...'}
				</div>
			</div>
		);
	},
	renderIndividualPlayersBySchoolId: function(schoolId) {
		const players	= this.props.players.filter(p => p.schoolId === schoolId);

		if(players.length === 0) {
			return this.renderEmptyTeam();
		} else {
			return (
				<div className="eEventPerformance_team">
					{this.renderPlayers(players)}
				</div>
			);
		}
	},
	renderEmptyTeam: function() {
		return (
			<div className="eEventPerformance_team mEmpty">
				{'Team members have not been added yet'}
			</div>
		);
	},
	renderOpponentSelectTeamLater: function() {
		return (
			<div className="eEventPerformance_team">
				<div className="eEventTeams_awaiting">
					{'Accepted by opponent'}
				</div>
			</div>
		);
	},
	renderIndividualPlayersByHouseId: function(houseId) {
		const players = this.props.players.filter(p => p.houseId === houseId);

		if(players.length === 0) {
			return this.renderEmptyTeam();
		} else {
			return (
				<div className="eEventPerformance_team">
					{this.renderPlayers(players)}
				</div>
			);
		}
	},
	renderPlayersForLeftSide: function() {
		const	event			= this.props.event,
				eventType		= event.eventType,
				teamsData		= event.teamsData,
				activeSchoolId	= this.props.activeSchoolId;

		if(TeamHelper.isNonTeamSport(event)) {
			switch (eventType) {
				case EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools']:
					const schoolId = event.inviterSchool.id === activeSchoolId ?
						event.inviterSchool.id :
						event.invitedSchools[0].id;
					return this.renderIndividualPlayersBySchoolId(schoolId);
				case EventHelper.clientEventTypeToServerClientTypeMapping['houses']:
					return this.renderIndividualPlayersByHouseId(event.houses[0]);
				case EventHelper.clientEventTypeToServerClientTypeMapping['internal']:
					if(TeamHelper.isOneOnOneSport(event)) {
						return this.renderInternalEventForOneOnOneEvent(0);
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
				return this.renderEmptyTeam();
			} else if (
				eventType === EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools']
			) {
				const order = teamsData[0].schoolId === activeSchoolId ? 0 : 1;
				return this.renderTeamPlayersByOrder(order, teamsData[order].id);
			} else if (eventType === EventHelper.clientEventTypeToServerClientTypeMapping['houses']
			) {
				const teamIndex = teamsData.findIndex(t => t.houseId === event.housesData[0].id);
				if(teamIndex !== -1) {
					return this.renderTeamPlayersByOrder(teamIndex, teamsData[teamIndex].id);
				} else {
					return this.renderEmptyTeam();
				}
			} else if (
				(
					teamsData.length >= 1
				) &&
				eventType !== EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools']
			) {
				return this.renderTeamPlayersByOrder(0, teamsData[0].id);
			} else if (
				(
					teamsData.length === 0
				) &&
				eventType !== EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools']
			) {
				return this.renderEmptyTeam();
			}
		}
	},
	renderPlayersForRightSide: function() {
		const	event			= this.props.event,
			eventType		= event.eventType,
			teamsData		= event.teamsData,
			activeSchoolId	= this.props.activeSchoolId;

		if(TeamHelper.isNonTeamSport(event)) {
			switch (eventType) {
				case EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools']:
					if(event.status === EventConst.EVENT_STATUS.ACCEPTED || event.status === EventConst.EVENT_STATUS.FINISHED) {
						const schoolId = event.inviterSchool.id !== activeSchoolId ?
							event.inviterSchool.id :
							event.invitedSchools[0].id;

						const players = this.getDefaultBinding().toJS('players').filter(p => p.schoolId === schoolId);

						if(players.length === 0) {
							return null;
						} else {
							return this.renderIndividualPlayersBySchoolId(schoolId);
						}
					} else {
						return null;
					}
				case EventHelper.clientEventTypeToServerClientTypeMapping['houses']:
					return this.renderIndividualPlayersByHouseId(event.houses[1]);
				case EventHelper.clientEventTypeToServerClientTypeMapping['internal']:
					if(TeamHelper.isOneOnOneSport(event)) {
						return this.renderInternalEventForOneOnOneEvent(1);
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
					return null;
				} else {
					return null;
				}
			} else if (
				teamsData.length === 1 &&
				eventType === EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools'] &&
				teamsData[0].schoolId !== activeSchoolId
			) {
				return null;
			} else if(
				teamsData.length > 1 &&
				eventType === EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools'] &&
				teamsData[0].schoolId !== activeSchoolId
			) {
				return null;
			} else if (
				teamsData.length > 1 &&
				eventType === EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools'] &&
				teamsData[1].schoolId !== activeSchoolId
			) {
				return null;
			} else if (
				teamsData.length === 1 &&
				eventType === EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools']
			) {
				if(event.status === EventHelper.EVENT_STATUS.ACCEPTED) {
					return null;
				} else {
					return null;
				}
			} else if (
				eventType === EventHelper.clientEventTypeToServerClientTypeMapping['houses']
			) {
				const teamIndex = teamsData.findIndex(t => t.houseId === event.housesData[1].id);
				if(teamIndex !== -1) {
					return this.renderTeamPlayersByOrder(teamIndex);
				} else {
					return this.renderEmptyTeam();
				}
			} else if (
				teamsData.length <= 1 &&
				eventType === EventHelper.clientEventTypeToServerClientTypeMapping['internal']
			) {
				return this.renderEmptyTeam();
			} else {
				return this.renderTeamPlayersByOrder(1);
			}
		}
	},
	renderAwaitingOpponentTeam: function() {
		return (
			<div className="eEventPerformance_team">
				<div className="eEventTeams_awaiting">
					{'Awaiting opponent...'}
				</div>
			</div>
		);
	},
	renderPlayers: function(players, teamId) {
		return players.map((player, playerIndex) => {
			const playerStyle = classNames({
				'bPlayer'		: true,
				'mPerformance'	: true,
				'mLast'			: players.length === playerIndex + 1
			});

			return (
				<div	key			= {player.id}
						className	= {playerStyle}
				>
					<div className="ePlayer_name mBold">
						<span>{player.firstName} {player.lastName}</span>
					</div>
					<div className="ePlayer_discipline">
						{this.renderPlayerDisciplineItems(player, teamId)}
					</div>
				</div>
			);
		});
	},
	getDisciplineItemValueByUserId: function (disciplineItemId, userId) {
		const foundDisciplineItemValue = this.props.disciplineValues.find(
			disciplineItemValue => disciplineItemValue.disciplineId === disciplineItemId && disciplineItemValue.userId === userId
		);

		if(typeof foundDisciplineItemValue !== "undefined") {
			return foundDisciplineItemValue.value;
		} else {
			return 0;
		}
	},
	renderPlayerDisciplineItems: function(player, teamId) {
		return this.props.disciplineItems.map(disciplineItem => {
			return (
				<div	key			= {disciplineItem._id}
						className	= "ePlayer_disciplineItem"
				>
					<div className="ePlayer_disciplineItemName">
						{disciplineItem.namePlural}
					</div>
					<div className="ePlayer_disciplineItemValueContainer">
						<Score	isChangeMode	= {true}
								plainPoints		= {this.getDisciplineItemValueByUserId(disciplineItem._id, player.userId)}
								pointsStep		= {1}
								pointsType		= {SportConsts.SPORT_POINTS_TYPE.PLAIN}
								onChange		= {this.props.handleChange.bind(null, player.userId, player.permissionId, teamId, disciplineItem._id)}
						/>
					</div>
				</div>
			);
		});
	},
	renderIndividuals: function() {
		if(this.props.players.length === 0) {
			return this.renderEmptyTeam();
		} else {
			return this.renderPlayers(this.props.players);
		}
	},
	renderTeamPlayersByOrder: function(order, teamId) {
		let renderedPlayers = null;

		const players = this.props.players[order];

		// what if there aren't players by current order
		if(typeof players !== 'undefined') {
			renderedPlayers = this.renderPlayers(players, teamId);
		}

		return (
			<div className="eEventPerformance_team">
				{renderedPlayers}
			</div>
		);
	},
	render: function() {
		let teams = null;

		switch (true) {
			case TeamHelper.isInternalEventForIndividualSport(this.props.event):
				teams = (
					<div className="eEventPerformance_teams mIndivid">
						{this.renderIndividuals()}
					</div>
				);
				break;
			default:
				teams = (
					<div className="eEventPerformance_teams">
						<div className="eEventPerformance_col">
							{this.renderPlayersForLeftSide()}
						</div>
						<div className="eEventPerformance_col">
							{this.renderPlayersForRightSide()}
						</div>
					</div>
				);
				break;
		}

		return (
			<div className="bEventPerformance">
				<If condition={TabHelper.isShowEditButtonByEvent(this.props.activeSchoolId, this.props.event)}>
					<div className="eEventPerformance_header">
						<div	className	= "bButton mCancel mMarginRight"
								onClick		= {this.props.onCancel}
						>
							Cancel
						</div>
						<div	className	= "bButton"
								onClick		= {this.props.onSave}
						>
							Save
						</div>
					</div>
				</If>
				<div className="eEventPerformance_body">
					{teams}
				</div>
			</div>
		);
	}
});

module.exports = DisciplineEdit;