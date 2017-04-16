const	React			= require('react'),
		SchoolRivalInfo	= require('module/as_manager/pages/event/view/rivals/rival_info/school_rival_info'),
		EventHelper		= require('module/helpers/eventHelper');

const RivalInfo = React.createClass({
	propTypes: {
		rival:						React.PropTypes.object.isRequired,
		event:						React.PropTypes.object.isRequired,
		mode:						React.PropTypes.string.isRequired,
		onChangeScore:				React.PropTypes.func.isRequired,
		activeSchoolId:				React.PropTypes.string.isRequired
	},
	render: function() {
		switch (true) {
			case this.props.event.eventType === EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools']:
				return (
					<SchoolRivalInfo
						rival						= { this.props.rival }
						event						= { this.props.event }
						mode						= { this.props.mode }
						onChangeScore				= { this.props.onChangeScore }
						activeSchoolId				= { this.props.activeSchoolId }
					/>
				);
			case this.props.event.eventType === EventHelper.clientEventTypeToServerClientTypeMapping['houses']:
				return (
					<div>
						HOUSE_RIVAL_INFO
					</div>
				);
			case this.props.event.eventType === EventHelper.clientEventTypeToServerClientTypeMapping['internal']:
				return (
					<div>
						TEAM_RIVAL_INFO
					</div>
				);
			default:
				return null;
		}
	}
});

module.exports = RivalInfo;