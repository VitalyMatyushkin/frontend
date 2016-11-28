const	React			= require('react'),

		EventHelper		= require('../../../../../helpers/eventHelper'),

		Actions			= require('./actions/actions'),
		Report			= require('./report'),
		Consts			= require('./match_report_components/consts');

const ReportWrapper = React.createClass({

	VENUE_SERVER_CLIENT_MAP: {
		"HOME"	: 'Home',
		"AWAY"	: 'Away',
		"TBC"	: 'TBC'
	},

	propTypes:{
		schoolId:	React.PropTypes.string.isRequired,
		eventId:	React.PropTypes.string.isRequired
	},
	getInitialState: function(){
		return {
			isLoading:		false,
			eventDetails:	{}
		};
	},

	componentWillMount: function() {
		Actions.getEventById(this.props.schoolId, this.props.eventId)
		.then(event => {
			let eventDetails = {};
			if(typeof event.details !== 'undefined') {
				eventDetails = event.details;
			}

			this.setState({
				isLoading		: false,
				eventName		: event.generatedNames[this.props.schoolId],
				eventDetails	: eventDetails,
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
				<Report	name				= {this.state.eventName}
						venue				= {this.state.venue}
						description			= {this.state.eventDetails.description}
						kitNotes			= {this.state.eventDetails.kitNotes}
						comments			= {this.state.eventDetails.comments}
						teamDeparts			= {this.state.eventDetails.teamDeparts}
						teamReturns			= {this.state.eventDetails.teamReturns}
						meetTime			= {this.state.eventDetails.meetTime}
						teaTime				= {this.state.eventDetails.teaTime}
						lunchTime			= {this.state.eventDetails.lunchTime}
						handleChange		= {this.handleChange}
						handleChangeMode	= {this.handleChangeMode}
				/>
			);
		}
	}
});

module.exports = ReportWrapper;