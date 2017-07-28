const	React				= require('react'),
		SchoolRivalInfo		= require('module/as_manager/pages/event/view/rivals/rival_info/school_rival_info'),
		HouseRivalInfo		= require('module/as_manager/pages/event/view/rivals/rival_info/house_rival_info'),
		InternalRivalInfo	= require('module/as_manager/pages/event/view/rivals/rival_info/internal_rival_info'),
		TeamHelper			= require('module/ui/managers/helpers/team_helper'),
		EventHelper			= require('module/helpers/eventHelper');

const RivalInfo = React.createClass({
	propTypes: {
		rival:			React.PropTypes.object.isRequired,
		event:			React.PropTypes.object.isRequired,
		mode:			React.PropTypes.string.isRequired,
		viewMode:		React.PropTypes.string.isRequired,
		onChangeScore:	React.PropTypes.func.isRequired,
		activeSchoolId:	React.PropTypes.string.isRequired,
		options:		React.PropTypes.object
	},
	render: function() {
		switch (true) {
			case this.props.event.eventType === EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools']:
				if (this.props.options.viewMode === 'show_all' && TeamHelper.isInterSchoolsEventForIndividualSport(this.props.event)) {
					return null;
				} else {
					return (
						<SchoolRivalInfo
							activeSchoolId	= { this.props.activeSchoolId }
							rival			= { this.props.rival }
							event			= { this.props.event }
							mode			= { this.props.mode }
							onChangeScore	= { this.props.onChangeScore }
							options			= { this.props.options }
						/>
					);
				}
			case this.props.event.eventType === EventHelper.clientEventTypeToServerClientTypeMapping['houses']:
				return (
					<HouseRivalInfo
						activeSchoolId	= { this.props.activeSchoolId }
						rival			= { this.props.rival }
						event			= { this.props.event }
						mode			= { this.props.mode }
						onChangeScore	= { this.props.onChangeScore }
					/>
				);
			case this.props.event.eventType === EventHelper.clientEventTypeToServerClientTypeMapping['internal']:
				return (
					<InternalRivalInfo
						activeSchoolId	= { this.props.activeSchoolId }
						rival			= { this.props.rival }
						event			= { this.props.event }
						mode			= { this.props.mode }
						onChangeScore	= { this.props.onChangeScore }
					/>
				);
			default:
				return null;
		}
	}
});

module.exports = RivalInfo;