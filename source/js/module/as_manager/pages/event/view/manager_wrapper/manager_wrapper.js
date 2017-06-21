const	React 							= require('react'),
		Morearty						= require('morearty'),
		Immutable						= require('immutable'),
		debounce						= require('debounce');

const	Manager							= require('./../../../../../ui/managers/manager'),
		EventHelper						= require('./../../../../../helpers/eventHelper'),
		ManagerWrapperHelper			= require('./manager_wrapper_helper'),
		NewManagerWrapperHelper			= require('./new_manager_wrapper_helper'),
		Button							= require('../../../../../ui/button/button'),
		classNames						= require('classnames'),
		TeamHelper						= require('./../../../../../ui/managers/helpers/team_helper');

const	Actions							= require('../../actions/actions'),
		SavingPlayerChangesPopup		= require('../../../events/saving_player_changes_popup/saving_player_changes_popup'),
		SavingPlayerChangesPopupHelper	= require('../../../events/saving_player_changes_popup/helper'),
		SavingEventHelper				= require('../../../../../helpers/saving_event_helper'),
		NewEventHelper					= require('module/as_manager/pages/event/helpers/new_event_helper'),
		ManagerHelper					= require('../../../../../ui/managers/helpers/manager_helper');

const	TeamManagerWrapperStyle			= require('../../../../../../../styles/ui/b_team_manager_wrapper.scss');

const ManagerWrapper = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		activeSchoolId: React.PropTypes.string.isRequired
	},
	// debounce decorator for changeControlButtonState func
	onDebounceChangeControlButtonState: undefined,
	/**
	 * Function check manager data and set corresponding value to isControlButtonActive
	 */
	changeControlButtonState: function() {
		const	self	= this,
				binding	= self.getDefaultBinding();

		binding.set('isControlButtonActive', this.isControlButtonActive());
	},
	componentWillMount: function() {
		const	self	= this,
				binding	= self.getDefaultBinding();

		let selectedRivalIndex = binding.get('selectedRivalIndex');
		typeof selectedRivalIndex === 'undefined' && (selectedRivalIndex = 0);

		const event = binding.toJS('model');

		const	managerWrapperRivals	= this.getRivals(event, binding.toJS('rivals')),
				schoolInfo				= this.getSchoolInfo(event, binding.toJS('rivals'), selectedRivalIndex);

		binding.sub('teamManagerWrapper.default').atomically()
			.set('isSubmitProcessing',				false)
			.set('isSavingChangesModePopupOpen',	false)
			.set('model',							Immutable.fromJS(event))
			.set('model.sportModel',				Immutable.fromJS(event.sport))
			.set('rivals',							Immutable.fromJS(managerWrapperRivals))
			.set('schoolInfo',						Immutable.fromJS(schoolInfo))
			.set('selectedRivalIndex',				Immutable.fromJS(selectedRivalIndex))
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
			.set('isTeamManagerSync',		false)
			.set('isControlButtonActive',	false)
			.commit();

		this.addListeners();

		// create debounce decorator for changeControlButtonState func
		this.onDebounceChangeControlButtonState = debounce(this.changeControlButtonState, 200);
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

		const	event			= binding.toJS('model'),
				validationData	= this.getValidationData();

		if(
			binding.get('isTeamManagerSync') &&
			!binding.toJS('teamManagerWrapper.default.isSubmitProcessing') &&
			TeamHelper.isTeamDataCorrect(event, validationData)
		) {
			return true;
		} else {
			return false;
		}
	},
	getRivals: function(event, rivals) {
		if(NewEventHelper.mustUseNewManagerWraperHelper(event)) {
			return NewManagerWrapperHelper.getRivals(event, rivals);
		} else {
			return ManagerWrapperHelper.getRivals(this.props.activeSchoolId, event, false);
		}
	},
	getSchoolInfo: function(event, rivals, selectedRivalIndex) {
		if(NewEventHelper.isNewEvent(event)) {
			const school = rivals[selectedRivalIndex].school;

			if(school.id === event.inviterSchoolId) {
				return event.inviterSchool;
			} else {
				return event.invitedSchools.find(s => s.id === school.id);
			}
		} else {
			return event.inviterSchoolId === this.props.activeSchoolId ? event.inviterSchool : event.invitedSchools[0];
		}
	},
	getManagerBinding: function() {
		const	self						= this,
				binding						= self.getDefaultBinding(),
				teamManagerWrapperBinding	= binding.sub('teamManagerWrapper');

		return {
			default:			teamManagerWrapperBinding.sub('default'),
			selectedRivalIndex:	teamManagerWrapperBinding.sub('default.selectedRivalIndex'),
			rivals:				teamManagerWrapperBinding.sub('default.rivals'),
			error:				teamManagerWrapperBinding.sub('default.error')
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
		const	self	= this,
			binding	= self.getDefaultBinding();

		const event = binding.toJS('model');

		if(EventHelper.isInterSchoolsEvent(event)) {
			return [
				binding.toJS('teamManagerWrapper.default.error.0')
			];
		} else {
			return [
				binding.toJS('teamManagerWrapper.default.error.0'),
				binding.toJS('teamManagerWrapper.default.error.1')
			];
		}
	},
	getTeamWrappers: function() {
		return this.getDefaultBinding().toJS('teamManagerWrapper.default.teamModeView.teamWrapper');
	},
	handleClickSubmitButton: function() {
		const	self	= this,
				binding	= self.getDefaultBinding();

		// if true - then user click to finish button
		// so we shouldn't do anything
		if(this.isControlButtonActive()) {

			binding.set('isSubmitProcessing', true);
			this.submit();
			//switch (true) {
			//	case (
			//			TeamHelper.isTeamDataCorrect(event, validationData) && TeamHelper.isTeamSport(event) &&
			//			!SavingPlayerChangesPopupHelper.isAnyTeamChanged(event, teamWrappers) && SavingPlayerChangesPopupHelper.isUserCreateNewTeam(event, teamWrappers)
			//	):
			//		this.showSavingChangesModePopup();
			//		break;
			//	case (
			//			TeamHelper.isTeamDataCorrect(event, validationData) && TeamHelper.isTeamSport(event) &&
			//			SavingPlayerChangesPopupHelper.isAnyTeamChanged(event, teamWrappers) && !SavingPlayerChangesPopupHelper.isUserCreateNewTeam(event, teamWrappers)
			//	):
			//		this.showSavingChangesModePopup();
			//		break;
			//	case (
			//			TeamHelper.isTeamDataCorrect(event, validationData) && TeamHelper.isTeamSport(event) &&
			//			SavingPlayerChangesPopupHelper.isAnyTeamChanged(event, teamWrappers) && SavingPlayerChangesPopupHelper.isUserCreateNewTeam(event, teamWrappers)
			//	):
			//		this.showSavingChangesModePopup();
			//		break;
			//	case (
			//			TeamHelper.isTeamDataCorrect(event, validationData) && TeamHelper.isTeamSport(event) &&
			//			!SavingPlayerChangesPopupHelper.isAnyTeamChanged(event, teamWrappers) && !SavingPlayerChangesPopupHelper.isUserCreateNewTeam(event, teamWrappers)
			//	):
			//		binding.set('isSubmitProcessing', true);
			//		this.submit();
			//		break;
			//	case TeamHelper.isTeamDataCorrect(event, validationData) && TeamHelper.isNonTeamSport(event):
			//		binding.set('isSubmitProcessing', true);
			//		this.submit();
			//		break;
			//}
		}
	},
	showSavingChangesModePopup: function() {
		this.getDefaultBinding().set('teamManagerWrapper.default.isSavingChangesModePopupOpen', true);
	},
	doAfterCommitActions: function() {
		// just go to event page
		window.location.reload();
	},
	submit: function() {
		const binding = this.getDefaultBinding();

		//return Promise.all(this.processSavingChangesMode())
		//	.then(() => Actions.submitAllChanges(this.activeSchoolId, binding))
		//	.then(() => this.doAfterCommitActions());

		return Actions.submitAllChanges(this.props.activeSchoolId, binding).then(() => this.doAfterCommitActions());
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
			!TeamHelper.isInternalEventForIndividualSport(event) &&
			!TeamHelper.isInternalEventForTeamSport(event)
		)
	},
	render: function() {
		const	binding			= this.getDefaultBinding(),
				managerBinding	= this.getManagerBinding();

		// check control button state
		// and if state was changed then call debounce decorator for changeControlButtonState
		this.checkControlButtonState();

		// provide isShowRivals by isInviteMode is a trick
		return (
			<div className="bTeamManagerWrapper">
				<Manager	binding					= {managerBinding}
							isShowRivals			= {this.isShowRivals()}
							isShowAddTeamButton		= {false}
							indexOfDisplayingRival	= {binding.toJS('selectedRivalIndex')}
				/>
				<SavingPlayerChangesPopup	binding	= {binding.sub('teamManagerWrapper.default')}
											submit	= {this.handleClickPopupSubmit}
				/>
				<div className="eTeamManagerWrapper_footer">
					<Button	text				= "Cancel"
							onClick				= {this.handleClickCancelButton}
							extraStyleClasses	= {"mCancel"}
						/>
					<Button	text				= "Save"
							onClick				= {this.handleClickSubmitButton}
							extraStyleClasses	= {this.getSaveButtonStyleClass()}
					/>
				</div>
			</div>
		);
	}
});

module.exports = ManagerWrapper;