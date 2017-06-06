const	React			= require('react'),
		Player			= require('module/as_manager/pages/event/view/rivals/player/player'),
		EventHelper		= require('module/helpers/eventHelper'),
		PencilButton	= require('module/ui/pencil_button'),
		propz			= require('propz'),
		PlayersStyle	= require('../../../../../../../styles/ui/rivals/b_players.scss');

const Players = React.createClass({
	propTypes: {
		rival						: React.PropTypes.object.isRequired,
		isOwner						: React.PropTypes.bool.isRequired,
		mode						: React.PropTypes.string.isRequired,
		event						: React.PropTypes.object.isRequired,
		activeSchoolId				: React.PropTypes.string.isRequired,
		onChangeScore				: React.PropTypes.func.isRequired,
		onClickEditTeam				: React.PropTypes.func.isRequired,
		customCss					: React.PropTypes.string.isRequired,
		isShowControlButtons		: React.PropTypes.bool
	},
	SELECT_TEAM_LATER:		'Select team later',
	NO_TEAM_MEMBERS:		'No team members to display',
	MEMBERS_NOT_ADDED:		'Team members have not been added yet',
	ACCEPTED_BY_OPPONENT:	'Accepted by opponent but team members have not been added yet',
	AWAITING_OPPONENT:		'Awaiting opponent',
	renderContent: function() {
		const	event		= this.props.event,
				eventType	= event.eventType;

		if (eventType === EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools']) {
			return this.renderPlayersForInterSchoolsEvent();
		} else if (eventType === EventHelper.clientEventTypeToServerClientTypeMapping['houses']) {
			return this.renderPlayersForHousesEvent();
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
			return this.renderPlayers();
		} else {
			return this.renderNotificationTextForInterSchoolsEvent();
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
				} else if(rival.invite.status !== 'ACCEPTED') {							// Invite was not accepted yet
					return this.renderText(this.AWAITING_OPPONENT);
				} else if(
					rival.invite.status === 'ACCEPTED' &&							// Select team later
					typeof players === 'undefined'
				) {
					return this.renderText(this.ACCEPTED_BY_OPPONENT);
				} else if(
					rival.invite.status === 'ACCEPTED' &&							// Team was set, but empty
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
			return this.renderPlayers();
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
			return this.renderPlayers();
		}
	},
	renderEditButton: function() {
		const	event			= this.props.event,
				rivalSchoolId	= this.props.rival.school.id,
				mode			= this.props.mode;

		switch (true) {
			case !this.props.isShowControlButtons:
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
	renderPlayers: function() {
		const players = this.props.rival.team.players;

		//we sort array of players by individual score
		//this.sortPlayersByScore(players);

		return players.map((player, playerIndex) =>
			<Player
				key							= {playerIndex}
				playerIndex					= {playerIndex}
				player						= {player}
				isOwner						= {this.props.isOwner}
				individualScoreAvailable	= {this.props.rival.isIndividualScoreAvailable}
				mode						= {this.props.mode}
				event						= {this.props.event}
				onChangeScore				= {this.props.onChangeScore}
				customCss					= {this.props.customCss}
			/>
		);
	},
	render: function() {
		return (
			<div className="bPlayers">
				{ this.renderEditButton() }
				{ this.renderContent() }
			</div>
		);
	}
});

module.exports = Players;