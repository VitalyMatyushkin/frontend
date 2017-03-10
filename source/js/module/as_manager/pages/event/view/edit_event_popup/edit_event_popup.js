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

		binding.atomically()
			.set('eventEditForm.model',			Immutable.fromJS(this.props.event))
			.set('eventEditForm.originModel',	Immutable.fromJS(this.props.event))
			.commit();
	},
	/**
	 * Function returns TRUE if event data was changed.
	 * @param origin - original state of event
	 * @param current - current state of event
	 * @returns {boolean}
	 */
	isDataChanged: function(origin, current) {
		return (
			origin.startTime !== current.startTime ||
			this.getPostcodeIdFromVenue(origin.venue) !== this.getPostcodeIdFromVenue(current.venue)
		);
	},
	/**
	 * Function returns id of venue.
	 * In relation of situation venue can contains id or _id
	 * @param venue - venue model
	 * @returns {string}
	 */
	getPostcodeIdFromVenue: function(venue) {
		return typeof venue.postcodeData._id !== "undefined" ? venue.postcodeData._id : venue.postcodeData.id;
	},
	handleClickOkButton: function() {
		const binding = this.getDefaultBinding();

		const	currentEvent	= binding.toJS('eventEditForm.model'),
				originEvent		= binding.toJS('eventEditForm.originModel');

		if(this.isDataChanged(originEvent, currentEvent)) {
			const body = {
				startTime: currentEvent.startTime
			};

			// TODO copy cat from event_manager.setEventVenue
			const venue = currentEvent.venue;
			body.venue = {
				venueType: venue.venueType
			};
			if(venue.postcodeData.id !== 'TBD') {
				const postcodeId = this.getPostcodeIdFromVenue(venue);
				body.venue.postcodeId = postcodeId;
			}

			return window.Server.schoolEvent.put(
				{
					schoolId	: this.props.activeSchoolId,
					eventId		: currentEvent.id
				},
				body
			).then(() => {
				return window.Server.schoolEvent.get({
					schoolId	: this.props.activeSchoolId,
					eventId		: currentEvent.id
				});
			}).then(updEvent => {
				this.props.handleSuccessSubmit(updEvent);
			});
		} else {
			binding.get('eventEditForm').clear();
			this.props.handleClosePopup();
		}
	},
	handleClickCancelButton: function() {
		const binding = this.getDefaultBinding();

		binding.get('eventEditForm').clear();
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
							customStyle				= 'mBig mFullWidth'
			>
				<EventEditForm binding={binding.sub('eventEditForm')}/>
			</ConfirmPopup>
		);
	}
});

module.exports = EditEventPopup;