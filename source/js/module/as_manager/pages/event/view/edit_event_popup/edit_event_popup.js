
const	React				= require('react'),
		Morearty			= require('morearty'),
		Immutable			= require('immutable');

const	ConfirmPopup		= require('./../../../../../ui/confirm_popup'),
		EventConsts			= require('module/helpers/consts/events'),
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
			.set('isProcessingSubmit',					false)
			.set('eventEditForm.model',					Immutable.fromJS(this.props.event))
			.set('eventEditForm.changeMode',			EventConsts.CHANGE_MODE.SINGLE)
			.set('eventEditForm.isShowChangesManager',	false)
			.set('eventEditForm.originModel',			Immutable.fromJS(this.props.event))
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
	isPostcodeChanged: function (origin, current) {
		return this.getPostcodeIdFromVenue(origin.venue) !== this.getPostcodeIdFromVenue(current.venue);
	},
	isTimeChanged: function (origin, current) {
		const originStartDate = origin.startTime;
		const currentStartDate= current.startTime;

		const originStartDateObject = new Date(originStartDate);
		const currentStartDateObject = new Date(currentStartDate);

		return (
			originStartDateObject.getHours() !== currentStartDateObject.getHours() ||
			originStartDateObject.getMinutes() !== currentStartDateObject.getMinutes()
		);
	},
	showChangesManager: function () {
		const binding = this.getDefaultBinding();

		binding.set('eventEditForm.isShowChangesManager', true);
	},
	isShowChangesManager: function () {
		const binding = this.getDefaultBinding();

		return binding.toJS('eventEditForm.isShowChangesManager');
	},
	isGroupEvent: function () {
		const binding = this.getDefaultBinding();

		return typeof binding.toJS('eventEditForm.model.groupId') !== 'undefined';
	},
	/**
	 * Function returns id of venue.
	 * In depend of situation venue can contains id or _id
	 * @param venue - venue model
	 * @returns {string}
	 */
	getPostcodeIdFromVenue: function(venue) {
		const postcode = venue.postcodeData;

		if(typeof postcode !== 'undefined') {
			return typeof postcode._id !== "undefined" ? postcode._id : postcode.id;
		}
	},
	getEditEventService: function () {
		const binding = this.getDefaultBinding();

		if(binding.toJS('eventEditForm.changeMode') === EventConsts.CHANGE_MODE.GROUP) {
			return window.Server.schoolEventGroup;
		} else {
			return window.Server.schoolEvent;
		}
	},
	handleClickOkButton: function() {
		const binding = this.getDefaultBinding();

		const	currentEvent	= binding.toJS('eventEditForm.model'),
				originEvent		= binding.toJS('eventEditForm.originModel');

		switch (true) {
			case (
				(
					this.isTimeChanged(originEvent, currentEvent) ||
					this.isPostcodeChanged(originEvent, currentEvent)
				) &&
				!this.isShowChangesManager() &&
				this.isGroupEvent()
			): {
				this.showChangesManager();
				break;
			}
			case (
				this.isDataChanged(originEvent, currentEvent)
			): {
				const body = {
					startTime: currentEvent.startTime
				};

				// TODO copy cat from event_manager.setEventVenue
				const venue = currentEvent.venue;
				body.venue = {
					venueType: venue.venueType
				};
				if(venue.venueType !== 'TBD') {
					const postcodeId = this.getPostcodeIdFromVenue(venue);
					body.venue.postcodeId = postcodeId;
				}

				binding.set('isProcessingSubmit', true);
				this.getEditEventService().put(
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
				break;
			}
			default: {
				binding.get('eventEditForm').clear();
				this.props.handleClosePopup();
				break;
			}
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
							isOkButtonDisabled		= { binding.toJS('isProcessingSubmit') }
							handleClickOkButton		= { this.handleClickOkButton }
							handleClickCancelButton	= { this.handleClickCancelButton }
							customStyle				= 'mMiddle mFullWidth'
			>
				<EventEditForm
					activeSchoolId	= { this.props.activeSchoolId }
					binding			= { binding.sub('eventEditForm') }
				/>
			</ConfirmPopup>
		);
	}
});

module.exports = EditEventPopup;