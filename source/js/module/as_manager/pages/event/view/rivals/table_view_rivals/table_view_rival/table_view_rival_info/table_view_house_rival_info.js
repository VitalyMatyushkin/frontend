const	React				= require('react');

const	propz				= require('propz');

const	Order				= require('module/as_manager/pages/event/view/rivals/table_view_rivals/table_view_rival/table_view_rival_info/components/order'),
		RivalInfo			= require('module/as_manager/pages/event/view/rivals/table_view_rivals/table_view_rival/table_view_rival_info/components/rival_info'),
		Score				= require('module/as_manager/pages/event/view/rivals/table_view_rivals/table_view_rival/table_view_rival_info/components/score');

const	TableViewRivalStyle	= require('../../../../../../../../../../styles/ui/b_table_view_rivals/b_table_view_rival.scss');

const TableViewHouseRivalInfo = React.createClass({
	propTypes: {
		onClick:		React.PropTypes.func.isRequired,
		rivalIndex:		React.PropTypes.number.isRequired,
		rival:			React.PropTypes.object.isRequired,
		event:			React.PropTypes.object.isRequired,
		mode:			React.PropTypes.string.isRequired,
		onChangeScore:	React.PropTypes.func.isRequired,
		isLast:			React.PropTypes.bool.isRequired,
		activeSchoolId:	React.PropTypes.string.isRequired
	},
	getOrder: function() {
		return this.props.rivalIndex + 1;
	},
	getRivalName: function() {
		const	teamName	= this.getTeamName(),
				houseName	= this.getHouseName();

		switch (true) {
			case typeof teamName === "undefined":
				return houseName;
			case typeof houseName === "undefined":
				return teamName;
			default:
				return `${teamName} / ${houseName}`;
		}
	},
	getTeamName: function() {
		return propz.get(this.props.rival, ['team','name']);
	},
	getHouseName: function () {
		return this.props.rival.house.name;
	},
	render: function() {
		return (
			<div
				onClick		= { this.props.onClick }
				className	="bTableViewRival"
			>
				<Order
					order = { this.getOrder() }
				/>
				<RivalInfo
					eventType	= { this.props.event.eventType }
					pic			= { this.props.rival.school.pic }
					name		= { this.getRivalName() }
				/>
				<Score
					rivalIndex		= { this.props.rivalIndex }
					rival			= { this.props.rival }
					event			= { this.props.event }
					mode			= { this.props.mode }
					onChangeScore	= { this.props.onChangeScore }
				/>
			</div>
		);
	}
});

module.exports = TableViewHouseRivalInfo;