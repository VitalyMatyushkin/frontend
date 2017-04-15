const	React					= require('react'),
		RivalInfo				= require('module/as_manager/pages/event/view/rivals/rival_info/rival_info'),
		Players					= require('module/as_manager/pages/event/view/rivals/players'),
		IndividualScoreManager	= require('module/as_manager/pages/event/view/rivals/individual_score_manager/individual_score_manager'),
		TeamHelper				= require('module/ui/managers/helpers/team_helper'),
		propz					= require('propz');

const Rival = React.createClass({
	propTypes: {
		rival:								React.PropTypes.object.isRequired,
		event:								React.PropTypes.object.isRequired,
		mode:								React.PropTypes.string.isRequired,
		onChangeScore:						React.PropTypes.func.isRequired,
		onClickEditTeam:					React.PropTypes.func.isRequired,
		onChangeIndividualScoreAvailable:	React.PropTypes.func.isRequired,
		activeSchoolId:						React.PropTypes.string.isRequired
	},
	hasTeamPlayers: function() {
		const players = propz.get(this.props.rival, ['team', 'players']);

		return typeof players !== 'undefined' && players.length !== 0;
	},
	isShowIndividualScoreAvailableManager: function() {
		return (
			this.props.mode === 'closing' &&
			TeamHelper.isTeamSport(this.props.event) &&
			this.hasTeamPlayers()
		);
	},
	renderIndividualScoreAvailable: function() {
		if(this.isShowIndividualScoreAvailableManager()) {
			return (
				<IndividualScoreManager
					value		= { this.props.rival.isIndividualScoreAvailable }
					onChange	= { this.props.onChangeIndividualScoreAvailable }
				/>
			);
		} else {
			return null;
		}
	},
	render: function() {
		return (
			<div className="bEventTeams_col">
				<RivalInfo
					rival						= { this.props.rival }
					event						= { this.props.event }
					mode						= { this.props.mode }
					individualScoreAvailable	= { this.props.rival.isIndividualScoreAvailable }
					onChangeScore				= { this.props.onChangeScore }
					activeSchoolId				= { this.props.activeSchoolId }
				/>
				{ this.renderIndividualScoreAvailable() }
				<Players
					rival						= { this.props.rival }
					isOwner						= { true }
					individualScoreAvailable	= { this.props.rival.isIndividualScoreAvailable }
					mode						= { this.props.mode }
					event						= { this.props.event }
					activeSchoolId				= { this.props.activeSchoolId }
					onChangeScore				= { this.props.onChangeScore.bind(this, 'individualData') }
					onClickEditTeam				= { this.props.onClickEditTeam }
					customCss					= { '' }
				/>
			</div>
		);
	}
});

module.exports = Rival;