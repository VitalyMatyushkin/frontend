/**
 * Created by Woland on 10.01.2017.
 */
const 	React 				= require('react'),
		Immutable			= require('immutable'),
		Morearty 			= require('morearty'),

		ChallengeModel		= require('module/ui/challenges/challenge_model'),

		propz				= require('propz'),

		MoreartyHelper		= require('module/helpers/morearty_helper'),
		RoleHelper			= require('module/helpers/role_helper'),
		TeamHelper			= require('module/ui/managers/helpers/team_helper'),

		EventHeader 		= require('./event_header'),
		EventHeaderActions 	= require('./event_header_actions');

const	ManagerConsts	= require('module/ui/managers/helpers/manager_consts');

const EventHeaderWrapper = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		activeSchoolId:	React.PropTypes.string.isRequired,
		mode:			React.PropTypes.string.isRequired,
		onReload:		React.PropTypes.func.isRequired
	},
	isInviterSchool: function() {
		const event = this.getDefaultBinding().toJS('model');

		return event.inviterSchoolId === this.props.activeSchoolId;
	},
	getRivalsCount: function () {
		const data = this.getDefaultBinding().toJS();

		return propz.get(data, ['rivals', 'length']);
	},
	handleClickDownloadPdf: function() {
		const 	binding		= this.getDefaultBinding(),
				schoolId 	= this.props.activeSchoolId,
				event		= binding.toJS('model'),
				eventId 	= binding.toJS('model.id');

		EventHeaderActions.downloadPdf(schoolId, eventId, event);
	},
	handleClickDownloadCSV: function() {
		const 	binding		= this.getDefaultBinding(),
				schoolId	= this.props.activeSchoolId,
				event		= binding.toJS('model');

		EventHeaderActions.downloadCSV(schoolId, event);
	},

	/**
	 * The event handler when clicking the button "Change score" or "Close event"
	 */
	handleClickCloseEvent: function () {
		const binding = this.getDefaultBinding();

		this.backupResults();
		EventHeaderActions.setModeClosing(binding);
	},
	backupResults: function() {
		const binding = this.getDefaultBinding();

		// backup results
		// we need default state of results for revert event result changes
		// when user click to cancel button(in close event mode)
		const event = binding.toJS('model');
		event.initResults = event.results;
		binding.set('model', Immutable.fromJS(event));
	},
	/**
	 * The event handler when clicking the button "Cancel" after clicking the button "Change score"
	 */
	onClickCloseCancel: function () {
		const	binding	= this.getDefaultBinding();

		EventHeaderActions.setModeGeneral(binding);
		EventHeaderActions.revertScore(binding);
	},

	/**
	 * The event handler when clicking the button "Save" after clicking the button "Change score"
	 */
	onClickOk: function () {
		const	binding 		= this.getDefaultBinding(),
				event			= binding.toJS('model'),
				activeSchoolId	= this.props.activeSchoolId;

		if(this.isValidScore(event)) {
			let promise;
			if(this.getDefaultBinding().get('model.status') === "FINISHED") {
				promise = EventHeaderActions.submitScore(activeSchoolId, event, binding);
			} else {
				promise = EventHeaderActions.closeMatch(activeSchoolId, event, binding);
			}

			Promise.resolve(promise).then(() => {
				this.props.onReload();
			});
		}
	},
	isValidScore: function (event) {
		let result = true;

		event.results.schoolScore.forEach(score => {
			if(typeof score.isValid !== 'undefined' && !score.isValid) {
				result = false;
			}
		});

		event.results.houseScore.forEach(score => {
			if(typeof score.isValid !== 'undefined' && !score.isValid) {
				result = false;
			}
		});

		event.results.teamScore.forEach(score => {
			if(typeof score.isValid !== 'undefined' && !score.isValid) {
				result = false;
			}
		});

		event.results.individualScore.forEach(score => {
			if(typeof score.isValid !== 'undefined' && !score.isValid) {
				result = false;
			}
		});

		return result;
	},
	onClickEditEventButton: function() {
		const binding = this.getDefaultBinding();

		binding.set('isEditEventPopupOpen', true);
	},
	/**
	 * The event handler when clicking the button "Report Availability"
	 */
	onReportAvailabilityEvent: function () {
		const binding = this.getDefaultBinding();

		binding.set('isOpenEditReportAvailabilityPopup', true);
	},
	onSendConsentRequest: function() {
		const	binding			= this.getDefaultBinding(),
				event			= binding.toJS('model'),
				activeSchoolId	= this.props.activeSchoolId;

		EventHeaderActions.sendConsentRequest(activeSchoolId, event.id).then(messages => {
			binding.set('parentalConsentTab.messages', Immutable.fromJS(messages));

			this.props.onReload();
			window.simpleAlert(
				"Consent requests have been successfully sent",
				'Ok',
				() => {}
			);
		});
	},
	onReportNotParticipate: function() {
		const	binding		= this.getDefaultBinding(),
				event		= binding.toJS('model');

		EventHeaderActions.reportNotParticipate(event).then(messages => {
			binding.set('parentalReportTab.messages', Immutable.fromJS(messages));

			window.simpleAlert(
				"Your message has been successfully sent",
				'Ok',
				() => {}
			);
		});
	},
	onClickAddSchool: function() {
		const binding = this.getDefaultBinding();

		binding.set('opponentSchoolManager.isOpen', true);
		binding.set('opponentSchoolManager.opponentSchoolId', undefined)
		binding.set('opponentSchoolManager.mode', 'ADD')
	},
	onClickAddTeam: function() {
		const binding = this.getDefaultBinding();

		binding.set('selectedRivalIndex', Immutable.fromJS(0));
		binding.set('mode', 'edit_squad');
		binding.set('teamManagerMode', ManagerConsts.MODE.ADD_TEAM)
	},
	onClickDeleteEvent: function(){
		const binding = this.getDefaultBinding();

		binding.set('isDeleteEventPopupOpen', true);
	},
	handleClickOkButtonOnCancelEventPopup: function () {
		const binding = this.getDefaultBinding();
		const schoolId = this.props.activeSchoolId;
		const eventId = binding.toJS('model.id');
		const isManualMode = binding.toJS('isManualMode');

		EventHeaderActions.cancelEvent(schoolId, eventId, isManualMode ? 'MANUAL' : 'AUTO', binding);
	},
	handleClickOpenCancelEventPopup: function () {
		this.getDefaultBinding().set('isOpenCancelEventPopupPopup', true);
	},
	handleClickUserActivityCheckbox: function (userId, permissionId) {
		let affectedUserList = this.getDefaultBinding().toJS('actionDescriptor.affectedUserList');

		const userIndex = affectedUserList.findIndex(user => user.userId === userId && user.permissionId === permissionId);
		affectedUserList[userIndex].checked = !affectedUserList[userIndex].checked;

		this.getDefaultBinding().set('actionDescriptor.affectedUserList', Immutable.fromJS(affectedUserList))
	},
	handleClickCommitButtonOnCancelEventPopup: function () {
		const actionDescriptor = this.getDefaultBinding().toJS('actionDescriptor');

		EventHeaderActions.commitUsersToActionDescriptorChanges(actionDescriptor.id, actionDescriptor.affectedUserList);
	},
	handleClickCancelButtonOnCancelEventPopup: function () {
		this.getDefaultBinding().set('isOpenCancelEventPopupPopup', false);
	},
	handleClickCheckboxMode: function () {
		this.getDefaultBinding().set( 'isManualMode', !this.getDefaultBinding().toJS('isManualMode') );
	},
	isTweetButtonRender: function(role, twitterData, mode){
		return role === RoleHelper.USER_ROLES.ADMIN && twitterData.length > 0 && mode !== 'closing';
	},
	onClickViewMode: function(mode){
		const binding = this.getDefaultBinding();

		binding.set('viewMode', mode);
	},
	/**
	 * The function render's component EventHeaderWrapper
	 * @returns {XML}
	 */
	render: function() {
		const	binding 						= this.getDefaultBinding(),
				event							= binding.toJS('model'),
				challengeModel					= new ChallengeModel(event, this.props.activeSchoolId),
				mode 							= binding.toJS('mode'),
				viewMode 						= binding.toJS('viewMode'),
				eventAges						= binding.toJS('model.ages'),
				isUserSchoolWorker				= RoleHelper.isUserSchoolWorker(this),
				isParent						= RoleHelper.isParent(this),
				isStudent						= RoleHelper.isStudent(this),
				isShowScoreEventButtonsBlock	= TeamHelper.isShowScoreEventButtonsBlock(this);
		//const for tweet button
		const 	twitterData 				= typeof binding.toJS('twitterData') !== 'undefined' ? binding.toJS('twitterData') : [],
				twitterIdDefault 			= typeof binding.toJS('twitterIdDefault') !== 'undefined' ? binding.toJS('twitterIdDefault') : '',
				role 						= RoleHelper.getLoggedInUserRole(this),
				isPublicAvailableDomain 	= binding.toJS('activeSchoolInfo.publicSite.status') === 'PUBLIC_AVAILABLE',
				schoolDomain 				= isPublicAvailableDomain && typeof binding.toJS('activeSchoolInfo.domain') !== 'undefined' ? binding.toJS('activeSchoolInfo.domain') : '';

		return (
			<EventHeader
				binding										= { binding }
				countRivals									= { this.getRivalsCount() }
				event										= { event }
				challengeModel								= { challengeModel }
				isInviterSchool								= { this.isInviterSchool() }
				schoolType									= { this.props.mode }
				mode 										= { mode }
				viewMode									= { viewMode }
				eventAges									= { eventAges }
				isUserSchoolWorker 							= { isUserSchoolWorker }
				isParent									= { isParent }
				isStudent									= { isStudent }
				isShowScoreEventButtonsBlock 				= { isShowScoreEventButtonsBlock }
				handleClickOkButtonOnCancelEventPopup		= { this.handleClickOkButtonOnCancelEventPopup }
				handleClickCancelButtonOnCancelEventPopup	= { this.handleClickCancelButtonOnCancelEventPopup }
				handleClickOpenCancelEventPopup				= { this.handleClickOpenCancelEventPopup }
				handleClickCommitButtonOnCancelEventPopup	= { this.handleClickCommitButtonOnCancelEventPopup }
				handleClickUserActivityCheckbox				= { this.handleClickUserActivityCheckbox }
				handleClickCheckboxMode						= { this.handleClickCheckboxMode }
				handleClickCloseEvent						= { this.handleClickCloseEvent }
				handleClickDownloadPdf						= { this.handleClickDownloadPdf }
				handleClickDownloadCSV						= { this.handleClickDownloadCSV }
				onReportAvailabilityEvent					= { this.onReportAvailabilityEvent }
				onClickCloseCancel							= { this.onClickCloseCancel }
				onClickOk									= { this.onClickOk }
				onClickEditEventButton						= { this.onClickEditEventButton }
				onSendConsentRequest						= { this.onSendConsentRequest }
				onReportNotParticipate						= { this.onReportNotParticipate }
				onClickAddSchool							= { this.onClickAddSchool }
				onClickAddTeam								= { this.onClickAddTeam }
				role 										= { role }
				onClickDeleteEvent 							= { this.onClickDeleteEvent }
				//props for tweet button
				twitterData 								= { twitterData }
				isTweetButtonRender 						= { this.isTweetButtonRender(role, twitterData, mode) }
				schoolDomain 								= { schoolDomain }
				activeSchoolId 								= { this.props.activeSchoolId }
				twitterIdDefault 							= { twitterIdDefault }
				//props for view mode
				onClickViewMode 							= { this.onClickViewMode }
			/>
		);
	}
});

module.exports = EventHeaderWrapper;