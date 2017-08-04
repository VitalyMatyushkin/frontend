const	React						= require('react'),
		TableViewSchoolRivalInfo	= require('module/as_manager/pages/event/view/rivals/table_view_rivals/table_view_rival/table_view_rival_info/table_view_school_rival_info'),
		TableViewHouseRivalInfo		= require('module/as_manager/pages/event/view/rivals/table_view_rivals/table_view_rival/table_view_rival_info/table_view_house_rival_info'),
		TableViewInternalRivalInfo	= require('module/as_manager/pages/event/view/rivals/table_view_rivals/table_view_rival/table_view_rival_info/table_view_internal_rival_info'),
		EventHelper					= require('module/helpers/eventHelper');

const TableViewRivalInfo = React.createClass({
	propTypes: {
		onClick:		React.PropTypes.func.isRequired,
		rivalIndex:		React.PropTypes.number.isRequired,
		rival:			React.PropTypes.object.isRequired,
		event:			React.PropTypes.object.isRequired,
		mode:			React.PropTypes.string.isRequired,
		onChangeScore:	React.PropTypes.func.isRequired,
		activeSchoolId:	React.PropTypes.string.isRequired,
		isLast:			React.PropTypes.bool.isRequired,
		options:		React.PropTypes.object
	},
	render: function() {
		switch (true) {
			case this.props.event.eventType === EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools']:
				return (
					<TableViewSchoolRivalInfo
						onClick			= { this.props.onClick }
						activeSchoolId	= { this.props.activeSchoolId }
						rivalIndex		= { this.props.rivalIndex }
						rival			= { this.props.rival }
						event			= { this.props.event }
						mode			= { this.props.mode }
						onChangeScore	= { this.props.onChangeScore }
						isLast			= { this.props.isLast }
						options			= { this.props.options }
					/>
				);
			case this.props.event.eventType === EventHelper.clientEventTypeToServerClientTypeMapping['houses']:
				return (
					<TableViewHouseRivalInfo
						onClick			= { this.props.onClick }
						activeSchoolId	= { this.props.activeSchoolId }
						rivalIndex		= { this.props.rivalIndex }
						rival			= { this.props.rival }
						event			= { this.props.event }
						mode			= { this.props.mode }
						isLast			= { this.props.isLast }
						onChangeScore	= { this.props.onChangeScore }
					/>
				);
			case this.props.event.eventType === EventHelper.clientEventTypeToServerClientTypeMapping['internal']:
				return (
					<TableViewInternalRivalInfo
						onClick			= { this.props.onClick }
						activeSchoolId	= { this.props.activeSchoolId }
						rivalIndex		= { this.props.rivalIndex }
						rival			= { this.props.rival }
						event			= { this.props.event }
						mode			= { this.props.mode }
						isLast			= { this.props.isLast }
						onChangeScore	= { this.props.onChangeScore }
					/>
				);
			default:
				return null;
		}
	}
});

module.exports = TableViewRivalInfo;