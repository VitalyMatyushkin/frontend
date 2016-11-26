const	React			= require('react'),

		Actions			= require('./actions/actions'),
		Report			= require('./report'),
		Consts			= require('./match_report_components/consts');

const ReportWrapper = React.createClass({

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
				venue			: this.getVenueTextFromEvent(event)
			});
		});
	},
	getVenueTextFromEvent: function(event) {
		switch (event.venue.venueType) {
			case "HOME":
				return "Home";
			case "AWAY":
				return "Away";
			case "TBC":
				return "TBC";
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