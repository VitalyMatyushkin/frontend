const	React						= require('react'),
		classNames					= require('classnames'),
		StarRatingBar				= require('module/ui/star_rating_bar/star_rating_bar'),
		propz						= require('propz'),
		RivalPerformanceBlockHeader = require('module/as_manager/pages/event/view/new_performance/rival_performance_block_header'),
		PerformanceStyle			= require('../../../../../../../styles/pages/event/b_event_performance_teams.scss');

const RivalPerformanceBlock = React.createClass({
	propTypes: {
		rival:				React.PropTypes.object.isRequired,
		event:				React.PropTypes.object.isRequired,
		isEditMode:			React.PropTypes.bool.isRequired,
		handleValueChange:	React.PropTypes.func.isRequired,
		activeSchoolId:		React.PropTypes.string.isRequired
	},
	handleValueChange: function(player, permissionId, performanceId, value) {
		this.props.isEditMode && this.props.handleValueChange(player, permissionId, performanceId, value);
	},
	renderPlayerPerformance: function(player) {
		const event = this.props.event;

		return event && event.sport && event.sport.performance && event.sport.performance.map(pItem => {
				// player performance data
				const pData = (
						event.results &&
						event.results.individualPerformance &&
						event.results.individualPerformance.find(pUserData =>
							pUserData.performanceId === pItem._id && pUserData.userId === player.userId
						)
					),
					value = pData ? pData.value : 0;

				return (
					<div key={pItem._id} className="ePlayer_performanceItem">
						<div className="ePlayer_performanceItemName">
							{pItem.name}
						</div>
						<div className="ePlayer_performanceItemValueContainer">
							<StarRatingBar	starCount			= {5}
											isEditMode			= {this.props.isEditMode}
											value				= {value}
											handleValueChanges	= {this.handleValueChange.bind(
												null,
												player,
												player.permissionId,
												pItem._id
											)}
							/>
						</div>
					</div>
				);
			});
	},
	renderPlayers: function() {
		let xmlPlayers = null;

		const players = propz.get(this.props.rival, ['team', 'players']);

		if(typeof players !== 'undefined') {
			xmlPlayers = players.map((player, playerIndex) => {
				const playerStyle = classNames({
					'bPlayer'		: true,
					'mPerformance'	: true,
					'mLast'			: players.length === playerIndex + 1
				});

				return (
					<div	key			= {playerIndex}
							className	= {playerStyle}
					>
						<div className="ePlayer_name mBold">
							<span>{player.firstName} {player.lastName}</span>
						</div>
						<div className="ePlayer_performance">
							{this.renderPlayerPerformance(player)}
						</div>
					</div>
				);
			});
		}

		return (
			<div className="eEventPerformance_team">
				{ xmlPlayers }
			</div>
		);
	},
	render: function() {
		return (
			<div className="eEventPerformance_col">
				<RivalPerformanceBlockHeader
					rival	= { this.props.rival }
					event	= { this.props.event }
				/>
				{ this.renderPlayers() }
			</div>
		);
	}
});

module.exports = RivalPerformanceBlock;