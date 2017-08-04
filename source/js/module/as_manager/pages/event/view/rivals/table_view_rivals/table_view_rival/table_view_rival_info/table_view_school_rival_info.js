const	React				= require('react');

const	propz				= require('propz'),
		classNames			= require('classnames');

const	Order				= require('module/as_manager/pages/event/view/rivals/table_view_rivals/table_view_rival/table_view_rival_info/components/order'),
		RivalInfo			= require('module/as_manager/pages/event/view/rivals/table_view_rivals/table_view_rival/table_view_rival_info/components/rival_info'),
		Actions				= require('module/as_manager/pages/event/view/rivals/table_view_rivals/table_view_rival/table_view_rival_info/components/actions'),
		Rank				= require('module/as_manager/pages/event/view/rivals/table_view_rivals/table_view_rival/table_view_rival_info/components/rank'),
		Score				= require('module/as_manager/pages/event/view/rivals/table_view_rivals/table_view_rival/table_view_rival_info/components/score');

const	TableViewRivalStyle	= require('../../../../../../../../../../styles/ui/b_table_view_rivals/b_table_view_rival.scss');

const TableViewSchoolRivalInfo = React.createClass({
	propTypes: {
		onClick:								React.PropTypes.func.isRequired,
		rivalIndex:								React.PropTypes.number.isRequired,
		rival:									React.PropTypes.object.isRequired,
		event:									React.PropTypes.object.isRequired,
		mode:									React.PropTypes.string.isRequired,
		onChangeScore:							React.PropTypes.func.isRequired,
		activeSchoolId:							React.PropTypes.string.isRequired,
		isLast:									React.PropTypes.bool.isRequired,
		options:								React.PropTypes.object
	},
	getOrder: function() {
		return this.props.rivalIndex + 1;
	},
	getRivalName: function() {
		const	teamName	= this.getTeamName(),
				schoolName	= this.getSchoolName();

		switch (true) {
			case typeof teamName === "undefined":
				return schoolName;
			case typeof schoolName === "undefined":
				return teamName;
			default:
				return `${teamName} / ${schoolName}`;
		}
	},
	getTeamName: function() {
		return propz.get(this.props.rival, ['team','name']);
	},
	getSchoolName: function () {
		return this.props.rival.school.name;
	},
	getRivalStyleName: function() {
		const classNameStyle =  classNames({
			bTableViewRival:	true,
			mLastItem:			this.props.isLast
		});

		return classNameStyle;
	},
	render: function() {
		return (
			<div
				onClick		= { this.props.onClick }
				className	= { this.getRivalStyleName() }
			>
				<Order
					order = { this.getOrder() }
				/>
				<RivalInfo
					eventType	= { this.props.event.eventType }
					pic			= { this.props.rival.school.pic }
					name		= { this.getRivalName() }
				/>
				<Rank
					rival	= { this.props.rival }
					event	= { this.props.event }
				/>
				<Score
					rivalIndex		= { this.props.rivalIndex }
					rival			= { this.props.rival }
					event			= { this.props.event }
					mode			= { this.props.mode }
					onChangeScore	= { this.props.onChangeScore }
				/>
				<Actions
					rival	= { this.props.rival }
					options	= { this.props.options }
				/>
			</div>
		);
	}
});

module.exports = TableViewSchoolRivalInfo;