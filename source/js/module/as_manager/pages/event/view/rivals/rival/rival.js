const	React					= require('react'),
		RivalInfo				= require('module/as_manager/pages/event/view/rivals/rival_info/rival_info'),
		Players					= require('module/as_manager/pages/event/view/rivals/players'),
		IndividualScoreManager	= require('module/as_manager/pages/event/view/rivals/individual_score_manager/individual_score_manager'),
		TeamHelper				= require('module/ui/managers/helpers/team_helper'),
		propz					= require('propz'),
		classNames				= require('classnames'),
		RivalStyle				= require('../../../../../../../../styles/ui/rivals/b_rival.scss');

const Rival = React.createClass({
	propTypes: {
		rival:									React.PropTypes.object.isRequired,
		rivalIndex:								React.PropTypes.number.isRequired,
		event:									React.PropTypes.object.isRequired,
		mode:									React.PropTypes.string.isRequired,
		onChangeScore:							React.PropTypes.func.isRequired,
		onClickEditTeam:						React.PropTypes.func.isRequired,
		onChangeIndividualScoreAvailable:		React.PropTypes.func.isRequired,
		handleClickOpponentSchoolManagerButton:	React.PropTypes.func,
		activeSchoolId:							React.PropTypes.string.isRequired,
		isShowControlButtons:					React.PropTypes.bool
	},
	hasTeamPlayers: function() {
		const players = propz.get(this.props.rival, ['team', 'players']);

		return typeof players !== 'undefined' && players.length !== 0;
	},
	isShowIndividualScoreAvailableManager: function() {
		return (
			this.props.mode === 'closing' &&
			TeamHelper.isTeamSport(this.props.event) &&
			this.hasTeamPlayers() &&
			this.props.event.sport.individualResultsAvailable === true
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
		const rivalStyle = classNames({
			bRival	: true,
			mLeft	: this.props.rivalIndex % 2 === 0
		});

		return (
			<div className={rivalStyle}>
				<RivalInfo
					rival									= { this.props.rival }
					event									= { this.props.event }
					mode									= { this.props.mode }
					onChangeScore							= { this.props.onChangeScore }
					handleClickOpponentSchoolManagerButton	= { this.props.handleClickOpponentSchoolManagerButton }
					activeSchoolId							= { this.props.activeSchoolId }
					isShowControlButtons					= { this.props.isShowControlButtons }
				/>
				{ this.renderIndividualScoreAvailable() }
				<Players
					rival					= { this.props.rival }
					isOwner					= { true }
					mode					= { this.props.mode }
					event					= { this.props.event }
					activeSchoolId			= { this.props.activeSchoolId }
					onChangeScore			= { this.props.onChangeScore.bind(this, 'individualData') }
					onClickEditTeam			= { this.props.onClickEditTeam }
					customCss				= { '' }
					isShowControlButtons	= { this.props.isShowControlButtons }
				/>
			</div>
		);
	}
});

module.exports = Rival;