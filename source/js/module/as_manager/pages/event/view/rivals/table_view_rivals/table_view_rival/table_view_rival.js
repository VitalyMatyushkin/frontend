const	React					= require('react'),
		classNames				= require('classnames'),
		propz					= require('propz');

const	TableViewRivalInfo		= require('module/as_manager/pages/event/view/rivals/table_view_rivals/table_view_rival/table_view_rival_info/table_view_rival_info'),
		IndividualScoreManager	= require('module/as_manager/pages/event/view/rivals/individual_score_manager/individual_score_manager'),
		Players					= require('module/as_manager/pages/event/view/rivals/players');

const	TeamHelper				= require('module/ui/managers/helpers/team_helper');

const EventFormConsts = require('module/as_manager/pages/events/manager/event_form/consts/consts');

const	TableViewRivalStyle				= require('../../../../../../../../../styles/ui/b_table_view_rivals/b_table_view_rivals.scss'),
		TableViewRivalPlayersBlocStyle	= require('../../../../../../../../../styles/ui/b_table_view_rivals/b_table_view_rival_players_block.scss');

const TableViewRival = React.createClass({
	propTypes: {
		activeSchoolId:						React.PropTypes.string.isRequired,
		schoolType:							React.PropTypes.object.isRequired,
		rival:								React.PropTypes.object.isRequired,
		rivalIndex:							React.PropTypes.number.isRequired,
		event:								React.PropTypes.object.isRequired,
		mode:								React.PropTypes.string.isRequired,
		onChangeScore:						React.PropTypes.func.isRequired,
		onClickEditTeam:					React.PropTypes.func.isRequired,
		onChangeIndividualScoreAvailable:	React.PropTypes.func.isRequired,
		isLast:								React.PropTypes.bool.isRequired,
		rivalInfoOptions:					React.PropTypes.object,
		isShowControlButtons:				React.PropTypes.bool
	},
	getInitialState: function(){
		return {
			isPlayersBlockOpen: false
		};
	},
	componentWillReceiveProps: function(newProps) {
		newProps.mode === 'general' && this.setState({isPlayersBlockOpen: false});
		newProps.mode === 'closing' && this.setState({isPlayersBlockOpen: true});
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
	onInfoBlockClick: function() {
		this.setState({isPlayersBlockOpen: !this.state.isPlayersBlockOpen});
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
		return (
			<IndividualScoreManager
				value		= { this.props.rival.isIndividualScoreAvailable }
				onChange	= { this.onChangeIndividualScoreAvailable }
			/>
		);
	},
	renderPlayers: function() {
		return (
			<Players
				rival					= { this.props.rival }
				isOwner					= { true }
				mode					= { this.props.mode }
				event					= { this.props.event }
				activeSchoolId			= { this.props.activeSchoolId }
				onChangeScore			= { this.onChangePlayerScore }
				onClickEditTeam			= { this.onClickEditTeam }
				customCss				= { 'mTableView' }
				customPlayerCss			= { 'mTableView' }
				isShowControlButtons	= { this.props.isShowControlButtons }
			/>
		);
	},
	renderPlayersBlock: function() {
		let playersBlock = null;

		if(this.state.isPlayersBlockOpen) {
			let playersBlockComponents = [];
			if(this.isShowIndividualScoreAvailableManager()) {
				playersBlockComponents.push( this.renderIndividualScoreAvailable() );
			}
			playersBlockComponents.push( this.renderPlayers() );

			const classNameStyle =  classNames({
				bTableViewRivalPlayersBlock:	true,
				mLastItem:						this.props.isLast
			});

			playersBlock = (
				<div className={ classNameStyle }>
					{ playersBlockComponents } 
				</div>
			);
		}

		return playersBlock;
	},
	render: function() {
		return (
			<div className='eTableViewRivals_row'>
				<TableViewRivalInfo
					onClick			= { this.onInfoBlockClick }
					rivalIndex		= { this.props.rivalIndex }
					schoolType		= { this.props.schoolType }
					rival			= { this.props.rival }
					event			= { this.props.event }
					mode			= { this.props.mode }
					onChangeScore	= { this.onChangeRivalInfoScore }
					activeSchoolId	= { this.props.activeSchoolId }
					options			= { this.props.rivalInfoOptions }
					isLast			= { this.props.isLast }
				/>
				{ this.renderPlayersBlock() }
			</div>
		);
	}
});

module.exports = TableViewRival;