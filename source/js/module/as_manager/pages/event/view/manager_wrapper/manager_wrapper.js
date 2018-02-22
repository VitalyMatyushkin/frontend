import {SplitButtonWrapper} from "./components/split_button_wrapper";

const	React 					= require('react'),
		Morearty				= require('morearty'),
		Immutable				= require('immutable'),
		debounce				= require('debounce');

const	Manager					            = require('./../../../../../ui/managers/manager'),
		EventHelper				            = require('./../../../../../helpers/eventHelper'),
		ManagerGroupChanges                 = require('module/ui/manager_group_changes/managerGroupChanges'),
		ManagerWrapperHelper	            = require('./manager_wrapper_helper'),
		NewManagerWrapperHelper	            = require('./new_manager_wrapper_helper'),
		{Button}				            = require('../../../../../ui/button/button'),
		classNames				            = require('classnames'),
		TeamHelper				            = require('./../../../../../ui/managers/helpers/team_helper'),
		{ ConfirmPopup }                    = require('module/ui/confirm_popup'),
		{ CancelEventManualNotification }   = require("module/as_manager/pages/event/view/event_header/cancel_event_manual_notification/cancel_event_manual_notification"),
		{ SplitButton }                     = require("module/ui/split_button/split_button");

const	Actions								= require('../../actions/actions'),
		EventHeaderActions                  = require('module/as_manager/pages/event/view/event_header/event_header_actions'),
		{SavingPlayerChangesPopup}			= require('../../../events/saving_player_changes_popup/saving_player_changes_popup'),
		EventConsts							= require('module/helpers/consts/events'),
		SavingEventHelper					= require('../../../../../helpers/saving_event_helper'),
		{ ManagerTypes }					= require('module/ui/managers/helpers/manager_types'),
		{ PlayerChoosersTabsModelFactory }	= require('module/helpers/player_choosers_tabs_models_factory'),
		{ TeamManagerActions }				= require('module/helpers/actions/team_manager_actions');

const	TeamManagerWrapperStyle			= require('../../../../../../../styles/ui/b_team_manager_wrapper.scss');

const ManagerWrapper = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		activeSchoolId: React.PropTypes.string.isRequired
	},
	playerChoosersTabsModel: undefined,
	// debounce decorator for changeControlButtonState func
	onDebounceChangeControlButtonState: undefined,
	teamManagerActions: undefined,
	/**
	 * Function check manager data and set corresponding value to isControlButtonActive
	 */
	changeControlButtonState: function() {
		const	self	= this,
				binding	= self.getDefaultBinding();

		binding.set('isControlButtonActive', this.isControlButtonActive());
	},
	componentWillMount: function() {
		const	binding	= this.getDefaultBinding(),
				event	= binding.toJS('model');

		this.initPlayerChoosersTabsModel();
		this.initTeamManagerActions();

		const	managerWrapperRivals	= this.getRivals(event, binding.toJS('rivals')),
				selectedRivalIndex		= this.initSelectedRivalIndex(managerWrapperRivals),
				schoolInfo				= this.getSchoolInfo(event, managerWrapperRivals, selectedRivalIndex);

		binding.sub('teamManagerWrapper.default')
			.atomically()
			.set('isSubmitProcessing',				false)
			.set('isSavingChangesModePopupOpen',	false)
			.set('model',							Immutable.fromJS(event))
			.set('model.sportModel',				Immutable.fromJS(event.sport))
			.set('rivals',							Immutable.fromJS(managerWrapperRivals))
			.set('schoolInfo',						Immutable.fromJS(schoolInfo))
			.set('error',							Immutable.fromJS([
														{
															isError: false,
															text: ""
														},
														{
															isError: false,
															text: ""
														}
													]))
			.commit();

		binding
			.atomically()
			.set('selectedRivalIndex', Immutable.fromJS(selectedRivalIndex))
			.set('isTeamManagerSync', false)
			.set('isControlButtonActive', false)
			.set('isShowChangeModeManagerPopup', false)
			.set('isChangeTeamManualNotificationPopupOpen', false)
			.set('actionDescriptorId', undefined)
			.set('isManualNotificationMode', false)
			.commit();

		this.addListeners();

		// create debounce decorator for changeControlButtonState func
		this.onDebounceChangeControlButtonState = debounce(this.changeControlButtonState, 200, true);
	},
	initPlayerChoosersTabsModel: function () {
		this.playerChoosersTabsModel = PlayerChoosersTabsModelFactory.createTabsModelByManagerType(
			ManagerTypes.Default
		);
	},
	initTeamManagerActions: function () {
		this.teamManagerActions = new TeamManagerActions( {schoolId: this.props.activeSchoolId} );
	},
	addListeners: function() {
		this.addListenerForTeamManager();
		this.addListenersForControlButtonState();
	},
	addListenersForControlButtonState: function() {
		const binding = this.getDefaultBinding();

		binding
			.sub(`isTeamManagerSync`)
			.addListener(eventDescriptor => {
				// Lock submit button if team manager in searching state.
				eventDescriptor.getCurrentValue() && binding.set('isTeamManagerSync', true);

				// Unlock submit button if team manager in searching state.
				!eventDescriptor.getCurrentValue() && binding.set('isTeamManagerSync', false);
			});
	},
	addListenerForTeamManager: function() {
		const binding = this.getDefaultBinding();

		binding
			.sub(`teamManagerWrapper.default.isSync`)
			.addListener(eventDescriptor => {
				// Lock submit button if team manager in searching state.
				eventDescriptor.getCurrentValue() && binding.set('isTeamManagerSync', true);

				// Unlock submit button if team manager in searching state.
				!eventDescriptor.getCurrentValue() && binding.set('isTeamManagerSync', false);
			});
	},
	checkControlButtonState: function() {
		const binding = this.getDefaultBinding();

		if(binding.toJS('isControlButtonActive') !== this.isControlButtonActive()) {
			typeof this.onDebounceChangeControlButtonState !== 'undefined' && this.onDebounceChangeControlButtonState();
		}
	},
	isControlButtonActive: function() {
		const	binding			= this.getDefaultBinding();

		const validationData = this.getValidationData();

		if(
			binding.get('isTeamManagerSync') &&
			!binding.get('isSubmitProcessing') &&
			!binding.toJS('teamManagerWrapper.default.isSubmitProcessing') &&
			TeamHelper.isTeamDataCorrect(validationData)
		) {
			return true;
		} else {
			return false;
		}
	},
	/**
	 * Function returns initialized selectedRivalIndex
	 * by some rules.
	 * @param managerWrapperRivals
	 * @returns {*}
	 */
	initSelectedRivalIndex: function(managerWrapperRivals) {
		const binding = this.getDefaultBinding();

		let selectedRivalIndex = binding.toJS('selectedRivalIndex');
		switch (true) {
			case binding.toJS('teamManagerMode') === 'ADD_TEAM': {
				selectedRivalIndex = managerWrapperRivals.findIndex(r => r.emptyRival);
				break;
			}
			case typeof selectedRivalIndex === 'undefined': {
				selectedRivalIndex = 0;
				break;
			}
		}

		return selectedRivalIndex;
	},
	/**
	 * Function converts event rivals to manager rivals by some rules depend
	 * on event type and event manager mode
	 * @param event
	 * @param rivals
	 * @returns {Array}
	 */
	getRivals: function(event, rivals) {
		const binding = this.getDefaultBinding();

		let _rivals = [];

		if(TeamHelper.mustUseNewManagerWraperHelper(event)) {
			_rivals = NewManagerWrapperHelper.getRivals(event, rivals);
		} else {
			_rivals = ManagerWrapperHelper.getRivals(this.props.activeSchoolId, event, false);
		}

		if(
			TeamHelper.mustUseNewManagerWraperHelper(event) &&
			binding.toJS('teamManagerMode') === 'ADD_TEAM'
		) {
			const anyCurrentSchoolRival = rivals.find(rival => rival.school.id === this.props.activeSchoolId);
			const emptyRival = NewManagerWrapperHelper.getEmptyRivalForInterSchoolEvent( anyCurrentSchoolRival );
			emptyRival.emptyRival = true;
			_rivals.push( emptyRival );
		}

		return _rivals;
	},
	getSchoolInfo: function(event, rivals, selectedRivalIndex) {
		switch (true) {
			case TeamHelper.isNewEvent(event) && EventHelper.isInterSchoolsEvent(event): {
				const school = rivals[selectedRivalIndex].school;

				if(school.id === event.inviterSchoolId) {
					return event.inviterSchool;
				} else {
					return event.invitedSchools.find(s => s.id === school.id);
				}
			}
			case !TeamHelper.isNewEvent(event) && EventHelper.isInterSchoolsEvent(event): {
				return event.inviterSchoolId === this.props.activeSchoolId ? event.inviterSchool : event.invitedSchools[0];
			}
			case EventHelper.isHousesEvent(event) || EventHelper.isInternalEvent(event): {
				return event.inviterSchool;
			}
		}
	},
	getManagerBinding: function() {
		const	self						= this,
				binding						= self.getDefaultBinding(),
				teamManagerWrapperBinding	= binding.sub('teamManagerWrapper');

		return {
			default:	teamManagerWrapperBinding.sub('default'),
			rivals:		teamManagerWrapperBinding.sub('default.rivals'),
			error:		teamManagerWrapperBinding.sub('default.error')
		};
	},
	/**
	 * Just wrapper.
	 * @returns {*}
	 */
	processSavingChangesMode: function() {
		const binding = this.getDefaultBinding();

		return SavingEventHelper.processSavingChangesMode(
			this.props.activeSchoolId,
			binding.toJS(`teamManagerWrapper.default.rivals`),
			binding.toJS('teamManagerWrapper.default.model'),
			this.getTeamWrappers()
		)
	},
	handleClickPopupSubmit: function() {
		this.submit();
	},
	handleClickCancelButton: function() {
		this.getDefaultBinding().set('mode', 'general');
	},
	getValidationData: function() {
		const binding = this.getDefaultBinding();

		const selectedRivalIndex = binding.toJS('selectedRivalIndex');
		const selectedRivalId = binding.toJS(`teamManagerWrapper.default.rivals.${selectedRivalIndex}`).id;

		return [
			binding.toJS('teamManagerWrapper.default.error').find(data => data.rivalId === selectedRivalId)
		];
	},
	getTeamWrappers: function() {
		return this.getDefaultBinding().toJS('teamManagerWrapper.default.teamModeView.teamWrapper');
	},
	handleClickSubmitButton: function() {
		const binding = this.getDefaultBinding();

		// if true - then user click to finish button
		// so we shouldn't do anything
		if(this.isControlButtonActive()) {
			binding.set('isSubmitProcessing', true);
			this.submit();
		}
	},
	handleClickSaveAndEditNotificationList: function () {
		const binding = this.getDefaultBinding();

		// if true - then user click to finish button
		// so we shouldn't do anything
		if(this.isControlButtonActive()) {
			binding.set('isSubmitProcessing', true);
			binding.set('isManualNotificationMode', true);
			this.submit();
		}
	},
	isGroupEvent: function () {
		const	binding	= this.getDefaultBinding(),
				event	= binding.toJS('model');

		return typeof event.groupId !== 'undefined';
	},
	doAfterCommitActions: function() {
		// just go to event page
		window.location.reload();
	},
	submit: function() {
		const 	binding 			= this.getDefaultBinding(),
				managerGroupChanges = binding.toJS('individuals.managerGroupChanges');
		
		if (managerGroupChanges === EventConsts.CHANGE_MODE.GROUP) {
			return Actions
				.submitGroupChanges(this.props.activeSchoolId, binding)
				.then(() => this.doAfterCommitActions());
		} else {
			return Actions
				.submitAllChanges(this.props.activeSchoolId, binding)
				.then(() => {
					const binding = this.getDefaultBinding();

					const actionDescriptorId = binding.toJS('actionDescriptorId');
					if(typeof actionDescriptorId !== 'undefined') {
						return window.Server.actionDescriptor.get( { actionDescriptorId: actionDescriptorId } ).then(actionDescriptor => {
							actionDescriptor.affectedUserList = EventHeaderActions.convertAffectedUsersToClient(actionDescriptor.affectedUserList);

							binding.set('actionDescriptor', Immutable.fromJS(actionDescriptor));
							binding.set('isChangeTeamManualNotificationPopupOpen', true);

							return true;
						});
					} else {
						this.doAfterCommitActions();
					}
				});
		}
	},
	handleClickUserActivityCheckbox: function (userId, permissionId) {
		let affectedUserList = this.getDefaultBinding().toJS('actionDescriptor.affectedUserList');

		const userIndex = affectedUserList.findIndex(user => user.userId === userId && user.permissionId === permissionId);
		affectedUserList[userIndex].checked = !affectedUserList[userIndex].checked;

		this.getDefaultBinding().set('actionDescriptor.affectedUserList', Immutable.fromJS(affectedUserList))
	},
	handleClickCommitButtonOnPopup: function () {
		const actionDescriptorId = this.getDefaultBinding().toJS('actionDescriptorId');

		return window.Server.actionDescriptor.put(
			{
				actionDescriptorId: actionDescriptorId
			}, {
				usersToNotifyList: this.getDefaultBinding().toJS('actionDescriptor.affectedUserList').filter(user => user.checked)
			}
			)
			.then(() => {
				this.doAfterCommitActions();

				return true;
			});
	},
	getSaveButtonStyleClass: function() {
		return classNames({
			'mMarginLeftFixed'	: true,
			'mDisable'			: !this.getDefaultBinding().toJS('isControlButtonActive')
		});
	},
	isShowRivals: function() {
		const	binding	= this.getDefaultBinding(),
				event	= binding.toJS('model');

		return (
			!EventHelper.isInterSchoolsEvent(event) &&
			TeamHelper.isMultiparty(event) &&
			!TeamHelper.isInternalEventForIndividualSport(event) &&
			!TeamHelper.isInternalEventForTeamSport(event)
		)
	},
	handleCloseChaneModeManager: function () {
		this.getDefaultBinding().set('isShowChangeModeManagerPopup', false);
	},
	renderManager: function() {
		const	binding			= this.getDefaultBinding(),
				managerBinding	= this.getManagerBinding();

		return (
			<Manager
				activeSchoolId			= { this.props.activeSchoolId }
				binding					= { managerBinding }
				selectedRivalIndex		= { binding.toJS('selectedRivalIndex') }
				isShowRivals			= { this.isShowRivals() }
				isShowAddTeamButton		= { false }
				indexOfDisplayingRival	= { binding.toJS('selectedRivalIndex') }
				playerChoosersTabsModel = { this.playerChoosersTabsModel }
				actions					= { this.teamManagerActions }
			/>
		)
	},
	handleClickRadioButton: function(mode){
		this.getDefaultBinding().set('individuals.managerGroupChanges', mode);
	},
	renderSavePlayerChangesManager: function(){
		if (this.isGroupEvent()) {
			return (
				<ManagerGroupChanges
					onClickRadioButton 	= { this.handleClickRadioButton }
					customStyles 		= { 'eSavePlayerChangesManager' }
				/>
			);
		} else {
			return null;
		}

	},
	renderChangeTeamManualNotificationPopup: function () {
		const binding = this.getDefaultBinding();

		if(
			binding.toJS('isChangeTeamManualNotificationPopupOpen')
		) {
			return (
				<ConfirmPopup
					okButtomText		= { 'Commit' }
					isShowCancelButton	= { false }
					handleClickOkButton	= { () => this.handleClickCommitButtonOnPopup() }
					customStyle			= { 'mSmallWidth' }
				>
					<CancelEventManualNotification
						users = { binding.toJS('actionDescriptor.affectedUserList') }
						handleClickUserActivityCheckbox = { (userId, permissionId) => this.handleClickUserActivityCheckbox(userId, permissionId) }
					/>
				</ConfirmPopup>
			);
		} else {
			return null;
		}
	},
	renderSaveButton: function () {
		return (
			<SplitButtonWrapper
				handleClickSaveButton = { this.handleClickSubmitButton }
				handleClickSaveAndEditNotificationList = { this.handleClickSaveAndEditNotificationList }
				isDisableButton = { !this.getDefaultBinding().toJS('isControlButtonActive') }
			/>
		);
	},
	render: function() {
		const binding = this.getDefaultBinding();

		// check control button state
		// and if state was changed then call debounce decorator for changeControlButtonState
		this.checkControlButtonState();

		return (
			<div className="bTeamManagerWrapper">
				{ this.renderManager()}
				{ this.renderSavePlayerChangesManager()}
				<div className="eTeamManagerWrapper_footer">
					<Button
						text				= "Cancel"
						onClick				= { this.handleClickCancelButton }
						extraStyleClasses	= { "mCancel" }
					/>
					{ this.renderSaveButton()}
				</div>
				<SavingPlayerChangesPopup
					binding	= { binding.sub('teamManagerWrapper.default') }
					submit	= { this.handleClickPopupSubmit }
				/>
				{ this.renderChangeTeamManualNotificationPopup() }
			</div>
		);
	}
});

module.exports = ManagerWrapper;