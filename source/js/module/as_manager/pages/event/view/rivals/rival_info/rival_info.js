const	React				= require('react'),
		SchoolRivalInfo		= require('module/as_manager/pages/event/view/rivals/rival_info/school_rival_info'),
		HouseRivalInfo		= require('module/as_manager/pages/event/view/rivals/rival_info/house_rival_info'),
		InternalRivalInfo	= require('module/as_manager/pages/event/view/rivals/rival_info/internal_rival_info'),
		EventHelper			= require('module/helpers/eventHelper');

const RivalInfo = React.createClass({
	propTypes: {
		rival:									React.PropTypes.object.isRequired,
		event:									React.PropTypes.object.isRequired,
		mode:									React.PropTypes.string.isRequired,
		viewMode:								React.PropTypes.string,
		onChangeScore:							React.PropTypes.func.isRequired,
		handleClickChangeOpponentSchoolButton:	React.PropTypes.func,
		activeSchoolId:							React.PropTypes.string.isRequired,
		isShowControlButtons:					React.PropTypes.bool
	},
	render: function() {
		switch (true) {
			case this.props.event.eventType === EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools']:
				return (
					<SchoolRivalInfo
						rival									= { this.props.rival }
						event									= { this.props.event }
						mode									= { this.props.mode }
						viewMode								= { this.props.viewMode }
						onChangeScore							= { this.props.onChangeScore }
						handleClickOpponentSchoolManagerButton	= { this.props.handleClickOpponentSchoolManagerButton }
						activeSchoolId							= { this.props.activeSchoolId }
						isShowControlButtons					= { this.props.isShowControlButtons }
					/>
				);
			case this.props.event.eventType === EventHelper.clientEventTypeToServerClientTypeMapping['houses']:
				return (
					<HouseRivalInfo
						rival									= { this.props.rival }
						event									= { this.props.event }
						mode									= { this.props.mode }
						onChangeScore							= { this.props.onChangeScore }
						activeSchoolId							= { this.props.activeSchoolId }
					/>
				);
			case this.props.event.eventType === EventHelper.clientEventTypeToServerClientTypeMapping['internal']:
				return (
					<InternalRivalInfo
						rival									= { this.props.rival }
						event									= { this.props.event }
						mode									= { this.props.mode }
						onChangeScore							= { this.props.onChangeScore }
						activeSchoolId							= { this.props.activeSchoolId }
					/>
				);
			default:
				return null;
		}
	}
});

module.exports = RivalInfo;