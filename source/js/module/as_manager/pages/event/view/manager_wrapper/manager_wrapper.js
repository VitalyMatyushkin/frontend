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
		SavingEventHelper				= require('../../../../../helpers/saving_event_helper');

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
		const	binding	= this.getDefaultBinding(),
				event	= binding.toJS('model');

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
			.set('selectedRivalIndex',		Immutable.fromJS(selectedRivalIndex))
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
		if(TeamHelper.isNewEvent(event) && !EventHelper.isHousesEvent(event)) {
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

		return Actions
			.submitAllChanges(this.props.activeSchoolId, binding)
			.then(() => this.doAfterCommitActions());
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
			!EventHelper.isInterSchoolsEvent(event) && TeamHelper.isMultiparty(event) &&
			!TeamHelper.isInternalEventForIndividualSport(event) &&
			!TeamHelper.isInternalEventForTeamSport(event)
		)
	},
	renderManager: function() {
		const	binding			= this.getDefaultBinding(),
				managerBinding	= this.getManagerBinding();

		return (
			<Manager
				binding					= { managerBinding }
				selectedRivalIndex		= { binding.toJS('selectedRivalIndex') }
				isShowRivals			= { this.isShowRivals() }
				isShowAddTeamButton		= { false }
				indexOfDisplayingRival	= { binding.toJS('selectedRivalIndex') }
			/>
		)
	},
	render: function() {
		const binding = this.getDefaultBinding();

		// check control button state
		// and if state was changed then call debounce decorator for changeControlButtonState
		this.checkControlButtonState();

		return (
			<div className="bTeamManagerWrapper">
				{ this.renderManager() }
				<SavingPlayerChangesPopup
					binding	= { binding.sub('teamManagerWrapper.default') }
					submit	= { this.handleClickPopupSubmit }
				/>
				<div className="eTeamManagerWrapper_footer">
					<Button
						text				= "Cancel"
						onClick				= { this.handleClickCancelButton }
						extraStyleClasses	= { "mCancel" }
					/>
					<Button
						text				= "Save"
						onClick				= { this.handleClickSubmitButton }
						extraStyleClasses	= { this.getSaveButtonStyleClass() }
					/>
				</div>
			</div>
		);
	}
});

module.exports = ManagerWrapper;