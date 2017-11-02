// @flow

const	React			= require('react');

const	ActionList		= require('../../../../../ui/action_list/action_list');

const	EventHelper		= require('module/helpers/eventHelper'),
		TeamHelper 		= require('../../../../../ui/managers/helpers/team_helper'),
		LinkStyles 		= require('styles/pages/event/b_event_eLink_cancel_event.scss');

const EventFormConsts = require('module/as_manager/pages/events/manager/event_form/consts/consts');

/**
 * This component displays the buttons "Close event", "Change score", "Save", "Cancel".
 * */
const Buttons = React.createClass({
	propTypes: {
		event							: React.PropTypes.object.isRequired,
		mode							: React.PropTypes.string.isRequired,
		schoolType						: React.PropTypes.string.isRequired,
		// TRUE if active school id ==== inviter school id
		isInviterSchool					: React.PropTypes.bool.isRequired,
		isUserSchoolWorker				: React.PropTypes.bool.isRequired,
		isParent						: React.PropTypes.bool.isRequired,
		isStudent						: React.PropTypes.bool.isRequired,
		isShowScoreEventButtonsBlock	: React.PropTypes.bool.isRequired,
		handleClickCancelEvent			: React.PropTypes.func.isRequired,
		handleClickCloseEvent			: React.PropTypes.func.isRequired,
		handleClickDownloadPdf			: React.PropTypes.func.isRequired,
		onReportAvailabilityEvent		: React.PropTypes.func.isRequired,
		handleClickDownloadCSV			: React.PropTypes.func.isRequired,
		onClickCloseCancel				: React.PropTypes.func.isRequired,
		onClickOk						: React.PropTypes.func.isRequired,
		onSendConsentRequest			: React.PropTypes.func.isRequired,
		onReportNotParticipate			: React.PropTypes.func.isRequired,
		onClickDeleteEvent				: React.PropTypes.func.isRequired,
		onClickAddSchool				: React.PropTypes.func.isRequired,
		onClickAddTeam					: React.PropTypes.func.isRequired
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

		if(this.isReportAvailabilityAvailable()) {
			actionList.push({id:'report_availability', text:'Report Availability'});
		}

		if(
			this.props.isUserSchoolWorker &&
			this.props.schoolType === EventFormConsts.EVENT_FORM_MODE.SCHOOL
		) {
			actionList.push({id: 'download_pdf', text: 'Print'});
			actionList.push({id: 'download_csv', text: 'Download CSV'});
		}

		if(this.props.isUserSchoolWorker) {
			actionList.push({id: 'delete_event', text: 'Delete Event'});
		}

		return actionList;
	},
	isReportAvailabilityAvailable: function () {
		return (
			(this.props.isParent || this.props.isStudent) &&
			EventHelper.isNotFinishedEvent(this.props.event) &&
			this.isNotExpiredEventTime()
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
		const eventStatus = this.props.event.status;

		return (
			this.props.isUserSchoolWorker &&
			TeamHelper.isMultiparty(this.props.event) &&
			TeamHelper.isInterSchoolsEventForTeamSport(this.props.event) &&
			eventStatus !== EventHelper.EVENT_STATUS.FINISHED &&
			eventStatus !== EventHelper.EVENT_STATUS.REJECTED &&
			eventStatus !== EventHelper.EVENT_STATUS.CANCELED &&
			this.props.schoolType === EventFormConsts.EVENT_FORM_MODE.SCHOOL
		);
	},
	isCancelEventActionAvailable: function() {
		const eventStatus = this.props.event.status;

		return (
			this.props.isUserSchoolWorker &&
			eventStatus !== EventHelper.EVENT_STATUS.FINISHED &&
			eventStatus !== EventHelper.EVENT_STATUS.REJECTED &&
			eventStatus !== EventHelper.EVENT_STATUS.CANCELED
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
		return (
			this.props.isUserSchoolWorker &&
			this.props.schoolType === EventFormConsts.EVENT_FORM_MODE.SCHOOL
		);
	},
	isReportNotParticipateAvailable: function() {
		return (
			this.props.isParent &&
			EventHelper.isNotFinishedEvent(this.props.event) &&
			this.isNotExpiredEventTime() &&
			this.props.schoolType === EventFormConsts.EVENT_FORM_MODE.SCHOOL
		);
	},
	handleClickActionItem: function(id: string) {
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
				this.props.handleClickCancelEvent();
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
	/**
	 * The function render's "Cancel" and "Save" buttons after clicking "Change score" button
	 * Buttons for close event or for change score.
	 * So, save results or cancel.
	 */
	renderChangeScoreEventButtonsContainer: function() {
		return (
			<div className="bEventButtons">
				<div	className	= "bButton mCancel mMarginRight"
						onClick		= {this.props.onClickCloseCancel}
				>
					Cancel
				</div>
				<div	className	= "bButton"
						onClick		= {this.props.onClickOk}
				>
					Save
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