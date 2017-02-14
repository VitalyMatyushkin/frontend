const	React				= require('react'),
		Morearty			= require('morearty'),
		Immutable			= require('immutable');

const	ConfirmPopup		= require('./../../../../../ui/confirm_popup'),
		EventEditForm		= require('./edit_event_form');

const EditEventPopup = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		activeSchoolId		: React.PropTypes.string.isRequired,
		event				: React.PropTypes.object.isRequired,
		handleSuccessSubmit	: React.PropTypes.func.isRequired,
		handleClosePopup	: React.PropTypes.func.isRequired
	},
	componentWillMount: function() {
		const binding = this.getDefaultBinding();

		binding.set('eventEditForm.model', Immutable.fromJS(this.props.event));
	},
	handleClickOkButton: function() {
		const binding = this.getDefaultBinding();

		const event = binding.toJS('eventEditForm.model');

		const body = {
			startTime: event.startTime
		};

		// TODO copy cat from event_manager.setEventVenue
		const modelVenue = event.venue;
		body.venue = {
			venueType: modelVenue.venueType
		};
		// TODO _id and id - it's a little trick, sorry.
		// TODO venue component write id and it's need for event_manager component
		if(modelVenue.postcodeData.id !== 'TBD') {
			const postcodeId = typeof modelVenue.postcodeData._id !== "undefined" ? modelVenue.postcodeData._id : modelVenue.postcodeData.id;

			body.venue.postcodeId = postcodeId;
		}

		return window.Server.schoolEvent.put(
			{
				schoolId	: this.props.activeSchoolId,
				eventId		: event.id
			},
			body
		).then(() => {
			return window.Server.schoolEvent.get({
				schoolId	: this.props.activeSchoolId,
				eventId		: event.id
			});
		}).then(updEvent => {
			this.props.handleSuccessSubmit(updEvent);
		});
	},
	handleClickCancelButton: function() {
		const binding = this.getDefaultBinding();

		binding.sub('eventEditForm').clear();
		this.props.handleClosePopup();
	},
	render: function() {
		const	self	= this,
				binding	= self.getDefaultBinding();

		return (
			<ConfirmPopup	okButtonText			= "Save"
							cancelButtonText		= "Cancel"
							isOkButtonDisabled		= {false}
							handleClickOkButton		= {this.handleClickOkButton}
							handleClickCancelButton	= {this.handleClickCancelButton}
							customStyle				= 'mBig'
			>
				<EventEditForm binding={binding.sub('eventEditForm')}/>
			</ConfirmPopup>
		);
	}
});

module.exports = EditEventPopup;