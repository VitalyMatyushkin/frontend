const	React   = require('react');
const   propz   = require('propz');

const	ActionList  = require('../../../../../ui/action_list/action_list');

const	EventHelper = require('module/helpers/eventHelper'),
		TeamHelper  = require('../../../../../ui/managers/helpers/team_helper');

const	EventButtonsWrapperStyles   = require('styles/ui/b_event_buttons_wrapper.scss'),
		LinkStyles                  = require('styles/pages/event/b_event_eLink_cancel_event.scss');

const   EventFormConsts = require('module/as_manager/pages/events/manager/event_form/consts/consts');

/**
 * This component displays the buttons "Close event", "Change score", "Save", "Cancel".
 * */
const Buttons = React.createClass({
	propTypes: {
		event											: React.PropTypes.object.isRequired,
		mode											: React.PropTypes.string.isRequired,
		activeSchoolId  								: React.PropTypes.string.isRequired,
		schoolType										: React.PropTypes.string.isRequired,
		// TRUE if active school id ==== inviter school id
		isInviterSchool									: React.PropTypes.bool.isRequired,
		isUserSchoolWorker								: React.PropTypes.bool.isRequired,
		isParent										: React.PropTypes.bool.isRequired,
		isStudent										: React.PropTypes.bool.isRequired,
		isShowScoreEventButtonsBlock					: React.PropTypes.bool.isRequired,

		// Cancel event handlers
		handleClickCancelEventButtonOnActionList: React.PropTypes.func.isRequired,
		handleClickCancelEventAndEditNotificationListButtonOnActionList: React.PropTypes.func.isRequired,

		handleChangeIsDisplayResultsOnPublic			: React.PropTypes.func.isRequired,
		handleClickCloseEvent							: React.PropTypes.func.isRequired,
		handleClickDownloadPdf							: React.PropTypes.func.isRequired,
		onReportAvailabilityEvent						: React.PropTypes.func.isRequired,
		handleClickDownloadCSV							: React.PropTypes.func.isRequired,
		onClickCloseCancel								: React.PropTypes.func.isRequired,
		onClickOk										: React.PropTypes.func.isRequired,
		onSendConsentRequest							: React.PropTypes.func.isRequired,
		onReportNotParticipate							: React.PropTypes.func.isRequired,
		onClickDeleteEvent								: React.PropTypes.func.isRequired,
		onClickAddSchool								: React.PropTypes.func.isRequired,
		onClickAddTeam									: React.PropTypes.func.isRequired
	},
	getInviteForActiveSchool: function(event) {
		const invites = event.invites;

		let invite;
		if(typeof invites !== 'undefined') {
			invite = invites.find(invite => invite.invitedSchoolId === this.props.activeSchoolId);
		}

		return invite;
	},
	/**
	 * The function render's container with buttons "Close event"/"Change score" and button "Cancel" for event
	 */
	renderScoreEventButtonsContainer: function() {
		const actions = this.getActionList();

		let actionList = null;
		if(actions.length > 0) {
			actionList = (
				<ActionList	buttonText				= 'Actions'
				            actionList				= { actions }
				            handleClickActionItem	= { this.handleClickActionItem }
				/>
			);
		}

		return actionList;
	},
	getActionList: function() {
		const actionList = [];

		if(this.props.isUserSchoolWorker) {
			actionList.push({id:'create', text:'Create Event Like This'});
		}

		if(this.isAddSchoolAvailable()) {
			actionList.push({id:'add_school', text:'Add School'});
		}

		if(this.isAddTeamAvailable()) {
			actionList.push({id:'add_team', text:'Add Team'});
		}

		if(this.isCloseEventActionAvailable()) {
			actionList.push({id:'close', text:'Close Event'});
		}

		if(this.isSendConsentRequestAvailable()) {
			actionList.push({id:'send_consent_request', text:'Send Consent Request'});
		}

		if(this.isChangeScoreEventActionAvailable()) {
			actionList.push({id:'change', text:'Update Scores'});
		}

		if(this.isCancelEventActionAvailable()) {
			actionList.push({id:'cancel', text:'Cancel Event'});
		}

		if(this.isCancelEventActionAvailable()) {
			actionList.push({id:'cancel_and_edit_notification_list', text:'Cancel Event And Edit Notification List'});
		}

		if(this.isReportAvailabilityAvailable()) {
			actionList.push({id:'report_availability', text:'Report Availability'});
		}

		const invite = this.getInviteForActiveSchool(this.props.event);
		const inviteStatus = propz.get(invite, ['status']);
		if(
			inviteStatus !== EventHelper.EVENT_STATUS.REJECTED &&
			this.props.event.status !== "CANCELED" &&
			this.props.isUserSchoolWorker &&
			this.props.schoolType === EventFormConsts.EVENT_FORM_MODE.SCHOOL
		) {
			actionList.push({id: 'download_pdf', text: 'Print'});
			actionList.push({id: 'download_csv', text: 'Download CSV'});
		}

		if(
			inviteStatus !== EventHelper.EVENT_STATUS.REJECTED &&
			this.props.activeSchoolId === this.props.event.inviterSchoolId &&
			this.props.isUserSchoolWorker
		) {
			actionList.push({id: 'delete_event', text: 'Delete Event'});
		}

		return actionList;
	},
	isReportAvailabilityAvailable: function () {
		return (
			(
				this.props.isParent ||
				this.props.isStudent
			) &&
			EventHelper.isNotFinishedEvent(this.props.event) &&
			this.isNotExpiredEventTime() &&
			this.props.schoolType === EventFormConsts.EVENT_FORM_MODE.SCHOOL
		);
	},
	isAddSchoolAvailable: function() {
		const eventStatus = this.props.event.status;

		return (
			this.props.isUserSchoolWorker &&
			TeamHelper.isMultiparty(this.props.event) &&
			EventHelper.isInterSchoolsEvent(this.props.event) &&
			this.props.isInviterSchool &&
			eventStatus !== EventHelper.EVENT_STATUS.FINISHED &&
			eventStatus !== EventHelper.EVENT_STATUS.REJECTED &&
			eventStatus !== EventHelper.EVENT_STATUS.CANCELED
		);
	},
	isAddTeamAvailable: function() {
		const event = this.props.event;
		const eventStatus = this.props.event.status;
		const invite = this.getInviteForActiveSchool(event);
		const inviteStatus = propz.get(invite, ['status']);

		return (
			this.props.isUserSchoolWorker &&
			TeamHelper.isMultiparty(this.props.event) &&
			(
				TeamHelper.isInterSchoolsEventForTeamSport(this.props.event) ||
				TeamHelper.isInternalEventForTeamSport(this.props.event)
			) &&
			eventStatus !== EventHelper.EVENT_STATUS.FINISHED &&
			eventStatus !== EventHelper.EVENT_STATUS.REJECTED &&
			eventStatus !== EventHelper.EVENT_STATUS.CANCELED &&
			inviteStatus !== EventHelper.EVENT_STATUS.REJECTED &&
			this.props.schoolType === EventFormConsts.EVENT_FORM_MODE.SCHOOL
		);
	},
	isCancelEventActionAvailable: function() {
		const event = this.props.event;
		const eventStatus = this.props.event.status;
		const invite = this.getInviteForActiveSchool(event);
		const inviteStatus = propz.get(invite, ['status']);

		return (
			this.props.isUserSchoolWorker &&
			this.props.activeSchoolId === event.inviterSchoolId &&
			eventStatus !== EventHelper.EVENT_STATUS.FINISHED &&
			eventStatus !== EventHelper.EVENT_STATUS.REJECTED &&
			eventStatus !== EventHelper.EVENT_STATUS.CANCELED &&
			inviteStatus !== EventHelper.EVENT_STATUS.REJECTED
		);
	},
	isCloseEventActionAvailable: function() {
		const eventStatus = this.props.event.status;

		return (
			this.props.isUserSchoolWorker &&
			eventStatus === EventHelper.EVENT_STATUS.ACCEPTED &&
			(
				this.props.schoolType === EventFormConsts.EVENT_FORM_MODE.SCHOOL ||
				(
					this.props.schoolType === EventFormConsts.EVENT_FORM_MODE.SCHOOL_UNION &&
					(
						TeamHelper.isTeamSport(this.props.event) ||
						TeamHelper.isOneOnOneSport(this.props.event) ||
						TeamHelper.isTwoOnTwoSport(this.props.event)
					)
				)
			)
		);
	},
	isNotExpiredEventTime: function() {
		const	today		= new Date(),
			eventTime	= new Date(this.props.event.startTime);

		// not expired if event date is today
		if(
			today.getFullYear() === eventTime.getFullYear() &&
			today.getMonth() === eventTime.getMonth() &&
			today.getDate() === eventTime.getDate()
		) {
			return true;
		} else {
			const todayTimeStamp = new Date(
				today.getFullYear(),
				today.getMonth(),
				today.getDate()
			).getTime();

			const eventTimeStamp = new Date(
				eventTime.getFullYear(),
				eventTime.getMonth(),
				eventTime.getDate()
			).getTime();

			return (todayTimeStamp <= eventTimeStamp);
		}

	},
	isChangeScoreEventActionAvailable: function() {
		const eventStatus = this.props.event.status;

		return (
			this.props.isUserSchoolWorker &&
			eventStatus === EventHelper.EVENT_STATUS.FINISHED &&
			(
				this.props.schoolType === EventFormConsts.EVENT_FORM_MODE.SCHOOL ||
				(
					this.props.schoolType === EventFormConsts.EVENT_FORM_MODE.SCHOOL_UNION &&
					(
						TeamHelper.isTeamSport(this.props.event) ||
						TeamHelper.isOneOnOneSport(this.props.event) ||
						TeamHelper.isTwoOnTwoSport(this.props.event)
					)
				)
			)
		);
	},
	isSendConsentRequestAvailable: function() {
		const event = this.props.event;
		const invite = this.getInviteForActiveSchool(event);
		const inviteStatus = propz.get(invite, ['status']);

		return (
			typeof this.props.event.clubId === 'undefined' &&
			this.props.isUserSchoolWorker &&
			this.props.schoolType === EventFormConsts.EVENT_FORM_MODE.SCHOOL &&
			this.props.event.status !== "REJECTED" &&
			this.props.event.status !== "CANCELED" &&
			inviteStatus !== "REJECTED"
		);
	},
	handleClickActionItem: function(id) {
		switch (id) {
			// create event like this
			case 'create':
				const mode = EventHelper.EVENT_CREATION_MODE.COPY;
				document.location.hash = `events/manager?mode=${mode}&eventId=${this.props.event.id}`;
				break;
			case 'change':
				this.props.handleClickCloseEvent();
				break;
			case 'close':
				this.props.handleClickCloseEvent();
				break;
			case 'cancel':
				this.props.handleClickCancelEventButtonOnActionList();
				break;
			case 'cancel_and_edit_notification_list':
				this.props.handleClickCancelEventAndEditNotificationListButtonOnActionList();
				break;
			case 'send_consent_request':
				this.props.onSendConsentRequest();
				break;
			case 'report_not_participate':
				this.props.onReportNotParticipate();
				break;
			case 'download_pdf':
				this.props.handleClickDownloadPdf();
				break;
			case 'download_csv':
				this.props.handleClickDownloadCSV();
				break;
			case 'delete_event':
				this.props.onClickDeleteEvent();
				break;
			case 'add_school':
				this.props.onClickAddSchool();
				break;
			case 'add_team':
				this.props.onClickAddTeam();
				break;
			case 'report_availability':
				this.props.onReportAvailabilityEvent();
				break;
		}
	},
	renderIsDisplayResultsOnPublicCheckbox: function () {
		let checkbox = null;

		if(EventHelper.isInterSchoolsEvent(this.props.event)) {
			const settings = this.props.event.settings;

			const currentSettings = settings.find(settings => settings.schoolId === this.props.activeSchoolId);
			let isDisplayResultsOnPublic = true;
			if(typeof currentSettings !== 'undefined') {
				isDisplayResultsOnPublic = currentSettings.isDisplayResultsOnPublic;
			}

			checkbox = (
				<div className="bSmallCheckboxBlock">
					<div className="eForm_fieldInput mInline">
						<input
							className   = "eSwitch"
							type		= "checkbox"
							checked		= { isDisplayResultsOnPublic }
							onChange	= { this.props.handleChangeIsDisplayResultsOnPublic }
						/>
						<label/>
					</div>
					<div className="eSmallCheckboxBlock_label">
						Display Results On Public Site
					</div>
				</div>
			);
		}

		return checkbox;
	},
	/**
	 * The function render's "Cancel" and "Save" buttons after clicking "Change score" button
	 * Buttons for close event or for change score.
	 * So, save results or cancel.
	 */
	renderChangeScoreEventButtonsContainer: function() {
		return (
			<div className='bEventButtonsWrapper'>
				<div className="bEventButtons">
					<div
						className = "bButton mCancel mMarginRight"
				        onClick = {this.props.onClickCloseCancel}
					>
						Cancel
					</div>
					<div
						className = "bButton"
				        onClick = {this.props.onClickOk}
					>
						Save
					</div>
				</div>
				<div className='eEventButtonsWrapper_underlineBlock'>
					{this.renderIsDisplayResultsOnPublicCheckbox()}
				</div>
			</div>
		);
	},
	render: function() {
		let buttons = null;

		switch (this.props.mode) {
			case 'general':
				buttons = this.renderScoreEventButtonsContainer();
				break;
			case 'closing':
				buttons = this.renderChangeScoreEventButtonsContainer();
				break;
		};

		return buttons;
	}
});

module.exports = Buttons;