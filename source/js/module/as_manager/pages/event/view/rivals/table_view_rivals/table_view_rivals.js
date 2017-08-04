// main components
const	React					= require('react');

// react components 
const	TableViewRival			= require('module/as_manager/pages/event/view/rivals/table_view_rivals/table_view_rival/table_view_rival'),
		Header					= require('module/as_manager/pages/event/view/rivals/table_view_rivals/table_view_rival/header');

// helpers
const	RivalInfoOptionsHelper	= require('module/as_manager/pages/event/view/rivals/helpers/rival_info_options_helper');

// styles
const	TableRivalsStyle		= require('../../../../../../../../styles/ui/b_table_view_rivals/b_table_view_rivals.scss');

const TableViewRivals = React.createClass({
	propTypes: {
		// data
		rivals:									React.PropTypes.array.isRequired,
		mode:									React.PropTypes.string.isRequired,
		event:									React.PropTypes.object.isRequired,

		// options
		activeSchoolId:							React.PropTypes.string.isRequired,
		isShowControlButtons:					React.PropTypes.bool,

		// handlers
		onChangeScore:							React.PropTypes.func.isRequired,
		onClickEditTeam:						React.PropTypes.func.isRequired,
		onChangeIndividualScoreAvailable:		React.PropTypes.func.isRequired,
		handleClickOpponentSchoolManagerButton:	React.PropTypes.func,
		handleClickRemoveTeamButton:			React.PropTypes.func
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
				/>
			);
		}));

		return <div className="bTableViewRivals"> { rivals } </div>;
	}
});

module.exports = TableViewRivals;