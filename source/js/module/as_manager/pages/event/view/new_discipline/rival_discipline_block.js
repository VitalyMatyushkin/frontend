const	React				= require('react'),
		classNames			= require('classnames'),
		Score				= require('module/ui/score/score'),
		propz				= require('propz'),
		SportConsts			= require('module/helpers/consts/sport'),
		RivalPerformanceBlockHeader = require('module/as_manager/pages/event/view/new_performance/rival_performance_block_header'),
		PerformanceStyle	= require('../../../../../../../styles/pages/event/b_event_performance_teams.scss');

const RivalDisciplineBlock = React.createClass({
	propTypes: {
		rival:				React.PropTypes.object.isRequired,
		event:				React.PropTypes.object.isRequired,
		disciplineItems:	React.PropTypes.bool.isRequired,
		disciplineValues:	React.PropTypes.bool.isRequired,
		isEditMode:			React.PropTypes.bool.isRequired,
		handleValueChange:	React.PropTypes.func.isRequired,
		activeSchoolId:		React.PropTypes.string.isRequired
	},
	handleValueChange: function(userId, permissionId, teamId, disciplineId, value) {
		this.props.isEditMode && this.props.handleValueChange(userId, permissionId, teamId, disciplineId, value);
	},
	getDisciplineItemValueByUserId: function (disciplineItemId, userId) {
		const foundDisciplineItemValue = this.props.disciplineValues.find(
			disciplineItemValue =>
				disciplineItemValue.disciplineId === disciplineItemId &&
				disciplineItemValue.userId === userId
		);

		if(typeof foundDisciplineItemValue !== "undefined") {
			return foundDisciplineItemValue.value;
		} else {
			return 0;
		}
	},
	renderPlayerDisciplineItems: function(player) {
		return this.props.disciplineItems.map(disciplineItem => {
			return (
				<div	key			= { disciplineItem._id }
						className	= "ePlayer_disciplineItem"
				>
					<div className="ePlayer_disciplineItemName">
						{ disciplineItem.namePlural }
					</div>
					<div className="ePlayer_disciplineItemValueContainer">
						<Score	isChangeMode	= { this.props.isEditMode }
								plainPoints		= { this.getDisciplineItemValueByUserId(disciplineItem._id, player.userId) }
								pointsStep		= { 1 }
								pointsType		= { SportConsts.SPORT_POINTS_TYPE.PLAIN }
								onChange		= {
									this.handleValueChange.bind(
										null,
										player.userId,
										player.permissionId,
										this.props.rival.team.id,
										disciplineItem._id
									)
								}
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
						<div className="ePlayer_discipline">
							{ this.renderPlayerDisciplineItems(player) }
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

module.exports = RivalDisciplineBlock;