const	React					= require('react'),

		EventHelper				= require('../../../../../helpers/eventHelper'),

		Actions					= require('./actions/actions'),
		Details					= require('./details'),
		Consts					= require('./details_components/consts'),
		ManagerGroupChanges 	= require('module/ui/manager_group_changes/managerGroupChanges'),
		ConfirmPopup 			= require('module/ui/confirm_popup'),
		EventConsts				= require('module/helpers/consts/events'),
		DetailsStyleCss			= require('../../../../../../../styles/ui/b_details.scss');

const DetailsWrapper = React.createClass({

	VENUE_SERVER_CLIENT_MAP: {
		"HOME"		: 'Home',
		"AWAY"		: 'Away',
		"CUSTOM"	: 'Away',
		"TBD"		: 'TBD'
	},

	propTypes:{
		schoolId:					React.PropTypes.string.isRequired,
		eventId:					React.PropTypes.string.isRequired,
		role:						React.PropTypes.string.isRequired,
		event: 						React.PropTypes.object.isRequired
	},
	getInitialState: function(){
		return {
			isLoading: 					true,
			eventDetails: 				{},
			backupEventDetails: 		{},
			changeMode: 				EventConsts.CHANGE_MODE.SINGLE,
			isEventDetailsPopupOpen: 	false
		};
	},
	/**
	 * We don't use componentWillMount, because we can't setState on unmount component
	 */
	componentDidMount: function() {
		let details;
		Actions.getDetailsByEventId(this.props.schoolId, this.props.eventId)
			.then(_details => {
				details = _details;

				return Actions.getEventById(this.props.schoolId, this.props.eventId);
			})
			.then(event => {
				this.backupEventDetails(details);
				this.setState({
					isLoading		: false,
					eventDetails	: details,
					eventName		: event.generatedNames[this.props.schoolId],
					officialName	: event.generatedNames.official,
					venue			: this.getVenueView(event)
				});
			});

	},
	/**
	 * Copy event details and set it as prop of component - this.backupEventDetails
	 * @param eventDetails
	 */
	backupEventDetails: function(eventDetails) {
		this.backupEventDetails = Object.assign(eventDetails);
	},
	restoreEventDetails: function() {
		this.setState({
			eventDetails: this.backupEventDetails
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
			case event.venue.venueType === 'TBD':
				return this.VENUE_SERVER_CLIENT_MAP['TBD'];
		}
	},
	submitChanges: function() {
		this.setState({ isEventDetailsPopupOpen: true });
	},
	handleChange: function(field, value) {
		// get old event details and update it
		const eventDetails = this.state.eventDetails;
		
		eventDetails[field] = value;
		this.setState({
			eventDetails: eventDetails
		});
	},
	onSave: function() {
		this.submitChanges();
	},
	onCancel: function() {
		this.restoreEventDetails();
	},
	isGroupEvent: function(){
		return typeof this.props.event.groupId !== 'undefined';
	},
	onClickRadioButton: function(mode){
		this.setState({ changeMode: mode });
	},
	renderEventDetailsPopupBody: function(){
		if (this.isGroupEvent()) {
			return (
				<ManagerGroupChanges
					onClickRadioButton = { this.onClickRadioButton }
				/>
			);
		} else {
			return (
				<div>Are you sure you want to update the selected event?</div>
			);
		}
	},
	handleClosePopup: function(){
		this.setState({ isEventDetailsPopupOpen: false });
	},
	handleClickOkButton: function(){
		const changeMode = this.state.changeMode;
		switch (true) {
			case changeMode === EventConsts.CHANGE_MODE.SINGLE:
				Actions.submitEventDetailsChangesById(this.props.schoolId, this.props.eventId, this.state.eventDetails)
					.then(updEventDetails => {
						this.setState({
							eventDetails : 				updEventDetails,
							isEventDetailsPopupOpen: 	false
						});
					});
				break;
			case changeMode === EventConsts.CHANGE_MODE.GROUP:
				Actions.submitEventGroupDetailsChangesById(this.props.schoolId, this.props.eventId, this.state.eventDetails)
					.then(updEventDetails => {
						this.setState({
							//if we change group of event, then server return array of details
							eventDetails : 				updEventDetails[0],
							isEventDetailsPopupOpen: 	false
						});
					});
				break;
			default:
				console.error('changeMode is invalid');
				break;
		}

	},
	renderEventDetailsPopup: function(){
		if (this.state.isEventDetailsPopupOpen) {
			return (
				<ConfirmPopup	okButtonText				= "Save"
								cancelButtonText			= "Cancel"
								handleClickOkButton			= { this.handleClickOkButton }
								handleClickCancelButton		= { this.handleClosePopup }
								customStyle					= 'mMiddle mFullWidth'
				>
					{ this.renderEventDetailsPopupBody() }
				</ConfirmPopup>
			);
		} else {
			return null;
		}

	},
	render: function() {
		if(this.state.isLoading) {
			return null;
		} else {
			return (
				<div>
					<Details	name					= { this.state.eventName }
								officialName			= { this.state.officialName }
								venue					= { this.state.venue }
								description				= { this.state.eventDetails.description }
								kitNotes				= { this.state.eventDetails.kitNotes }
								comments				= { this.state.eventDetails.comments }
								teamDeparts				= { this.state.eventDetails.teamDeparts }
								teamReturns				= { this.state.eventDetails.teamReturns }
								meetTime				= { this.state.eventDetails.meetTime }
								teaTime					= { this.state.eventDetails.teaTime }
								lunchTime				= { this.state.eventDetails.lunchTime }
								staff					= { this.state.eventDetails.staff }
								handleChange			= { this.handleChange }
								role					= { this.props.role }
								activeSchoolId			= { this.props.schoolId }
								onSave					= { this.onSave }
								onCancel				= { this.onCancel }
					/>
					{ this.renderEventDetailsPopup() }
				</div>
			);
		}
	}
});

module.exports = DetailsWrapper;