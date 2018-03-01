// main components
const	React					= require('react');

// react components 
const	TableViewRival			= require('module/as_manager/pages/event/view/rivals/table_view_rivals/table_view_rival/table_view_rival'),
		Header					= require('module/as_manager/pages/event/view/rivals/table_view_rivals/table_view_rival/header');
const {ResultBlock}  = require('module/as_manager/pages/event/view/rivals/result_block/result_block');

// helpers
const RivalInfoOptionsHelper = require('module/as_manager/pages/event/view/rivals/helpers/rival_info_options_helper');
const TeamHelper = require('module/ui/managers/helpers/team_helper');
const EventHelper = require('module/helpers/eventHelper');

// styles
const	TableRivalsStyle		= require('../../../../../../../../styles/ui/b_table_view_rivals/b_table_view_rivals.scss');

const TableViewRivals = React.createClass({
	propTypes: {
		// data
		rivals:									React.PropTypes.array.isRequired,
		mode:									React.PropTypes.string.isRequired,
		schoolType:								React.PropTypes.string.isRequired,
		event:									React.PropTypes.object.isRequired,

		// options
		activeSchoolId:							React.PropTypes.string.isRequired,
		isShowControlButtons:					React.PropTypes.bool,

		// handlers
		onChangeScore:							React.PropTypes.func.isRequired,
		onClickEditTeam:						React.PropTypes.func.isRequired,
		onChangeIndividualScoreAvailable:		React.PropTypes.func.isRequired,
		handleClickOpponentSchoolManagerButton:	React.PropTypes.func,
		handleClickRemoveTeamButton:			React.PropTypes.func,
		isPublicSite:                           React.PropTypes.bool.isRequired
	},
	getSettings: function () {
		return this.props.event.settings.find(s => s.schoolId === this.props.activeSchoolId);
	},
	renderResultBlock: function () {
		const settings = this.getSettings();
		let isDisplayResultsOnPublic = typeof settings !== 'undefined' ? settings.isDisplayResultsOnPublic : true;

		if(
			this.props.isPublicSite &&
			TeamHelper.isInterSchoolsEventForTeamSport(this.props.event) &&
			!EventHelper.isNotFinishedEvent(this.props.event) &&
			!isDisplayResultsOnPublic
		) {
			return (
				<ResultBlock
					rivals={this.props.rivals}
					event={this.props.event}
					activeSchoolId={this.props.activeSchoolId}
				/>
			);
		} else {
			return null;
		}
	},
	render: function() {
		const	rivalsData	= this.props.rivals,
				event		= this.props.event,
				mode		= this.props.mode;

		let rivals = [
			<div className="bTableViewRivalsHeaderWrapper">
				<Header
					key			= "header"
					eventType	= { this.props.event.eventType }
				/>
			</div>
		];
		rivals = rivals.concat(rivalsData.map((rival, rivalIndex) => {
			return (
				<TableViewRival
					key										= { `rival_${rivalIndex}` }
					rivalIndex								= { rivalIndex }
					schoolType								= { this.props.schoolType }
					rival									= { rival }
					event									= { event }
					mode									= { mode }
					onChangeScore							= { this.props.onChangeScore }
					onClickEditTeam							= { this.props.onClickEditTeam }
					onChangeIndividualScoreAvailable		= { this.props.onChangeIndividualScoreAvailable }
					rivalInfoOptions						= {
						RivalInfoOptionsHelper.getOptionsObjectForRivalInfoByRival(
							rival,
							this.props.activeSchoolId,
							this.props.schoolType,
							event,
							rivalsData,
							this.props.isShowControlButtons,
							{
								handleClickOpponentSchoolManagerButton:	this.props.handleClickOpponentSchoolManagerButton,
								handleClickRemoveTeamButton:			this.props.handleClickRemoveTeamButton
							}
						)
					}
					isShowControlButtons					= { this.props.isShowControlButtons }
					activeSchoolId							= { this.props.activeSchoolId }
					isLast									= { rivalIndex === rivalsData.length - 1 }
					isPublicSite                            = { this.props.isPublicSite }
				/>
			);
		}));

		return (
			<div className="bTableViewRivals">
				{ this.renderResultBlock() }
				{ rivals }
			</div>
		);
	}
});

module.exports = TableViewRivals;