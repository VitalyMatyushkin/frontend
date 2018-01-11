const	React			= require('react'),
		Player			= require('module/as_manager/pages/event/view/rivals/player/player'),
		OverallPlayer	= require('module/as_manager/pages/event/view/overall_view/player/player'),
		EventHelper		= require('module/helpers/eventHelper'),
		TeamHelper		= require('module/ui/managers/helpers/team_helper'),
		PencilButton	= require('module/ui/pencil_button'),
		propz			= require('propz'),
		classNames		= require('classnames'),
		ViewModeConsts	= require('module/ui/view_selector/consts/view_mode_consts'),
		InviteConsts	= require('module/helpers/consts/invite'),
		PlayersStyle	= require('../../../../../../../styles/ui/b_block_view_rivals/b_players.scss');

const SPORT_SORT = {
	'BY_SCORE': 'BY_SCORE',
	'BY_EXTRA_SCORE': 'BY_EXTRA_SCORE'
};

//Change this const on BY_EXTRA_SCORE if you want sort by extraScore
const SORTING = 'BY_EXTRA_SCORE';

const Players = React.createClass({
	propTypes: {
		viewMode					: React.PropTypes.string.isRequired,
		rival						: React.PropTypes.object.isRequired,
		isOwner						: React.PropTypes.bool.isRequired,
		mode						: React.PropTypes.string.isRequired,
		event						: React.PropTypes.object.isRequired,
		activeSchoolId				: React.PropTypes.string.isRequired,
		onChangeScore				: React.PropTypes.func.isRequired,
		onClickEditTeam				: React.PropTypes.func.isRequired,
		customCss					: React.PropTypes.string,
		customPlayerCss				: React.PropTypes.string,
		isShowControlButtons		: React.PropTypes.bool
	},
	SELECT_TEAM_LATER:		'Select team later',
	NO_TEAM_MEMBERS:		'No team members to display',
	MEMBERS_NOT_ADDED:		'Team members have not been added yet',
	ACCEPTED_BY_OPPONENT:	'Accepted by opponent but team members have not been added yet',
	AWAITING_OPPONENT:		'Awaiting opponent',
	EVENT_INVITE_REJECTED:	'The event invite has been rejected',
	renderContent: function() {
		const	event		= this.props.event,
				eventType	= event.eventType;

		if (eventType === EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools']) {
			if (TeamHelper.isNonTeamSport(event)) {
				return this.renderPlayersForIndividualInterSchoolsEvent();
			} else {
				return this.renderPlayersForInterSchoolsEvent();
			}
		} else if (eventType === EventHelper.clientEventTypeToServerClientTypeMapping['houses']) {
			if (TeamHelper.isIndividualSport(event)) {
				return this.renderPlayersForIndividualHousesEvent();
			} else {
				return this.renderPlayersForHousesEvent();
			}
		} if (eventType === EventHelper.clientEventTypeToServerClientTypeMapping['internal']) {
			return this.renderPlayersForInternalEvent();
		}
	},
	renderText: function(text) {
		return (
			<div className="eEventTeams_awaiting">
				{text}
			</div>
		);
	},
	renderPlayersForInterSchoolsEvent: function() {
		const players = propz.get(this.props.rival, ['team', 'players']);

		if(typeof players !== 'undefined' && players.length !== 0) {
			return this.renderPlayers(players);
		} else {
			return this.renderNotificationTextForInterSchoolsEvent();
		}
	},
	renderPlayersForIndividualInterSchoolsEvent: function() {
		const players = propz.get(this.props.rival, ['players']);
		
		if(typeof players !== 'undefined' && players.length !== 0) {
			return this.renderPlayers(players);
		} else {
			return this.renderNotificationTextForInterSchoolsEvent();
		}
	},
	renderPlayersForIndividualHousesEvent: function() {
		const players = propz.get(this.props.rival, ['players']);

		if(typeof players !== 'undefined' && players.length !== 0) {
			return this.renderPlayers(players);
		} else {
			return this.renderText(this.SELECT_TEAM_LATER);
		}
	},
	renderNotificationTextForInterSchoolsEvent: function() {
		const	event			= this.props.event,
				rival			= this.props.rival,
				eventStatus		= event.status,
				players			= propz.get(this.props.rival, ['team', 'players']),
				activeSchoolId	= this.props.activeSchoolId;

		if(activeSchoolId === rival.school.id) {									// If rival is activeSchool
			if(eventStatus === EventHelper.EVENT_STATUS.FINISHED) {					// For finished event
				if(typeof players === 'undefined') {								// Select team later
					return this.renderText(this.NO_TEAM_MEMBERS);
				} else if(typeof players !== 'undefined' && players.length === 0) {	// Team was set, but empty
					return this.renderText(this.NO_TEAM_MEMBERS);
				}
			} else {																// For not finished event
				if(typeof players === 'undefined') {								// Select team later
					return this.renderText(this.SELECT_TEAM_LATER);
				} else if(typeof players !== 'undefined' && players.length === 0) {	// Team was set, but empty
					return this.renderText(this.MEMBERS_NOT_ADDED);
				}
			}
		} else if(
			rival.school.id === event.inviterSchoolId &&							// If rival is inviter school,
			activeSchoolId !== rival.school.id										// but not active school
		) {
			if(eventStatus === EventHelper.EVENT_STATUS.FINISHED) {					// For finished event
				if(typeof players === 'undefined') {								// Select team later
					return this.renderText(this.NO_TEAM_MEMBERS);
				} else if(typeof players !== 'undefined' && players.length === 0) {	// Team was set, but empty
					return this.renderText(this.NO_TEAM_MEMBERS);
				}
			} else {																// For not finished event
				if(typeof players === 'undefined') {								// Select team later
					return this.renderText(this.ACCEPTED_BY_OPPONENT);
				} else if(typeof players !== 'undefined' && players.length === 0) {	// Team was set, but empty
					return this.renderText(this.ACCEPTED_BY_OPPONENT);
				}
			}
		} else {																	// Cases for other schools
			if(eventStatus === EventHelper.EVENT_STATUS.FINISHED) {
				return this.renderText(this.NO_TEAM_MEMBERS);
			} else {
				//For public site we do not have access to invites, then we render AWAITING_OPPONENT text
				//TODO: If we will have access, then fix it
				if (typeof rival.invite === 'undefined') {
					return this.renderText(this.AWAITING_OPPONENT);
				} else if(rival.invite.status === InviteConsts.INVITE_STATUS.REJECTED) {
					return this.renderText(this.EVENT_INVITE_REJECTED);
				} else if(rival.invite.status !== InviteConsts.INVITE_STATUS.ACCEPTED) {					// Invite was not accepted yet
					return this.renderText(this.AWAITING_OPPONENT);
				} else if(
					rival.invite.status === InviteConsts.INVITE_STATUS.ACCEPTED &&							// Select team later
					typeof players === 'undefined'
				) {
					return this.renderText(this.ACCEPTED_BY_OPPONENT);
				} else if(
					rival.invite.status === InviteConsts.INVITE_STATUS.ACCEPTED &&							// Team was set, but empty
					typeof players !== 'undefined' &&
					players.length === 0
				) {
					return this.renderText(this.ACCEPTED_BY_OPPONENT);
				}
			}
		}
	},
	renderPlayersForHousesEvent: function() {
		const players = propz.get(this.props.rival, ['team', 'players']);

		if(
			typeof players === 'undefined' ||
			players.length === 0
		) {
			return this.renderText(this.MEMBERS_NOT_ADDED);
		} else {
			return this.renderPlayers(players);
		}
	},
	renderPlayersForInternalEvent: function() {
		const players = propz.get(this.props.rival, ['team', 'players']);

		if(
			typeof players === 'undefined' ||
			players.length === 0
		) {
			return this.renderText(this.MEMBERS_NOT_ADDED);
		} else {
			return this.renderPlayers(players);
		}
	},
	renderEditButton: function() {
		const	event			= this.props.event,
				rivalSchoolId	= this.props.rival.school.id,
				mode			= this.props.mode;

		switch (true) {
			case !this.props.isShowControlButtons:
				return null;
			case this.props.isShowControlButtons && this.props.viewMode === ViewModeConsts.VIEW_MODE.OVERALL_VIEW:
				return null;
			case this.props.isShowControlButtons && EventHelper.isInterSchoolsEvent(event) && rivalSchoolId !== this.props.activeSchoolId:
				return null;
			case this.props.isShowControlButtons && mode !== 'closing':
				return (
					<div className="ePlayers_editButtonWrapper">
						<PencilButton handleClick={this.props.onClickEditTeam}/>
					</div>
				);
		}
	},
	/**
	 * Return array of players sorted by individual score
	 */
	sortPlayersByScore: function(players) {
		
		const	event		= this.props.event,
				scoring 	= propz.get(event, ['sport', 'scoring']);
		
		//Depending on the sport, we change the order of sorting the results of players (desc or asc)
		if (
			scoring === 'MORE_SCORES' ||
			scoring === 'MORE_TIME' ||
			scoring === 'MORE_RESULT' ||
			scoring === 'FIRST_TO_N_POINTS'
		) {
			this.sortPlayersByScoreDesc(players);
		} else {
			this.sortPlayersByScoreAsc(players);
		}
		
		return players;
	},
	/**
	 * Return array of players sorted by individual extraScore
	 */
	sortPlayersByExtraScore: function(players){
		return players.sort( (player1, player2) => {
			if (player2.extraScore < player1.extraScore) {
				return -1;
			} else if (player2.extraScore > player1.extraScore) {
				return 1;
			} else {
				const	event		= this.props.event,
						scoring 	= propz.get(event, ['sport', 'scoring']);
				if (
					scoring === 'MORE_SCORES' ||
					scoring === 'MORE_TIME' ||
					scoring === 'MORE_RESULT' ||
					scoring === 'FIRST_TO_N_POINTS'
				) {
					if (player2.score < player1.score) {
						return -1;
					} else if (player2.score > player1.score) {
						return 1;
					} else {
						return 0;
					}
				} else {
					if (player1.score < player2.score) {
						return -1;
					} else if (player1.score > player2.score) {
						return 1;
					} else {
						return 0;
					}
				}
			}
		});
	},
	sortPlayersByScoreDesc: function (players){
		return players.sort( (player1, player2) => {
			if (player2.score < player1.score) {
				return -1;
			} else if (player2.score > player1.score) {
				return 1;
			} else { // if player1.score === player2.score, then we sort by extraScore
				if (player1.extraScore > player2.extraScore) {
					return -1;
				} else if (player1.extraScore < player2.extraScore) {
					return 1;
				} else {
					return 0;
				}
			}
		});
	},
	sortPlayersByScoreAsc: function (players){
		return players.sort( (player1, player2) => {
			if (player1.score < player2.score) {
				return -1;
			} else if (player1.score > player2.score) {
				return 1;
			} else { // if player1.score === player2.score, then we sort by extraScore
				if (player1.extraScore > player2.extraScore) {
					return -1;
				} else if (player1.extraScore < player2.extraScore) {
					return 1;
				} else {
					return 0;
				}
			}
		});
	},
	isShowMedal: function(){
		const 	event 			= this.props.event,
				eventStatus 	= this.props.event.status,
				mode 			= this.props.mode;

		return (
			TeamHelper.isInterSchoolsEventForIndividualSport(event) &&
			mode === 'general' &&
			eventStatus === EventHelper.EVENT_STATUS.FINISHED
		);
	},
	getPlayersPlaceArray: function(players){
		const playersPlaceArray = [];
		let place = 1;
		//we give additional place if score and extraScore is the same
		for (let i = 1; i < players.length; i++) {
			if (players[i-1].score === players[i].score && players[i-1].extraScore === players[i].extraScore) {
				playersPlaceArray.push(place);
			} else {
				playersPlaceArray.push(place);
				place++;
			}
		}
		//push last place
		playersPlaceArray.push(place);
		
		return playersPlaceArray;
	},
	renderPlayers: function(players) {
		const 	event 		= this.props.event,
				isShowMedal = this.isShowMedal();

		let playersPlaceArray = [];
		if (TeamHelper.isInterSchoolsEventForIndividualSport(event)) {
			if (SORTING === SPORT_SORT.BY_SCORE) {
				players = this.sortPlayersByScore(players);
			} else if (SORTING === SPORT_SORT.BY_EXTRA_SCORE) {
				players = this.sortPlayersByExtraScore(players);
			}
			
			playersPlaceArray = this.getPlayersPlaceArray(players);
		}

		return players.map((player, playerIndex) => {

			switch (this.props.viewMode) {
				case ViewModeConsts.VIEW_MODE.OVERALL_VIEW: {
					return (
						<OverallPlayer
							key							= {playerIndex}
							playerIndex					= {playerIndex}
							playerPlace 				= {playersPlaceArray.length !== 0 ? playersPlaceArray[playerIndex] : 0}
							player						= {player}
							isOwner						= {this.props.isOwner}
							individualScoreAvailable	= {this.props.rival.isIndividualScoreAvailable}
							mode						= {this.props.mode}
							isShowMedal					= {isShowMedal}
							event						= {this.props.event}
							onChangeScore				= {this.props.onChangeScore}
							customCss					= {this.props.customPlayerCss}
						/>
					);
				}
				default: {
					return (
						<Player
							key							= {playerIndex}
							playerIndex					= {playerIndex}
							playerPlace 				= {playersPlaceArray.length !== 0 ? playersPlaceArray[playerIndex] : 0}
							player						= {player}
							isOwner						= {this.props.isOwner}
							individualScoreAvailable	= {this.props.rival.isIndividualScoreAvailable}
							mode						= {this.props.mode}
							isShowMedal					= {isShowMedal}
							event						= {this.props.event}
							onChangeScore				= {this.props.onChangeScore}
							customCss					= {this.props.customPlayerCss}
						/>
					);
				}
			}
		});
	},
	render: function() {
		return (
			<div className = {classNames('bPlayers', this.props.customCss)} >
				{ this.renderEditButton() }
				{ this.renderContent() }
			</div>
		);
	}
});

module.exports = Players;