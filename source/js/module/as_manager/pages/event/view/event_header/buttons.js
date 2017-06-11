// @flow

const	React			= require('react');

const	ActionList		= require('../../../../../ui/action_list/action_list');

const	EventHelper		= require('module/helpers/eventHelper'),
		TeamHelper 		= require('../../../../../ui/managers/helpers/team_helper'),
		LinkStyles 		= require('styles/pages/event/b_event_eLink_cancel_event.scss');

/**
 * This component displays the buttons "Close event", "Change score", "Save", "Cancel".
 * */
const Buttons = React.createClass({
	propTypes: {
		eventId							: React.PropTypes.string.isRequired,
		mode							: React.PropTypes.string.isRequired,
		eventStatus						: React.PropTypes.string.isRequired,
		isUserSchoolWorker				: React.PropTypes.bool.isRequired,
		isParent						: React.PropTypes.bool.isRequired,
		isShowScoreEventButtonsBlock	: React.PropTypes.bool.isRequired,
		handleClickCancelEvent			: React.PropTypes.func.isRequired,
		handleClickCloseEvent			: React.PropTypes.func.isRequired,
		handleClickDownloadPdf			: React.PropTypes.func.isRequired,
		onClickCloseCancel				: React.PropTypes.func.isRequired,
		onClickOk						: React.PropTypes.func.isRequired,
		onSendConsentRequest			: React.PropTypes.func.isRequired,
		onReportNotParticipate			: React.PropTypes.func.isRequired,
		onClickDeleteEvent				: React.PropTypes.func.isRequired
	},
	/**
	 * The function render's container with buttons "Close event"/"Change score" and button "Cancel" for event
	 */
	renderScoreEventButtonsContainer: function() {
		return (
			<ActionList	buttonText				= 'Actions'
						actionList				= {this.getActionList()}
						handleClickActionItem	= {this.handleClickActionItem}
			/>
		);
	},
	getActionList: function() {
		const actionList = [];

		if(this.props.isUserSchoolWorker) {
			actionList.push({id:'create', text:'Create Event Like This'});
		}

		if(this.isCloseEventActionAvailable()) {
			actionList.push({id:'close', text:'Close Event'});
		}

		if(this.isSendConsentRequestAvailable()) {
			actionList.push({id:'send_consent_request', text:'Send Consent Request'});
		}

		if(this.isReportNotParticipateAvailable()) {
			actionList.push({id:'report_not_participate', text:'Report unavailability'});
		}

		if(this.isChangeScoreEventActionAvailable()) {
			actionList.push({id:'change', text:'Update Scores'});
		}

		if(this.isCancelEventActionAvailable()) {
			actionList.push({id:'cancel', text:'Cancel Event'});
		}

		if(this.props.isUserSchoolWorker) {
			actionList.push({id: 'download_pdf', text: 'Download Pdf'});
			actionList.push({id: 'delete_event', text: 'Delete Event'});
		}

		return actionList;
	},
	isCancelEventActionAvailable: function() {
		const eventStatus = this.props.eventStatus;

		return (
			this.props.isUserSchoolWorker &&
			eventStatus !== EventHelper.EVENT_STATUS.FINISHED &&
			eventStatus !== EventHelper.EVENT_STATUS.REJECTED &&
			eventStatus !== EventHelper.EVENT_STATUS.CANCELED
		);
	},
	isCloseEventActionAvailable: function() {
		const eventStatus = this.props.eventStatus;

		return (
			this.props.isUserSchoolWorker &&
			this.props.isShowScoreEventButtonsBlock &&
			eventStatus === EventHelper.EVENT_STATUS.ACCEPTED
		);
	},
	isChangeScoreEventActionAvailable: function() {
		const eventStatus = this.props.eventStatus;

		return (
			this.props.isUserSchoolWorker &&
			this.props.isShowScoreEventButtonsBlock &&
			eventStatus === EventHelper.EVENT_STATUS.FINISHED
		);
	},
	isSendConsentRequestAvailable: function() {
		// TODO
		return this.props.isUserSchoolWorker;
	},
	isReportNotParticipateAvailable: function() {
		// TODO
		return this.props.isParent;
	},
	handleClickActionItem: function(id: string) {
		switch (id) {
			// create event like this
			case 'create':
				const mode = EventHelper.EVENT_CREATION_MODE.COPY;
				document.location.hash = `events/manager?mode=${mode}&eventId=${this.props.eventId}`;
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
			case 'delete_event':
				this.props.onClickDeleteEvent();
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