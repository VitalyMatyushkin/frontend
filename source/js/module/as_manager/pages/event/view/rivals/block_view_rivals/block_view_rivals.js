// main components
import {ResultBlock} from "../result_block/result_block";

const	React       = require('react'),
		classNames  = require('classnames');

// react components
const BlockViewRival  = require('module/as_manager/pages/event/view/rivals/block_view_rivals/block_view_rival/block_view_rival');
const {ResultBlock}  = require('module/as_manager/pages/event/view/rivals/result_block/result_block');

// helpers
const RivalInfoOptionsHelper  = require('module/as_manager/pages/event/view/rivals/helpers/rival_info_options_helper');
const TeamHelper = require('module/ui/managers/helpers/team_helper');
const EventHelper = require('module/helpers/eventHelper');

// styles
const	BlockViewRivalsStyle    = require('styles/ui/b_block_view_rivals/b_block_view_rivals.scss');
const   ResultStyle             = require('styles/ui/b_result_block.scss');

const BlockViewRivals = React.createClass({
	propTypes: {
		// data
		rivals:									React.PropTypes.array.isRequired,
		mode:									React.PropTypes.string.isRequired,
		schoolType:								React.PropTypes.string.isRequired,
		event:									React.PropTypes.object.isRequired,

		// options
		activeSchoolId:							React.PropTypes.string.isRequired,
		isShowControlButtons:					React.PropTypes.bool,
		viewMode:								React.PropTypes.string,

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

		const	rivals		= [];
		let		row			= [];

		rivalsData.forEach((rival, rivalIndex) => {
			row.push(
				<BlockViewRival
					key										= { `rival_${rivalIndex}` }
					viewMode								= { this.props.viewMode }
					schoolType								= { this.props.schoolType }
					rivalIndex								= { rivalIndex }
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
					isPublicSite                            = { this.props.isPublicSite }
				/>
			);

			if(
				rivalIndex % 2 !== 0 ||
				rivalIndex === rivalsData.length - 1
			) {
				const rivalRowStyle = classNames({
					eBlockViewRivals_row	: true,
					mFirst					: this.props.rivalIndex  === 1
				});

				rivals.push(
					<div
						key			= {`rival_row_${rivalIndex}`}
						className	= {rivalRowStyle}
					>
						{row}
					</div>
				);
				row = [];
			}
		});

		return (
			<div className="bBlockViewRivals">
				{ this.renderResultBlock() }
				{ rivals }
			</div>
		);
	}
});

module.exports = BlockViewRivals;