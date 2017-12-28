// Main
import {CancelEventManualNotification} from "./cancel_event_manual_notification/cancel_event_manual_notification";

const	React				= require('react'),
		Morearty			= require('morearty'),
		propz				= require('propz');

// React components
const	PencilButton		= require('module/ui/pencil_button'),
		TweetButton 		= require('module/as_manager/pages/event/view/event_header/tweet_button'),
		{ ConfirmPopup }	= require('module/ui/confirm_popup'),
		{ CancelEvent }		= require('module/as_manager/pages/event/view/event_header/cancel_event'),
		ReportAvailability	= require('module/as_manager/pages/event/view/event_header/report_availability'),
		ViewSelector		= require('module/ui/view_selector/view_selector'),
		{ If }				= require('module/ui/if/if'),
		Buttons				= require('module/as_manager/pages/event/view/event_header/buttons');

// Helpers
const	{ DateHelper }		= require('module/helpers/date_helper'),
		DomainHelper		= require('module/helpers/domain_helper'),
		RoleHelper			= require('module/helpers/role_helper'),
		TeamHelper			= require('module/ui/managers/helpers/team_helper'),
		SchoolHelper		= require('module/helpers/school_helper'),
		ViewSelectorHelper	= require('module/ui/view_selector/helpers/view_selector_helper');

// Consts
const	EventConsts			= require('module/helpers/consts/events'),
		SchoolConst			= require('module/helpers/consts/schools'),
		ViewModeConsts		= require('module/ui/view_selector/consts/view_mode_consts');

// Styles
const	EventHeaderStyle	= require('styles/pages/event/b_event_header.scss');

const EventHeader = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		event:										React.PropTypes.object.isRequired,
		countRivals:								React.PropTypes.number,
		challengeModel:								React.PropTypes.object.isRequired,
		mode:										React.PropTypes.string.isRequired,
		schoolType:									React.PropTypes.string.isRequired,
		viewMode:									React.PropTypes.string,
		eventAges:									React.PropTypes.array,
		isInviterSchool:							React.PropTypes.bool.isRequired,
		isUserSchoolWorker:							React.PropTypes.bool.isRequired,
		isParent:									React.PropTypes.bool.isRequired,
		isStudent:									React.PropTypes.bool.isRequired,
		isShowScoreEventButtonsBlock:				React.PropTypes.bool.isRequired,
		handleClickOpenCancelEventPopup:			React.PropTypes.func.isRequired,
		handleClickOkButtonOnCancelEventPopup:		React.PropTypes.func.isRequired,
		handleClickCancelButtonOnCancelEventPopup:	React.PropTypes.func.isRequired,
		handleClickCommitButtonOnCancelEventPopup:	React.PropTypes.func.isRequired,
		handleClickCheckboxMode:					React.PropTypes.func.isRequired,
		handleClickUserActivityCheckbox:			React.PropTypes.func.isRequired,
		onClickAddTeam:								React.PropTypes.func.isRequired,
		handleClickDownloadPdf:						React.PropTypes.func.isRequired,
		onReportAvailabilityEvent:					React.PropTypes.func.isRequired,
		handleClickDownloadCSV:						React.PropTypes.func.isRequired,
		onClickCloseCancel:							React.PropTypes.func.isRequired,
		onClickOk:									React.PropTypes.func.isRequired,
		onClickEditEventButton:						React.PropTypes.func.isRequired,
		onSendConsentRequest:						React.PropTypes.func.isRequired,
		onReportNotParticipate:						React.PropTypes.func.isRequired,
		role: 										React.PropTypes.string.isRequired,
		onClickDeleteEvent:							React.PropTypes.func.isRequired,
		onClickAddSchool:							React.PropTypes.func.isRequired,

		//prop for tweet button
		isTweetButtonRender: 						React.PropTypes.bool.isRequired,
		twitterData: 								React.PropTypes.array.isRequired,
		schoolDomain: 								React.PropTypes.string.isRequired,
		activeSchoolId: 							React.PropTypes.string.isRequired,
		twitterIdDefault: 							React.PropTypes.string.isRequired,
		
		//prop for view mode
		onClickViewMode: 							React.PropTypes.func
	},
	componentWillMount: function () {
		this.getDefaultBinding().set('isOpenEditReportAvailabilityPopup', false);
		this.getDefaultBinding().set('isOpenCancelEventPopupPopup', false);
		this.getDefaultBinding().set('isOpenCancelEventManualNotificationPopup', false);

		this.getDefaultBinding().set( 'isManualMode', false);
	},
	/**
	 * Function return string with all Age Groups
	 * @example <caption>Example usage of getEventAges</caption>
	 * //Reception, 5, 6, 7
	 * getEventAges();
	 * @returns {string}
	 */
	getEventAges: function(){
		const	schoolInfo 		= SchoolHelper.getActiveSchoolInfo(this),
				ageGroupsNaming = propz.get(schoolInfo, ['ageGroupsNaming']),
				data = this.props.eventAges;

		return data.length > 0 ? data
			.sort()
			.map(elem => propz.get(SchoolConst.AGE_GROUPS, [ageGroupsNaming, elem]))
			.join(", ")
			: "All ages";
	},
	getEventLocation: function(){
		const venue = this.props.event.venue;
		const venueType = EventConsts.VENUE_SERVER_CLIENT_MAP[venue.venueType];

		let eventLocation = venueType;
		const postcode = propz.get(venue, ['postcodeData', 'postcode']);
		if(typeof postcode !== 'undefined') {
			eventLocation += `, ${postcode}`;
		}

		return eventLocation;
	},
	//We don't show the pencil (edit) button for parent, student and if event is finished
	isShowPencilButton: function(){
		const role = this.props.role;

		return role !== RoleHelper.USER_ROLES.PARENT && role !== RoleHelper.USER_ROLES.STUDENT && this.props.event.status !== "FINISHED";
	},
	closeReportAvailabilityPopup: function () {
		const 	binding		= this.getDefaultBinding();

		binding.set('isOpenEditReportAvailabilityPopup', false);
	},
	renderViewModeLinks: function() {
		if(
			TeamHelper.isNewEvent(this.props.event) &&
			TeamHelper.isMultiparty(this.props.event) &&
			(
				this.props.viewMode === (ViewModeConsts.VIEW_MODE.BLOCK_VIEW || ViewModeConsts.VIEW_MODE.TABLE_VIEW) ?
					typeof this.props.countRivals !== 'undefined' && this.props.countRivals > 2 :
					true
			)
		) {
			return (
				<ViewSelector
					selectorList	= { ViewSelectorHelper.getSelectorList(this.props.event) }
					handleClick		= { this.props.onClickViewMode }
					viewMode		= { this.props.viewMode }
				/>
			);
		} else {
			return null;
		}
	},
	renderFinishTime: function () {
		const finishTime = this.props.challengeModel.endTime;

		if(typeof finishTime !== 'undefined') {
			return (
				<div className="eEventHeader_field mDate">{`Finish time: ${finishTime}`}</div>
			);
		} else {
			return null;
		}
	},
	renderReportAvailabilityPopup: function () {
		let reactElement = null;

		const binding = this.getDefaultBinding();

		if(binding.toJS('isOpenEditReportAvailabilityPopup')) {
			reactElement = (
				<ConfirmPopup
					isShowButtons			= { false }
					handleClickCancelButton	= { () => this.closeReportAvailabilityPopup() }
					customStyle				= { 'mSmallWidth' }
				>
					<ReportAvailability
						binding		= { binding }
						isParent	= { this.props.isParent }
						eventId		= { this.props.challengeModel.id }
						onCancel	= { this.closeReportAvailabilityPopup }
					/>
				</ConfirmPopup>
			);
		}

		return reactElement;
	},
	renderCancelEventPopup: function () {
		let reactElement = null;

		const binding = this.getDefaultBinding();

		if(binding.toJS('isOpenCancelEventPopupPopup')) {
			reactElement = (
				<ConfirmPopup
					handleClickOkButton		= { () => this.props.handleClickOkButtonOnCancelEventPopup() }
					handleClickCancelButton	= { () => this.props.handleClickCancelButtonOnCancelEventPopup() }
					customStyle				= { 'mSmallWidth' }
				>
					<CancelEvent handleClickCheckboxMode = { () => this.props.handleClickCheckboxMode() } />
				</ConfirmPopup>
			);
		}

		return reactElement;
	},
	renderCancelEventManualNotificationPopup: function () {
		let reactElement = null;

		const binding = this.getDefaultBinding();

		if(binding.toJS('isOpenCancelEventManualNotificationPopup')) {

			console.log( binding.toJS('actionDescriptor.affectedUserList') );

			reactElement = (
				<ConfirmPopup
					okButtomText		= { 'Commit' }
					isShowCancelButton	= { false }
					handleClickOkButton	= { () => this.props.handleClickCommitButtonOnCancelEventPopup() }
					customStyle			= { 'mSmallWidth' }
				>
					<CancelEventManualNotification
						users = { binding.toJS('actionDescriptor.affectedUserList') }
						handleClickUserActivityCheckbox = { (userId, permissionId) => this.props.handleClickUserActivityCheckbox(userId, permissionId) }
					/>
				</ConfirmPopup>
			);
		}

		return reactElement;
	},
	render: function() {
		const	challengeModel		= this.props.challengeModel,
				eventAges			= this.getEventAges(),
				eventLocation		= this.getEventLocation(),
				name				= challengeModel.name,
				date				= DateHelper.toLocalWithMonthName(challengeModel.dateUTC),
				time				= challengeModel.time,
				sport				= challengeModel.sport,
				protocol			= document.location.protocol + '//',
				eventId				= challengeModel.id,
				schoolDomain 		= DomainHelper.getSubDomain(this.props.schoolDomain),
				linkForTweet 		= this.props.schoolDomain !== '' ? protocol + schoolDomain + '/#event/' + eventId : '',
				score				= challengeModel.isFinished && typeof challengeModel.score !== 'undefined' && challengeModel.score !== '' ? `Score: ${challengeModel.score}` : '',
				textForTweet		= `${name} ${time} / ${date} Years: ${eventAges} ${score}`;

		return (
			<div className="bEventHeader">
				<div className="eEventHeader_row">
					<div className="eEventHeader_leftSide">
						<div className="eEventHeader_field mEvent">
							<div className="eEventHeader_fieldColumn">
								{`${name}`}
							</div>
							<If condition={this.isShowPencilButton()}>
								<div className="eEventHeader_fieldColumn mRelative">
									<div className="eEventHeader_editLinkWrapper">
										<PencilButton extraClassName="mLess" handleClick={this.props.onClickEditEventButton}/>
									</div>
								</div>
							</If>
						</div>
						<div className="eEventHeader_field mDate">{`${date} / ${sport}`}</div>
						<div className="eEventHeader_field mDate">{`Start time: ${time}`}</div>
						{ this.renderFinishTime() }
						<div className="eEventHeader_field mAges">{`Years: ${eventAges}`}</div>
						<div className="eEventHeader_field mLocation">{`Venue: ${eventLocation}`}</div>
						<TweetButton
							isTweetButtonRender 	= { this.props.isTweetButtonRender }
							twitterData 			= { this.props.twitterData }
							textForTweet 			= { textForTweet }
							linkForTweet 			= { linkForTweet }
							activeSchoolId 			= { this.props.activeSchoolId }
							twitterIdDefault 		= { this.props.twitterIdDefault }
						/>
						{ this.renderViewModeLinks() }
					</div>
					<div className="eEventHeader_rightSide">
						<Buttons
							event							= { this.props.event }
							mode							= { this.props.mode }
							schoolType						= { this.props.schoolType }
							isInviterSchool 				= { this.props.isInviterSchool }
							isUserSchoolWorker 				= { this.props.isUserSchoolWorker }
							isParent		 				= { this.props.isParent }
							isStudent		 				= { this.props.isStudent }
							isShowScoreEventButtonsBlock 	= { this.props.isShowScoreEventButtonsBlock }
							handleClickCancelEvent			= { this.props.handleClickOpenCancelEventPopup }
							handleClickCloseEvent			= { this.props.handleClickCloseEvent }
							handleClickDownloadPdf			= { this.props.handleClickDownloadPdf }
							handleClickDownloadCSV			= { this.props.handleClickDownloadCSV }
							onClickCloseCancel				= { this.props.onClickCloseCancel }
							onClickOk						= { this.props.onClickOk }
							onSendConsentRequest			= { this.props.onSendConsentRequest }
							onReportNotParticipate			= { this.props.onReportNotParticipate }
							onReportAvailabilityEvent		= { this.props.onReportAvailabilityEvent }
							onClickDeleteEvent 				= { this.props.onClickDeleteEvent }
							onClickAddSchool 				= { this.props.onClickAddSchool }
							onClickAddTeam 					= { this.props.onClickAddTeam }
						/>
					</div>
				</div>
				{ this.renderReportAvailabilityPopup() }
				{ this.renderCancelEventPopup() }
				{ this.renderCancelEventManualNotificationPopup() }
			</div>
		);
	}
});


module.exports = EventHeader;
