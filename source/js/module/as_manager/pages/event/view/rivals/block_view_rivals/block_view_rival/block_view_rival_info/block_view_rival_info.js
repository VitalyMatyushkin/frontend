const	React						= require('react'),
		BlockViewSchoolRivalInfo	= require('module/as_manager/pages/event/view/rivals/block_view_rivals/block_view_rival/block_view_rival_info/block_view_school_rival_info'),
		BlockViewHouseRivalInfo		= require('module/as_manager/pages/event/view/rivals/block_view_rivals/block_view_rival/block_view_rival_info/block_view_house_rival_info'),
		BlockViewInternalRivalInfo	= require('module/as_manager/pages/event/view/rivals/block_view_rivals/block_view_rival/block_view_rival_info/block_view_internal_rival_info'),
		EventHelper					= require('module/helpers/eventHelper');

const BlockViewRivalInfo = React.createClass({
	propTypes: {
		rival:			React.PropTypes.object.isRequired,
		event:			React.PropTypes.object.isRequired,
		mode:			React.PropTypes.string.isRequired,
		onChangeScore:	React.PropTypes.func.isRequired,
		activeSchoolId:	React.PropTypes.string.isRequired,
		options:		React.PropTypes.object,
		isPublicSite:   React.PropTypes.bool.isRequired
	},
	render: function() {
		switch (true) {
			case this.props.event.eventType === EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools']:
				return (
						<BlockViewSchoolRivalInfo
							activeSchoolId	= { this.props.activeSchoolId }
							rival			= { this.props.rival }
							event			= { this.props.event }
							mode			= { this.props.mode }
							onChangeScore	= { this.props.onChangeScore }
							options			= { this.props.options }
							isPublicSite    = { this.props.isPublicSite }
						/>
					);
			case this.props.event.eventType === EventHelper.clientEventTypeToServerClientTypeMapping['houses']:
				return (
					<BlockViewHouseRivalInfo
						activeSchoolId	= { this.props.activeSchoolId }
						rival			= { this.props.rival }
						event			= { this.props.event }
						mode			= { this.props.mode }
						onChangeScore	= { this.props.onChangeScore }
					/>
				);
			case this.props.event.eventType === EventHelper.clientEventTypeToServerClientTypeMapping['internal']:
				return (
					<BlockViewInternalRivalInfo
						activeSchoolId	= { this.props.activeSchoolId }
						rival			= { this.props.rival }
						event			= { this.props.event }
						mode			= { this.props.mode }
						onChangeScore	= { this.props.onChangeScore }
						options			= { this.props.options }
					/>
				);
			default:
				return null;
		}
	}
});

module.exports = BlockViewRivalInfo;