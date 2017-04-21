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
		customCss					: React.PropTypes.string.isRequired
	},
	SELECT_PLAYERS_LATER:	'Select players later...',
	MEMBERS_NOT_ADDED:		'Team members have not been added yet',
	ACCEPTED_BY_OPPONENT:	'Accepted by opponent',
	AWAITING_OPPONENT:		'Awaiting opponent...',
	renderContent: function() {
		const	event		= this.props.event,
				eventType	= event.eventType;

		if (eventType === EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools']) {
			return this.renderPlayersForInterSchoolsEvent();
		} else if (eventType === EventHelper.clientEventTypeToServerClientTypeMapping['houses']) {
			return this.renderPlayersForHousesEvent();
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
		const	rival			= this.props.rival,
				eventStatus		= this.props.event.status,
				players			= propz.get(this.props.rival, ['team', 'players']),
				activeSchoolId	= this.props.activeSchoolId;

		if(
			typeof players === 'undefined' &&
			activeSchoolId === rival.school.id
		) {
			return this.renderText(this.MEMBERS_NOT_ADDED);
		} else if(
			typeof players === 'undefined' &&
			activeSchoolId !== rival.school.id &&
			(
				eventStatus === EventHelper.EVENT_STATUS.ACCEPTED ||
				eventStatus === EventHelper.EVENT_STATUS.FINISHED
			)
		) {
			return this.renderText(this.ACCEPTED_BY_OPPONENT);
		} else if(
			typeof players === 'undefined' &&
			activeSchoolId !== rival.school.id
		) {
			return this.renderText(this.AWAITING_OPPONENT);
		} else if(typeof players !== 'undefined') {
			return this.renderPlayers();
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
	renderEditButton: function() {
		const	event			= this.props.event,
				rivalSchoolId	= this.props.rival.school.id,
				mode			= this.props.mode;

		if(EventHelper.isInterSchoolsEvent(event) && rivalSchoolId !== this.props.activeSchoolId) {
			return null;
		} else if(mode !== 'closing') {
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