import * as React from 'react';
import * as Morearty from 'morearty';
import * as Immutable from 'immutable';
import * as debounce from 'debounce';

// Main components
import * as classNames from 'classnames';
import * as Promise from 'bluebird';
import * as propz from 'propz';
import {If} from '../../../ui/if/if';
import * as Loader from '../../../ui/loader';
import {Button} from 'module/ui/button/button';

// Special components
import * as Manager from '../../../ui/managers/manager';
import {EventForm} from './manager/event_form/event_form';
import {SavingPlayerChangesPopup} from './saving_player_changes_popup/saving_player_changes_popup';

// Helpers
import * as SavingEventHelper from '../../../helpers/saving_event_helper';
import * as EventConsts from '../../../helpers/consts/events';
import * as EventHelper from '../../../helpers/eventHelper';
import {LocalEventHelper} from 'module/as_manager/pages/events/eventHelper';
import * as TeamHelper from '../../../ui/managers/helpers/team_helper';
import * as RivalsHelper from 'module/ui/managers/rival_chooser/helpers/rivals_helper';
import {SavingPlayerChangesPopupHelper} from './saving_player_changes_popup/helper';
import {ManagerTypes} from 'module/ui/managers/helpers/manager_types';
import {PlayerChoosersTabsModelFactory} from 'module/helpers/player_choosers_tabs_models_factory';
import {TeamManagerActions} from 'module/helpers/actions/team_manager_actions';
import {Event} from './events';

import {EVENT_FORM_MODE} from 'module/as_manager/pages/events/manager/event_form/consts/consts';

import {EventFormActions} from 'module/as_manager/pages/events/manager/event_form/event_form_actions';

// Styles
import '../../../../../styles/pages/events/b_events_manager.scss';

interface EventManagerProps {
	activeSchoolId: string
}

interface EventBody {
	gender:					string
	// invited
	// convert client event type const to server event type const
	eventType:				string
	ages:					string[]
	sportId:				string
	startTime:				string
	endTime:				string
	startRegistrationTime:	string
	endRegistrationTime:	string
	invitedSchoolIds?:      string[]
	houses?:                any
}

export const EventManager = (React as any).createClass({
	mixins: [Morearty.Mixin],

	listeners: [],
	onDebounceChangeSaveButtonState: undefined,
	playerChoosersTabsModel: undefined,
	teamManagerActions: undefined,
	/**
	 * Function check manager data and set corresponding value to isControlButtonActive
	 */
	changeSaveButtonState: function() {
		const binding	= this.getDefaultBinding();

		binding.set('isSaveButtonActive', this.isSaveButtonActive());
	},
	getMergeStrategy: function () {
		return Morearty.MergeStrategy.MERGE_REPLACE;
	},
	getDefaultState: function () {
		const calendarBinding = this.getBinding('calendar');

		const currentDate = calendarBinding.toJS('selectedDate');
		currentDate.setHours(10);
		currentDate.setMinutes(0);
		const endTime = new Date(currentDate);
		endTime.setHours(currentDate.getHours() + 1);

		return Immutable.fromJS({
			// if true - then user click to finish button
			// so we must block finish button
			isSubmitProcessing: false,
			isTeamManagerSync: false,
			model: {
				name:			'',
				startTime:		currentDate.toISOString(),
				endTime:		endTime.toISOString(),
				sportId:		undefined,
				gender:			undefined,
				ages:			[],
				description:	'',
				type:			'inter-schools'
			},
			schoolInfo: {},
			inviteModel: {},
			step: 1,
			availableAges: [],
			rivals: [],
			error: [],
			isEventManagerSync: false,
			isSync: false,
			isSavingChangesModePopupOpen: false,
			fartherThen: LocalEventHelper.distanceItems[0].id,
			eventFormOpponentSchoolKey: undefined,
			isShowAllSports: false,
			isSaveButtonActive: false
		});
	},
	componentWillMount: function () {
		const binding	= this.getDefaultBinding();

		LocalEventHelper.setParamsFromUrl(this);
		this.initPlayerChoosersTabsModel();
		this.initTeamManagerActions();

		this.setSchoolInfo()
			.then(() => {
				switch (this.mode) {
					case EventHelper.EVENT_CREATION_MODE.COPY:
						return LocalEventHelper.setEvent(this, this.eventId, EVENT_FORM_MODE.SCHOOL);
					case EventHelper.EVENT_CREATION_MODE.ANOTHER:
						return LocalEventHelper.setDateFromEventByEventId(this, this.eventId);
					default:
						return true;
				}
			})
			.then(() => {
				return EventFormActions.getSports(this.props.activeSchoolId);
			})
			.then(sports => {
				this.addListeners();

				binding.atomically()
					.set('sports',				Immutable.fromJS(sports))
					.set('isSync',				true)
					.set('isEventManagerSync',	true)
					.commit();
			});

		// create debounce decorator for changeControlButtonState func
		this.onDebounceChangeSaveButtonState = debounce(this.changeSaveButtonState, 200);
	},
	initPlayerChoosersTabsModel: function (): void {
		this.playerChoosersTabsModel = PlayerChoosersTabsModelFactory.createTabsModelByManagerType(
			ManagerTypes.Default
		);
	},
	initTeamManagerActions: function (): void {
		this.teamManagerActions = new TeamManagerActions( {schoolId: this.props.activeSchoolId} );
	},
	isShowAddTeamButton: function(): boolean {
		const	binding	= this.getDefaultBinding();

		const	event	= binding.toJS('model'),
				sport	= event.sportModel;


		return TeamHelper.isInternalEventForTeamSport(event) && sport.multiparty;
	},
	setDefaultStateForActiveSchoolRivalsForInterSchoolEvent: function(): void {
		const binding = this.getDefaultBinding();

		const rivals = binding.toJS('rivals');

		const updRivals = [];
		let isArrayContainAtLeastOneActiveSchoolRival = false;
		rivals.forEach(r => {
			switch (true) {
				case !isArrayContainAtLeastOneActiveSchoolRival && r.school.id === this.props.activeSchoolId: {
					isArrayContainAtLeastOneActiveSchoolRival = true;
					updRivals.push(r);
					break;
				}
				case r.school.id !== this.props.activeSchoolId: {
					updRivals.push(r);
					break;
				}
			}
		});

		binding.set('rivals', Immutable.fromJS(updRivals));
	},
	setEvent: function(eventId: string): Promise<any> {
		const binding = this.getDefaultBinding();

		let event;

		// TODO check inter-schools case
		return (window as any).Server.schoolEvent.get({
			schoolId	: this.props.activeSchoolId,
			eventId		: eventId
		})
			.then(_event => {
				event = _event;

				return TeamHelper.getSchoolsArrayWithFullDataByEvent(event);
			})
			.then(schoolsData => {
				// Schools data need for rival helper
				event.schoolsData = schoolsData;

				delete event.status;
				// It's a convertation event data to EventForm component format,
				// because event
				event.gender = this.convertServerGenderConstToClient(event);
				event.type = this.convertServerEventTypeConstToClient(event);

				// TODO need reviver for postcode on server side
				const postcodeId = propz.get(event, ['venue', 'postcodeData', '_id'], undefined);
				if(typeof postcodeId !== 'undefined') {
					event.venue.postcodeData.id = postcodeId;
				}
				if (event.venue.venueType === "TBD") {
					event.venue.postcodeData = {
						id: "TBD",
						postcode: "TBD"
					}
				}
				const rivals = this.getRivals(event);
				binding.atomically()
					.set('isSubmitProcessing',				false)
					.set('isSavingChangesModePopupOpen',	false)
					.set('model',							Immutable.fromJS(event))
					.set('model.sportModel',				Immutable.fromJS(event.sport))
					.set('rivals',							Immutable.fromJS(rivals))
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

				return true;
			});
	},
	convertServerGenderConstToClient: function(event: Event): string {
		switch (event.gender) {
			case EventConsts.EVENT_GENDERS_SERVER.FEMALE_ONLY:
				return EventConsts.EVENT_GENDERS.FEMALE_ONLY;
			case EventConsts.EVENT_GENDERS_SERVER.MALE_ONLY:
				return EventConsts.EVENT_GENDERS.MALE_ONLY;
			case EventConsts.EVENT_GENDERS_SERVER.MIXED:
				return EventConsts.EVENT_GENDERS.MIXED;
		}
	},
	convertServerEventTypeConstToClient: function(event: Event) {
		return EventHelper.serverEventTypeToClientEventTypeMapping[event.eventType];
	},
	setSchoolInfo: function(): Promise<any> {
		const binding	= this.getDefaultBinding();

		let schoolData;
		//get school data
		return (window as any).Server.school.get(this.props.activeSchoolId)
			.then(_schoolData => {
				schoolData = _schoolData;

				// get forms data
				return (window as any).Server.schoolForms.get(this.props.activeSchoolId, {filter:{limit:1000}});
			})
			.then(forms => {
				schoolData.forms = forms;

				const	ages	= TeamHelper.getAges(schoolData), // get avail ages
						rivals	= RivalsHelper.getDefaultRivalsForInterSchoolsEvent(schoolData);

				binding
					.atomically()
					.set('schoolInfo',		Immutable.fromJS(schoolData))
					.set('rivals',			Immutable.fromJS(rivals))
					.set('availableAges',	Immutable.fromJS(ages))
					.commit();

				return true;
			});
	},
	componentWillUnmount: function () {
		const binding	= this.getDefaultBinding();

		this.listeners.forEach(l => binding.removeListener(l));
		binding.clear();
	},
	addListeners: function(): void {
		this.addListenerForTeamManager();
		this.addListenersForEventTimeAndSetDefaultValue();
		if(this.mode === 'copy') {
			this.addListenersForEventManagerBase();
		}
	},
	//end time must be greater then start time always (this restriction was add to server 19-04-2018)
	//if not, add error style in component TimeInputWrapper
	addListenersForEventTimeAndSetDefaultValue: function(): void{
		const binding = this.getDefaultBinding();
		binding.set('model.isTimesValid', true);
		this.listeners.push(binding.sub('model.startTime').addListener( eventDescriptor =>
			{
				const currentValue = eventDescriptor.getCurrentValue();
				const 	startTime 		= new Date(currentValue),
						startTimeHours 	= startTime.getHours();

				switch(true){
					case(currentValue >= binding.sub('model.endTime').toJS() && startTimeHours !== 23):
						const endTime = new Date(currentValue);
						endTime.setHours(endTime.getHours() + 1);
						binding.set('model.endTime', endTime.toISOString());
						break;
					case(currentValue >= binding.sub('model.endTime').toJS() && startTimeHours === 23):
						binding.set('model.isTimesValid', false);
						break;
					default:
						binding.set('model.isTimesValid', true);
						break;
				}
			}
		));
		this.listeners.push(binding.sub('model.endTime').addListener(eventDescriptor =>
			{
				const currentValue = eventDescriptor.getCurrentValue();
				const 	endTime 		= new Date(currentValue),
						endTimeHours 	= endTime.getHours();

				switch(true){
					case(currentValue <= binding.sub('model.startTime').toJS() && endTimeHours !== 0):
						const startTime = new Date(currentValue);
						startTime.setHours(startTime.getHours() - 1);
						binding.set('model.startTime', startTime.toISOString());
						break;
					case(currentValue >= binding.sub('model.endTime').toJS() && endTimeHours === 0):
						binding.set('model.isTimesValid', false);
						break;
					default:
						binding.set('model.isTimesValid', true);
						break;
				}
			}
		));
	},

	addListenerForTeamManager: function(): void {
		const binding = this.getDefaultBinding();

		this.listeners.push(
			binding
				.sub('isSync')
				.addListener(eventDescriptor => {
					// Lock submit button if team manager in searching state.
					eventDescriptor.getCurrentValue() && binding.set('isTeamManagerSync', true);

					// Unlock submit button if team manager in searching state.
					!eventDescriptor.getCurrentValue() && binding.set('isTeamManagerSync', false);
				})
		);
	},
	addListenersForEventManagerBase: function(): void {
		const binding = this.getDefaultBinding();

		this.listeners.push(binding.sub('model.sportId').addListener(() => this.clearRivalsBinding()));
		this.listeners.push(binding.sub('model.gender').addListener(() => this.clearRivalsBinding()));
		this.listeners.push(binding.sub('model.ages').addListener(() => this.clearRivalsBinding()));
		this.listeners.push(binding.sub('model.type').addListener(() => this.clearRivalsBinding()));
	},
	clearRivalsBinding: function(): void {
		const	binding	= this.getDefaultBinding(),
				step	= binding.get('step');

		if(!this.isRivalsClear && step === 1) {
			this.isRivalsClear = true;
			const rivals = binding.toJS('rivals');

			rivals[0].players = undefined;
			rivals[0].team = undefined;
			if(typeof rivals[1] !==  'undefined') {
				rivals[1].players = undefined;
				rivals[1].team = undefined;
			}

			binding.set('rivals', Immutable.fromJS(rivals));
		}
	},
	toNext: function (): void {
		const binding = this.getDefaultBinding();

		binding.update('step', function (step) {
			return step + 1;
		});
	},
	toBack: function (): void {
		const binding = this.getDefaultBinding();
		binding.set('step', 1);

		const event = binding.toJS('model');
		if(TeamHelper.isInterSchoolsEventForTeamSport(event) && TeamHelper.isMultiparty(event)) {
			this.setDefaultStateForActiveSchoolRivalsForInterSchoolEvent();
		}
	},
	changeRivalFocusToErrorForm: function(): void {
		const binding = this.getDefaultBinding();

		let incorrectRivalIndex = -1;

		const validationData = binding.toJS('error');
		for(let i = 0; i < validationData.length; i++) {
			if(validationData[i].isError) {
				const rivalId = validationData[i].rivalId;
				incorrectRivalIndex = binding.toJS(`rivals`).findIndex(r => r.id === rivalId);
				break;
			}
		}

		if(incorrectRivalIndex !== -1) {
			this.getDefaultBinding()
				.atomically()
				.set('teamModeView.selectedRivalIndex', Immutable.fromJS(incorrectRivalIndex))
				.commit();
		}
	},
	isSaveButtonActive: function(): boolean {
		const binding = this.getDefaultBinding();

		if(
			binding.get('isTeamManagerSync') &&
			!binding.get('isSubmitProcessing') &&
			this._isStepComplete(2)
		) {
			return true;
		} else {
			return false;
		}
	},
	handleClickFinishButton: function (): void {
		const binding	= this.getDefaultBinding();

		// if true - then user click to finish button
		// so we shouldn't do anything
		if(this.isSaveButtonActive()) {
			const	event			= binding.toJS('model'),
					teamWrappers	= this.getTeamWrappers(),
					validationData	= binding.toJS('error');

			switch (true) {
				case (
					TeamHelper.isTeamDataCorrect(validationData) && TeamHelper.isTeamSport(event) &&
					!SavingPlayerChangesPopupHelper.isAnyTeamChanged(event, teamWrappers, this.props.activeSchoolId) && SavingPlayerChangesPopupHelper.isUserCreateNewTeam(event, teamWrappers, this.props.activeSchoolId)
				):
					this.showSavingChangesModePopup();
					break;
				case (
					TeamHelper.isTeamDataCorrect(validationData) && TeamHelper.isTeamSport(event) &&
					SavingPlayerChangesPopupHelper.isAnyTeamChanged(event, teamWrappers, this.props.activeSchoolId) && !SavingPlayerChangesPopupHelper.isUserCreateNewTeam(event, teamWrappers, this.props.activeSchoolId)
				):
					this.showSavingChangesModePopup();
					break;
				case (
					TeamHelper.isTeamDataCorrect(validationData) && TeamHelper.isTeamSport(event) &&
					SavingPlayerChangesPopupHelper.isAnyTeamChanged(event, teamWrappers, this.props.activeSchoolId) && SavingPlayerChangesPopupHelper.isUserCreateNewTeam(event, teamWrappers, this.props.activeSchoolId)
				):
					this.showSavingChangesModePopup();
					break;
				case (
					TeamHelper.isTeamDataCorrect(validationData) && TeamHelper.isTeamSport(event) &&
					!SavingPlayerChangesPopupHelper.isAnyTeamChanged(event, teamWrappers, this.props.activeSchoolId) && !SavingPlayerChangesPopupHelper.isUserCreateNewTeam(event, teamWrappers, this.props.activeSchoolId)
				):
					binding.set('isSubmitProcessing', true);
					this.submit();
					break;
				case TeamHelper.isTeamDataCorrect(validationData) && TeamHelper.isNonTeamSport(event):
					binding.set('isSubmitProcessing', true);
					this.submit();
					break;
				// If teams data isn't correct
				case !TeamHelper.isTeamDataCorrect(validationData):
					// So, let's show form with incorrect data
					this.changeRivalFocusToErrorForm();
					break;
			}
		}
	},
	getTeamWrappers: function() {
		return this.getDefaultBinding().toJS('teamModeView.teamWrapper');
	},
	submit: function() {
		const binding	= this.getDefaultBinding();

		const eventModel = binding.toJS('model');

		let savedEvent;

		switch (true) {
			case TeamHelper.isNonTeamSport(eventModel):
				return this.submitEvent()
					.then( _event => {
						savedEvent = _event;

						const	activeSchoolId	= this.props.activeSchoolId,
							teamWrapper		= binding.toJS(`teamModeView.teamWrapper`);

						return TeamHelper.addIndividualPlayersToEvent(activeSchoolId, savedEvent, teamWrapper);
					})
					.then( () => this.activateEvent(savedEvent) )
					.then( () => this._afterEventCreation(savedEvent) );
			case TeamHelper.isTeamSport(eventModel):
				const	activeSchoolId	= this.props.activeSchoolId,
						rivals			= binding.toJS(`rivals`),
						model			= binding.toJS('model'),
						teamWrapper		= binding.toJS(`teamModeView.teamWrapper`);

				return SavingEventHelper.processSavingChangesMode(activeSchoolId, rivals, model, teamWrapper)
					.then( () => this.submitEvent() )
					.then( _event => {
						savedEvent = _event;

						const teams = TeamHelper.createTeams(activeSchoolId, model, rivals, teamWrapper);

						return Promise.all( TeamHelper.addTeamsToEvent(activeSchoolId, savedEvent.id, teams) );
					})
					.then( () => this.activateEvent(savedEvent) )
					.then( () => this._afterEventCreation(savedEvent) );
		}
	},
	activateEvent: function(event: Event): Promise<any> {
		return (window as any).Server.schoolEventActivate.post({
			schoolId:	this.props.activeSchoolId,
			eventId:	event.id
		});
	},
	submitEvent: function(): Promise<any> {
		const binding = this.getDefaultBinding();

		const model = binding.toJS('model');

		const body: EventBody = {
			gender:					TeamHelper.convertGenderToServerValue(model.gender),
			// invited
			// convert client event type const to server event type const
			eventType:				EventHelper.clientEventTypeToServerClientTypeMapping[model.type],
			ages:					model.ages,
			sportId:				model.sportId,
			startTime:				model.startTime,
			endTime:				model.endTime,
			startRegistrationTime:	model.startRegistrationTime,
			endRegistrationTime:	model.endRegistrationTime
		};

		this.setVenueToBody(body);

		const rivals = binding.toJS('rivals');
		switch (model.type) {
			case 'inter-schools':
				body.invitedSchoolIds = rivals
					.filter(r => r.school.id !== this.props.activeSchoolId)
					.map(r => r.school.id);

				break;
			case 'houses':
				body.invitedSchoolIds = [this.props.activeSchoolId];

				body.houses = rivals.map(r => r.id);

				break;
			case 'internal':
				body.invitedSchoolIds = [this.props.activeSchoolId];

				break;
		}

		return (window as any).Server.events.post(
			this.props.activeSchoolId,
			body
		);
	},
	setVenueToBody: function(body): void {
		const binding = this.getDefaultBinding();
		const modelVenue = binding.toJS('model.venue');
		body.venue = {
			venueType: modelVenue.venueType,
			point: modelVenue.point
		};
		if(modelVenue.postcodeData.id !== 'TBD') {
			body.venue.postcodeId = modelVenue.postcodeData.id;

			if (modelVenue.postcodeData.placeId) {
				body.venue.placeId = modelVenue.postcodeData.placeId;
			}

		}
	},
	/**
	 * Actions that do after fully event creation
	 * 1) Clear binding
	 * 2) Redirect to event page
	 * @private
	 */
	_afterEventCreation: function(event: Event): boolean {
		const binding	= this.getDefaultBinding();

		document.location.hash = 'event/' + event.id + '?tab=gallery&new=true';
		binding.clear();
		binding.meta().clear();

		return true;
	},
	renderStepButtons: function(): React.ReactNode {
		const binding		= this.getDefaultBinding();

		const step = binding.get('step');

		switch(step) {
			case 1: {
				const isDisabled = !this._isStepComplete(1),
					continueButtonClassName = classNames({
						mWidth: true,
						mDisable: isDisabled
					});

				return (
					<div className="eManager_controlButtons">
						<Button
							text="Continue"
							onClick={this.toNext}
							extraStyleClasses={continueButtonClassName}
							isDisabled={isDisabled}
						/>
					</div>
				);
			}
			case 2: {
				const isDisabled = !this.getDefaultBinding().toJS('isSaveButtonActive'),
					finishButtonClassName = classNames({
						mFinish: true,
						mDisable: isDisabled
					});

				return (
					<div className="eTeamManagerWrapper_footer">
						<Button
							text				= "Back"
							onClick				= {this.toBack}
							extraStyleClasses	= {"mCancel mMarginRight"}
						/>
						<Button
							text				= "Finish"
							onClick				= {this.handleClickFinishButton}
							isDisabled			= {isDisabled}
							extraStyleClasses	= {finishButtonClassName}
						/>
					</div>
				);
			}
		}
	},
	_isStepComplete: function(step: number): boolean {
		let		isStepComplete	= false;

		switch (step) {
			case 1:
				isStepComplete = this._isFirstStepIsComplete();
				break;
			case 2:
				isStepComplete = true;
				break;
		}

		return isStepComplete;
	},
	_isFirstStepIsComplete: function(): boolean {
		const binding = this.getDefaultBinding();

		return (
			typeof binding.get('model.startTime')				!== 'undefined' &&
			binding.get('model.startTime') 						!== null &&
			binding.get('model.startTime') 						!== '' &&
			binding.get('model.startTime') < binding.get('model.endTime') &&
			typeof binding.toJS('model.sportId')				!== 'undefined' &&
			binding.toJS('model.sportId')						!== '' &&
			typeof binding.toJS('model.gender')					!== 'undefined' &&
			binding.toJS('model.gender')						!== '' &&
			binding.toJS('model.gender')						!== 'not-selected-gender' &&
			typeof binding.toJS('model.type')					!== 'undefined' &&
			binding.toJS('model.type')							!== '' &&
			typeof binding.toJS('model.venue.postcodeData')		!== 'undefined' &&
			typeof binding.toJS('model.venue.postcodeData.id')	!== 'undefined' &&
			this.isAllRivalsSelected()
		);
	},
	isAllRivalsSelected: function(): boolean {
		const binding			= this.getDefaultBinding();
		let		isStepComplete	= false;

		switch (binding.toJS('model.type')) {
			case 'inter-schools':
			case 'houses':
				if(binding.toJS('rivals').length > 1) {
					isStepComplete = true;
				}
				break;
			case 'internal':
				isStepComplete = true;
				break;
		}

		return isStepComplete;
	},
	showSavingChangesModePopup: function(): void {
		this.getDefaultBinding().set('isSavingChangesModePopupOpen', true);
	},
	checkSaveButtonState: function(): void {
		const binding = this.getDefaultBinding();

		if(binding.toJS('isSaveButtonActive') !== this.isSaveButtonActive()) {
			typeof this.onDebounceChangeSaveButtonState !== 'undefined' && this.onDebounceChangeSaveButtonState();
		}
	},
	renderEventManagerBase: function(): React.ReactNode {
		const	binding				= this.getDefaultBinding(),
				isEventManagerSync	= binding.get('isEventManagerSync');

		const	commonBinding	= {
			default				: binding,
			calendar			: this.getBinding('calendar')
		};

		if(isEventManagerSync) {
			return (
				<EventForm	binding			= { commonBinding }
				              activeSchoolId	= { this.props.activeSchoolId }
				              isCopyMode		= { this.isCopyMode }
				/>
			);
		} else {
			return (
				<Loader condition={true}/>
			);
		}
	},
	renderManager: function(): React.ReactNode {
		const	binding	= this.getDefaultBinding(),
				event	= binding.toJS('model');

		const managerBinding	= {
			default	: binding,
			rivals	: binding.sub('rivals'),
			error	: binding.sub('error')
		};

		return (
			<Manager
				activeSchoolId			= { this.props.activeSchoolId }
				isShowRivals			= { !TeamHelper.isInternalEventForIndividualSport(event) }
				isShowAddTeamButton		= { this.isShowAddTeamButton() }
				isCopyMode				= { this.mode === EventHelper.EVENT_CREATION_MODE.COPY }
				binding					= { managerBinding }
				playerChoosersTabsModel	= { this.playerChoosersTabsModel }
				actions					= { this.teamManagerActions }
			/>
		);
	},
	render: function() {
		const	binding				= this.getDefaultBinding(),
				isEventManagerSync	= binding.get('isEventManagerSync'),
				step				= binding.toJS('step');

		const	bManagerClasses	= classNames({
			bManager			: step === 1,
			bTeamManagerWrapper : step === 2
		});

		if(step === 2) {
			// check control button state
			// and if state was changed then call debounce decorator for changeControlButtonState
			this.checkSaveButtonState();
		}

		return (
			<div>
				<div className={bManagerClasses}>
					<If condition={step === 1}>
						{ this.renderEventManagerBase() }
					</If>
					<If condition={step === 2}>
						{ this.renderManager() }
					</If>
					<If condition={isEventManagerSync}>
						{ this.renderStepButtons() }
					</If>
				</div>
				<SavingPlayerChangesPopup
					binding			= { binding }
					activeSchoolId	= { this.props.activeSchoolId }
					submit			= { () => this.submit() }
				/>
			</div>
		);
	}
});