const	React						= require('react'),
		propz						= require('propz'),
		classNames					= require('classnames'),
		BlockViewRivalInfo			= require('module/as_manager/pages/event/view/rivals/block_view_rivals/block_view_rival/block_view_rival_info/block_view_rival_info'),
		Players						= require('module/as_manager/pages/event/view/rivals/players'),
		IndividualScoreManager		= require('module/as_manager/pages/event/view/rivals/individual_score_manager/individual_score_manager'),
		ViewModeConsts				= require('module/ui/view_selector/consts/view_mode_consts'),
		TeamHelper					= require('module/ui/managers/helpers/team_helper'),
		BlockViewRivalStyle			= require('../../../../../../../../../styles/ui/b_block_view_rivals/b_block_view_rival.scss');

const EventFormConsts = require('module/as_manager/pages/events/manager/event_form/consts/consts');

const BlockViewRival = React.createClass({
	propTypes: {
		viewMode:								React.PropTypes.string.isRequired,
		schoolType:								React.PropTypes.string.isRequired,
		activeSchoolId:							React.PropTypes.string.isRequired,
		rival:									React.PropTypes.object.isRequired,
		rivalIndex:								React.PropTypes.number.isRequired,
		event:									React.PropTypes.object.isRequired,
		mode:									React.PropTypes.string.isRequired,
		onChangeScore:							React.PropTypes.func.isRequired,
		onClickEditTeam:						React.PropTypes.func.isRequired,
		onChangeIndividualScoreAvailable:		React.PropTypes.func.isRequired,
		rivalInfoOptions:						React.PropTypes.object,
		isShowControlButtons:					React.PropTypes.bool
	},
	onChangeRivalInfoScore: function(scoreBundleName, scoreData) {
		this.props.onChangeScore(
			this.props.rivalIndex,
			scoreBundleName,
			scoreData
		);
	},
	onChangePlayerScore: function(scoreData, player) {
		this.props.onChangeScore(
			this.props.rivalIndex,
			'individualData',
			scoreData,
			player
		);
	},
	onClickEditTeam: function() {
		this.props.onClickEditTeam(this.props.rivalIndex);
	},
	onChangeIndividualScoreAvailable: function() {
		this.props.onChangeIndividualScoreAvailable(this.props.rivalIndex);
	},
	handleClickOpponentSchoolManagerButton: function() {
		this.props.handleClickOpponentSchoolManagerButton(this.props.rivalIndex);
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
			this.props.event.sport.individualResultsAvailable === true &&
			this.props.schoolType === EventFormConsts.EVENT_FORM_MODE.SCHOOL
		);
	},
	renderIndividualScoreAvailable: function() {
		if(this.isShowIndividualScoreAvailableManager()) {
			return (
				<IndividualScoreManager
					value		= { this.props.rival.isIndividualScoreAvailable }
					onChange	= { this.onChangeIndividualScoreAvailable }
				/>
			);
		} else {
			return null;
		}
	},
	renderBlockView: function () {
		switch (true) {
			case this.props.viewMode === ViewModeConsts.VIEW_MODE.BLOCK_VIEW: {
				return (
					<BlockViewRivalInfo
						rival			= { this.props.rival }
						event			= { this.props.event }
						mode			= { this.props.mode }
						onChangeScore	= { this.onChangeRivalInfoScore }
						activeSchoolId	= { this.props.activeSchoolId }
						options			= { this.props.rivalInfoOptions }
					/>
				);
			}
			case this.props.viewMode === ViewModeConsts.VIEW_MODE.OVERALL_VIEW: {
				return null;
			}
		}
	},
	render: function() {
		const rivalStyle = classNames({
			bBlockViewRival			: this.props.viewMode !== ViewModeConsts.VIEW_MODE.OVERALL_VIEW,
			bBlockViewRivalSingle	: this.props.viewMode === ViewModeConsts.VIEW_MODE.OVERALL_VIEW,
			mLeft					: this.props.rivalIndex % 2 === 0
		});

		return (
			<div className={rivalStyle}>
				{ this.renderBlockView() }
				{ this.renderIndividualScoreAvailable() }
				<Players
					viewMode				= { this.props.viewMode }
					rival					= { this.props.rival }
					isOwner					= { true }
					mode					= { this.props.mode }
					event					= { this.props.event }
					activeSchoolId			= { this.props.activeSchoolId }
					onChangeScore			= { this.onChangePlayerScore }
					onClickEditTeam			= { this.onClickEditTeam }
					customCss				= { '' }
					isShowControlButtons	= { this.props.isShowControlButtons }
				/>
			</div>
		);
	}
});

module.exports = BlockViewRival;