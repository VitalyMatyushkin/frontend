const	React			= require('react'),

		EventHelper		= require('../../../../../helpers/eventHelper'),

		Actions			= require('./actions/actions'),
		Details			= require('./details'),
		Consts			= require('./details_components/consts');

const DetailsWrapper = React.createClass({

	VENUE_SERVER_CLIENT_MAP: {
		"HOME"		: 'Home',
		"AWAY"		: 'Away',
		"CUSTOM"	: 'Away',
		"TBC"		: 'TBD'
	},

	propTypes:{
		schoolId:	React.PropTypes.string.isRequired,
		eventId:	React.PropTypes.string.isRequired,
		isParent:	React.PropTypes.bool.isRequired
	},
	getInitialState: function(){
		return {
			isLoading:		true,
			eventDetails:	{}
		};
	},

	componentWillMount: function() {
		let details;

		Actions.getDetailsByEventId(this.props.schoolId, this.props.eventId)
			.then(_details => {
				details = _details;

				return Actions.getEventById(this.props.schoolId, this.props.eventId);
			})
			.then(event => {
				this.setState({
					isLoading		: false,
					eventDetails	: details,
					eventName		: event.generatedNames[this.props.schoolId],
					officialName	: event.generatedNames.official,
					venue			: this.getVenueView(event)
				});
			});
	},
	getVenueView: function(event) {
		switch (true) {
			case EventHelper.isInterSchoolsEvent(event):
				return this.getInterSchoolsVenue(event);
			default:
				return this.VENUE_SERVER_CLIENT_MAP[event.venue.venueType];
		}
	},
	getInterSchoolsVenue: function(event) {
		switch (true) {
			case event.venue.venueType === 'HOME' && event.inviterSchoolId === this.props.schoolId:
				return this.VENUE_SERVER_CLIENT_MAP['HOME'];
			case event.venue.venueType === 'HOME' && event.inviterSchoolId !== this.props.schoolId:
				return this.VENUE_SERVER_CLIENT_MAP['AWAY'];
			case event.venue.venueType === 'AWAY' && event.inviterSchoolId === this.props.schoolId:
				return this.VENUE_SERVER_CLIENT_MAP['AWAY'];
			case event.venue.venueType === 'AWAY' && event.inviterSchoolId !== this.props.schoolId:
				return this.VENUE_SERVER_CLIENT_MAP['HOME'];
			case event.venue.venueType === 'CUSTOM':
				return this.VENUE_SERVER_CLIENT_MAP['CUSTOM'];
			case event.venue.venueType === 'TBC':
				return this.VENUE_SERVER_CLIENT_MAP['TBC'];
		}
	},
	submitChanges: function() {
		Actions.submitEventDetailsChangesById(this.props.schoolId, this.props.eventId, this.state.eventDetails)
			.then(updEventDetails => {
				this.setState({
					eventDetails : updEventDetails
				});
			});
	},

	handleChange: function(field, value) {
		const eventDetails = this.state.eventDetails;
		eventDetails[field] = value;

		this.setState({
			eventDetails : eventDetails
		});

	},
	handleChangeMode: function(currentMode) {
		switch (currentMode) {
			case Consts.REPORT_FILED_VIEW_MODE.EDIT:
				break;
			case Consts.REPORT_FILED_VIEW_MODE.VIEW:
				this.submitChanges();
				break;
		}
	},
	render: function() {
		if(this.state.isLoading) {
			return null;
		} else {
			return (
				<Details	name				= { this.state.eventName }
							officialName		= { this.state.officialName }
							venue				= { this.state.venue }
							description			= { this.state.eventDetails.description }
							kitNotes			= { this.state.eventDetails.kitNotes }
							comments			= { this.state.eventDetails.comments }
							teamDeparts			= { this.state.eventDetails.teamDeparts }
							teamReturns			= { this.state.eventDetails.teamReturns }
							meetTime			= { this.state.eventDetails.meetTime }
							teaTime				= { this.state.eventDetails.teaTime }
							lunchTime			= { this.state.eventDetails.lunchTime }
							handleChange		= { this.handleChange }
							handleChangeMode	= { this.handleChangeMode }
							isParent			= { this.props.isParent }
				/>
			);
		}
	}
});

module.exports = DetailsWrapper;