
const	React				= require('react'),
		Morearty			= require('morearty'),
		Immutable			= require('immutable');

const	{ConfirmPopup}		= require('module/ui/confirm_popup'),
		EventConsts			= require('module/helpers/consts/events'),
		EventEditForm		= require('./edit_event_form');

const EditEventPopup = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		activeSchoolId		: React.PropTypes.string.isRequired,
		activeSchool		: React.PropTypes.object.isRequired,
		event				: React.PropTypes.object.isRequired,
		schoolType			: React.PropTypes.string.isRequired,
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
		if(typeof this.props.event.endTime === "undefined") {
			this.initEndTime();
		}
	},
	initEndTime: function () {
		const binding = this.getDefaultBinding();

		binding.set('eventEditForm.model.endTime', Immutable.fromJS(this.props.event.startTime));
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
			origin.endTime !== current.endTime ||
			this.getPostcodeIdFromVenue(origin.venue) !== this.getPostcodeIdFromVenue(current.venue) ||
			this.isOthersCoordinates(origin.venue.point.coordinates, current.venue.point.coordinates)
		);
	},
	/**
	 * Function returns true if event data for group edit was changed
	 * @param origin - original state of event
	 * @param current - current state of event
	 * @returns {*}
	 */
	isGroupDataChanged: function (origin, current) {
		return (
			this.isStartTimeChanged(origin, current) ||
			this.isFinishTimeChanged(origin, current) ||
			this.isPostcodeChanged(origin, current)
		);
	},
	isPostcodeChanged: function (origin, current) {
		return this.getPostcodeIdFromVenue(origin.venue) !== this.getPostcodeIdFromVenue(current.venue);
	},
	isStartTimeChanged: function (origin, current) {
		const originStartDate = origin.startTime;
		const currentStartDate= current.startTime;

		const originStartDateObject = new Date(originStartDate);
		const currentStartDateObject = new Date(currentStartDate);

		return (
			originStartDateObject.getHours() !== currentStartDateObject.getHours() ||
			originStartDateObject.getMinutes() !== currentStartDateObject.getMinutes()
		);
	},
	isFinishTimeChanged: function (origin, current) {
		const originStartDate = origin.endTime;
		const currentStartDate= current.endTime;

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
	isOthersCoordinates: function(originCoordinates, currentCoordinates) {
		return (
			originCoordinates.length !== currentCoordinates.length ||
			originCoordinates[0] !== currentCoordinates[0] ||
			originCoordinates[1] !== currentCoordinates[1]
		);
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
			// For club events
			// When user changed data enable for group editing and click save button first time
			case (
				this.isGroupDataChanged(originEvent, currentEvent) &&
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
					startTime:	currentEvent.startTime,
					endTime:	currentEvent.endTime
				};

				// TODO copy cat from event_manager.setEventVenue
				const venue = currentEvent.venue;
				body.venue = {
					venueType: venue.venueType,
					point: venue.point
				};
				if(venue.venueType !== 'TBD') {
					const postcodeId = this.getPostcodeIdFromVenue(venue);
					body.venue.postcodeId = postcodeId;

					if (venue.postcodeData.placeId) {
						body.venue.placeId = venue.postcodeData.placeId;
					}
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
					activeSchool	= { this.props.activeSchool }
					schoolType		= { this.props.schoolType }
					binding			= { binding.sub('eventEditForm') }
				/>
			</ConfirmPopup>
		);
	}
});

module.exports = EditEventPopup;