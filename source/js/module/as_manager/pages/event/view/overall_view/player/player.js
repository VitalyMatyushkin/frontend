const	React			= require('react'),
		PlayerInfo		= require('module/as_manager/pages/event/view/overall_view/player/player_info'),
		PlayerMedal		= require('module/as_manager/pages/event/view/overall_view/player/player_medal'),
		PlayerSchool	= require('module/as_manager/pages/event/view/overall_view/player/player_school'),
		PlayerHouse		= require('module/as_manager/pages/event/view/overall_view/player/player_house'),
		CaptainStar		= require('module/as_manager/pages/event/view/overall_view/player/captain_star'),
		PlayerScore		= require('module/as_manager/pages/event/view/overall_view/player/player_score'),
		{If}			= require('module/ui/if/if'),
		EventHelper		= require('module/helpers/eventHelper'),
		TeamHelper		= require('module/ui/managers/helpers/team_helper'),
		eventConst		= require('module/helpers/consts/events');

const	OverallPlayersStyle	= require('../../../../../../../../styles/ui/b_overall_player.scss');

const Player = React.createClass({
	propTypes: {
		playerIndex					: React.PropTypes.number.isRequired,
		player						: React.PropTypes.object.isRequired,
		playerPlace 				: React.PropTypes.number,
		isOwner						: React.PropTypes.bool.isRequired,
		individualScoreAvailable	: React.PropTypes.bool.isRequired,
		mode						: React.PropTypes.string.isRequired,
		isShowMedal					: React.PropTypes.bool.isRequired,
		event						: React.PropTypes.object.isRequired,
		onChangeScore				: React.PropTypes.func.isRequired,
		customCss					: React.PropTypes.string
	},
	isNonInternalEventForOneOnOneSport: function(event) {
		return TeamHelper.isOneOnOneSport(event) && !EventHelper.isInternalEvent(event);
	},
	renderInfo: function () {
		switch (true) {
			case EventHelper.isInterSchoolsEvent(this.props.event): {
				return <PlayerSchool player={this.props.player}/>;
			}
			case EventHelper.isHousesEvent(this.props.event): {
				return <PlayerHouse player={this.props.player}/>;
			}
		}
	},
	render: function() {
		const	playerIndex					= this.props.playerIndex,
				player						= this.props.player,
				playerPlace 				= this.props.playerPlace,
				mode						= this.props.mode,
				isShowMedal					= this.props.isShowMedal,
				event						= this.props.event,
				individualScoreAvailable	= this.props.individualScoreAvailable,
				isOwner						= this.props.isOwner;

		return (
			<div className='bOverallPlayer'>
				<If condition={Boolean(player.isCaptain)}>
					<CaptainStar/>
				</If>
				<PlayerInfo
					playerIndex	= {playerIndex}
					player		= {player}
					playerPlace = {playerPlace}
					isShowMedal = {isShowMedal}
				/>
				{ this.renderInfo() }
				<If condition={
						!this.isNonInternalEventForOneOnOneSport(event) &&
						(event.status === eventConst.EVENT_STATUS.FINISHED || mode === 'closing') &&
						individualScoreAvailable
					}
				>
					<PlayerScore
						player						= {player}
						event						= {event}
						mode						= {mode}
						isOwner						= {isOwner}
						individualScoreAvailable	= {individualScoreAvailable}
						onChange					= {this.props.onChangeScore}
					/>
				</If>
				<PlayerMedal
					playerPlace = {playerPlace}
					isShowMedal = {isShowMedal}
				/>
			</div>
		);
	}
});

module.exports = Player;