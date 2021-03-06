const	React			= require('react'),
		PlayerInfo		= require('module/as_manager/pages/event/view/rivals/player/player_info'),
		CaptainStar		= require('module/as_manager/pages/event/view/rivals/player/captain_star'),
		PlayerScore		= require('module/as_manager/pages/event/view/rivals/player/player_score'),
		classNames		= require('classnames'),
		{If}			= require('module/ui/if/if'),
		EventHelper		= require('module/helpers/eventHelper'),
		TeamHelper		= require('module/ui/managers/helpers/team_helper'),
		eventConst		= require('module/helpers/consts/events');

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
	render: function() {
		const	playerIndex					= this.props.playerIndex,
				player						= this.props.player,
				playerPlace 				= this.props.playerPlace,
				mode						= this.props.mode,
				isShowMedal					= this.props.isShowMedal,
				event						= this.props.event,
				individualScoreAvailable	= this.props.individualScoreAvailable,
				isOwner						= this.props.isOwner;

		let eventPlayerCss = classNames(
			'_bPlayer _mMini',
			this.props.customCss,
			{
				mIndividuals: TeamHelper.isIndividualSport(event)
			}
		);

		return (
			<div className={eventPlayerCss}>
				<PlayerInfo
					event       = {event}
					playerIndex	= {playerIndex}
					player		= {player}
					playerPlace = {playerPlace}
					isShowMedal = {isShowMedal}
				/>
				<If condition={Boolean(player.isCaptain)}>
					<CaptainStar/>
				</If>
				<If condition={Boolean(player.sub)}>
					<span className="ePlayer_sub">(S)</span>
				</If>
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
			</div>
		);
	}
});

module.exports = Player;