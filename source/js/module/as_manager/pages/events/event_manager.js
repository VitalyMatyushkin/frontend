const	React							= require('react'),
		Morearty						= require('morearty'),
		Immutable						= require('immutable');

// Main components
const	classNames						= require('classnames'),
		Promise							= require('bluebird'),
		propz							= require('propz'),
		If								= require('../../../ui/if/if'),
		Loader							= require('../../../ui/loader'),
		Button							= require('../../../ui/button/button');

// Special components
const	Manager							= require('../../../ui/managers/manager'),
		EventForm						= require('./manager/event_form/event_form'),
		SavingPlayerChangesPopup		= require('./saving_player_changes_popup/saving_player_changes_popup');

// Helpers
const	ManagerWrapperHelper			= require('../event/view/manager_wrapper/manager_wrapper_helper'),
		SavingEventHelper				= require('../../../helpers/saving_event_helper'),
		EventConsts						= require('../../../helpers/consts/events'),
		EventHelper						= require('../../../helpers/eventHelper'),
		LocalEventHelper				= require('./eventHelper'),
		MoreartyHelper					= require('../../../helpers/morearty_helper'),
		TeamHelper						= require('../../../ui/managers/helpers/team_helper'),
		SavingPlayerChangesPopupHelper	= require('./saving_player_changes_popup/helper');

// Styles
const	ManagerStyles					= require('../../../../../styles/pages/events/b_events_manager.scss');

const EventManager = React.createClass({
	mixins: [Morearty.Mixin],
	listeners: [],
	getMergeStrategy: function () {
		return Morearty.MergeStrategy.MERGE_REPLACE;
	},
	getDefaultState: function () {
		var	self = this,
			rootBinding = self.getMoreartyContext().getBinding(),
			activeSchoolId = rootBinding.get('userRules.activeSchoolId'),
			calendarBinding = this.getBinding('calendar');

		const currentDate = calendarBinding.toJS('selectedDate');
		currentDate.setHours(10);
		currentDate.setMinutes(0);

		return Immutable.fromJS({
			// if true - then user click to finish button
			// so we must block finish button
			isSubmitProcessing: false,
			isTeamManagerSync: false,
			model: {
				name:			'',
				startTime:		currentDate,
				sportId:		undefined,
				gender:			undefined,
				ages:			[],
				description:	'',
				type:			'inter-schools'
			},
			selectedRivalIndex: null,
			schoolInfo: {},
			inviteModel: {},
			step: 1,
			availableAges: [],
			autocomplete: {
				'inter-schools': [],
				houses: [],
				internal: []
			},
			rivals: [],
			players: [[],[]],
			error: [],
			isEventManagerSync: false,
			isSync: false,
			isSavingChangesModePopupOpen: false,
			fartherThen: LocalEventHelper.distanceItems[0].id,
			eventFormOpponentSchoolKey: undefined,
			isShowAllSports: false
		});
	},
	componentWillMount: function () {
		const	self	= this,
				binding	= self.getDefaultBinding();

		this.setParamsFromUrl();

		this.setSchoolInfo()
			.then(() => {
				switch (this.mode) {
					case EventHelper.EVENT_CREATION_MODE.COPY:
						return this.setEvent(this.eventId);
					case EventHelper.EVENT_CREATION_MODE.ANOTHER:
						return this.setDateFromEventByEventId(this.eventId);
					default:
						return true;
				}
			})
			.then(() => {
				this.addListeners();

				binding.atomically()
					.set('isSync',				true)
					.set('isEventManagerSync',	true)
					.commit();
			});
	},
	/**
	 * Get event from server by eventId and set date from this event to event form.
	 * It needs for 'another' creation mode - when user create event by click "add another event" button.
	 */
	setDateFromEventByEventId:function (eventId) {
		return window.Server.schoolEvent.get({
			schoolId	: this.activeSchoolId,
			eventId		: eventId
		}).then(event => {
			this.getDefaultBinding().set('model.startTime', Immutable.fromJS(event.startTime));

			return true;
		});
	},
	setParamsFromUrl:function() {
		const rootBinding	= this.getMoreartyContext().getBinding();

		this.mode = rootBinding.get('routing.parameters.mode');
		if(typeof this.mode !== 'undefined') {
			this.eventId = rootBinding.get('routing.parameters.eventId');
		}
	},
	setEvent: function(eventId) {
		const binding = this.getDefaultBinding();

		// TODO check inter-schools case
		return window.Server.schoolEvent.get({
			schoolId	: this.activeSchoolId,
			eventId		: eventId
		}).then(event => {
			delete event.status;
			// It's a convertation event data to EventForm component format,
			// because event
			event.gender = this.convertServerGenderConstToClient(event);
			event.type = this.convertServerEventTypeConstToClient(event);

			// TODO need reviver for postcode on server side
			const postcodeId = propz.get(event, ['venue', 'postcodeData', '_id']);
			if(typeof postcodeId !== 'undefined') {
				event.venue.postcodeData.id = postcodeId;
			}

			const rivals = ManagerWrapperHelper.getRivals(this.activeSchoolId, event, true);
			if(TeamHelper.isNonTeamSport(event)) {
				rivals[0].players.forEach(p => {
					p.id = p.userId;
				});
				rivals[1].players.forEach(p => {
					p.id = p.userId;
				});
			}

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
	convertServerGenderConstToClient: function(event) {
		switch (event.gender) {
			case EventConsts.EVENT_GENDERS_SERVER.FEMALE_ONLY:
				return EventConsts.EVENT_GENDERS.FEMALE_ONLY;
			case EventConsts.EVENT_GENDERS_SERVER.MALE_ONLY:
				return EventConsts.EVENT_GENDERS.MALE_ONLY;
			case EventConsts.EVENT_GENDERS_SERVER.MIXED:
				return EventConsts.EVENT_GENDERS.MIXED;
		};
	},
	convertServerEventTypeConstToClient: function(event) {
		return EventHelper.serverEventTypeToClientEventTypeMapping[event.eventType];
	},
	setSchoolInfo: function() {
		const	self	= this,
				binding	= self.getDefaultBinding();

		self.activeSchoolId = MoreartyHelper.getActiveSchoolId(self);

		let schoolData;
		//get school data
		return window.Server.school.get(self.activeSchoolId)
			.then(_schoolData => {
				schoolData = _schoolData;

				// get forms data
				return window.Server.schoolForms.get(self.activeSchoolId, {filter:{limit:1000}});
			})
			.then(forms => {
				schoolData.forms = forms;

				// get avail ages
				const ages = TeamHelper.getAges(schoolData);

				binding
					.atomically()
					.set('schoolInfo',		Immutable.fromJS(schoolData))
					.set('rivals',			Immutable.fromJS([schoolData]))
					.set('availableAges',	Immutable.fromJS(ages))
					.commit();

				return true;
			});
	},
	componentWillUnmount: function () {
		const	self	= this,
				binding	= self.getDefaultBinding();

		this.listeners.forEach(l => binding.removeListener(l));
		binding.clear();
	},
	addListeners: function() {
		this.addListenerForTeamManager();
		if(this.mode === 'copy') {
			this.addListenersForEventManagerBase();
		}
	},
	addListenerForTeamManager: function() {
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
	addListenersForEventManagerBase: function() {
		const binding = this.getDefaultBinding();

		this.listeners.push(binding.sub('model.sportId').addListener(() => this.clearRivalsBinding()));
		this.listeners.push(binding.sub('model.gender').addListener(() => this.clearRivalsBinding()));
		this.listeners.push(binding.sub('model.ages').addListener(() => this.clearRivalsBinding()));
		this.listeners.push(binding.sub('model.type').addListener(() => this.clearRivalsBinding()));
	},
	clearRivalsBinding: function() {
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
	onSelectDate: function (newDate) {
		// TODO Why do we store date in ISO format?
		const	self = this,
				binding = self.getDefaultBinding();

		// just copy new date
		// because we don't want modify arg
		const	newDateCopy	= new Date(newDate.toISOString());

		// default start time values
		let		hours			= 10,
				minute			= 0;
		const	currStartDate	= binding.toJS('model.startTime');
		// get start time values(hours and minutes) from current start time if current start time isn't undefined
		if (
			typeof currStartDate !== 'undefined' &&
			currStartDate !== null
		) {
			const	time	= new Date(currStartDate);

			minute = time.getMinutes();
			hours = time.getHours();
		}

		// set hours and minutes
		newDateCopy.setHours(hours);
		newDateCopy.setMinutes(minute);

		binding.atomically()
			.set('model.startTime',				newDateCopy.toISOString())
			.set('model.startRegistrationTime',	newDateCopy.toISOString())
			.set('model.endRegistrationTime',	newDateCopy.toISOString())
			.commit();
	},
	toNext: function () {
		var self = this,
			binding = self.getDefaultBinding();

		binding.update('step', function (step) {
			return step + 1;
		});
	},
	toBack: function () {
		var self = this,
			binding = self.getDefaultBinding();

		binding.update('step', function (step) {
			return step - 1;
		});
	},
	_changeRivalFocusToErrorForm: function() {
		const self = this,
			binding    = self.getDefaultBinding(),
			eventType  = binding.toJS('model.type'),
			sportModel = binding.toJS('model.sportModel');

		let incorrectRivalIndex = null;

		// for inter-schools event we can edit only one team - our team:)
		if(eventType === 'inter-schools') {
			incorrectRivalIndex = 0;
		} else {
			let errors = self.getDefaultBinding().toJS('error');

			for (let errIndex in errors) {
				if (errors[errIndex].isError) {
					incorrectRivalIndex = errIndex;
					break;
				}
			}
		}

		self.getDefaultBinding()
			.atomically()
			.set('selectedRivalIndex', incorrectRivalIndex)
			.commit();
	},
	handleClickFinishButton: function () {
		const	self	= this,
				binding	= self.getDefaultBinding();

		// if true - then user click to finish button
		// so we shouldn't do anything
		if(self._isStepComplete(2) && !binding.get('isSubmitProcessing') && binding.get('isTeamManagerSync')) {
			const	event			= binding.toJS('model'),
					teamWrappers	= this.getTeamWrappers(),
					validationData	= [
						binding.toJS('error.0'),
						binding.toJS('error.1')
					];

			switch (true) {
				case (
						TeamHelper.isTeamDataCorrect(event, validationData) && TeamHelper.isTeamSport(event) &&
						!SavingPlayerChangesPopupHelper.isAnyTeamChanged(event, teamWrappers) && SavingPlayerChangesPopupHelper.isUserCreateNewTeam(event, teamWrappers)
				):
					this.showSavingChangesModePopup();
					break;
				case (
						TeamHelper.isTeamDataCorrect(event, validationData) && TeamHelper.isTeamSport(event) &&
						SavingPlayerChangesPopupHelper.isAnyTeamChanged(event, teamWrappers) && !SavingPlayerChangesPopupHelper.isUserCreateNewTeam(event, teamWrappers)
				):
					this.showSavingChangesModePopup();
					break;
				case (
						TeamHelper.isTeamDataCorrect(event, validationData) && TeamHelper.isTeamSport(event) &&
						SavingPlayerChangesPopupHelper.isAnyTeamChanged(event, teamWrappers) && SavingPlayerChangesPopupHelper.isUserCreateNewTeam(event, teamWrappers)
				):
					this.showSavingChangesModePopup();
					break;
				case (
						TeamHelper.isTeamDataCorrect(event, validationData) && TeamHelper.isTeamSport(event) &&
						!SavingPlayerChangesPopupHelper.isAnyTeamChanged(event, teamWrappers) && !SavingPlayerChangesPopupHelper.isUserCreateNewTeam(event, teamWrappers)
				):
					binding.set('isSubmitProcessing', true);
					this.submit(event);
					break;
				case TeamHelper.isTeamDataCorrect(event, validationData) && TeamHelper.isNonTeamSport(event):
					binding.set('isSubmitProcessing', true);
					this.submit(event);
					break;
				// If teams data isn't correct
				case !TeamHelper.isTeamDataCorrect(event, validationData):
					// So, let's show form with incorrect data
					self._changeRivalFocusToErrorForm();
					break;
			}
		}
	},
	getTeamWrappers: function() {
		return this.getDefaultBinding().toJS('teamModeView.teamWrapper');
	},
	//TODO WTF!!?? Why event in args?
	submit: function(eventModel) {
		const	self	= this,
				binding	= self.getDefaultBinding();

		let teams, savedEvent;

		switch (true) {
			case TeamHelper.isNonTeamSport(eventModel):
				return self.submitEvent()
					.then(_event => {
						savedEvent = _event;

						return TeamHelper.addIndividualPlayersToEvent(
							self.activeSchoolId,
							savedEvent,
							binding.toJS(`teamModeView.teamWrapper`)
						);
					})
					.then(() => self.activateEvent(savedEvent))
					.then(() => self._afterEventCreation(savedEvent));
			case TeamHelper.isTeamSport(eventModel):
				return Promise
					.all(
						SavingEventHelper.processSavingChangesMode(
							self.activeSchoolId,
							binding.toJS(`rivals`),
							binding.toJS('model'),
							binding.toJS(`teamModeView.teamWrapper`)
						)
					)
					.then(() => {
						return Promise.all(TeamHelper.createTeams(
							self.activeSchoolId,
							binding.toJS('model'),
							binding.toJS(`rivals`),
							binding.toJS(`teamModeView.teamWrapper`)
						));
					})
					.then(_teams => {
						teams = _teams;

						return self.submitEvent();
					})
					.then(_event => {
						savedEvent = _event;

						return TeamHelper.addTeamsToEvent(self.activeSchoolId, savedEvent, teams);
					})
					.then(() => self.activateEvent(savedEvent))
					.then(() => self._afterEventCreation(savedEvent));
		}
	},
	activateEvent: function(event) {
		const self = this;

		return window.Server.schoolEventActivate.post({
			schoolId:	self.activeSchoolId,
			eventId:	event.id
		});
	},
	submitEvent: function() {
		const	self	= this,
				binding = self.getDefaultBinding();

		const model = binding.toJS('model');

		const body = {
			gender:					TeamHelper.convertGenderToServerValue(model.gender),
			// invited
			// convert client event type const to server event type const
			eventType:				EventHelper.clientEventTypeToServerClientTypeMapping[model.type],
			ages:					model.ages,
			sportId:				model.sportId,
			startTime:				model.startTime,
			startRegistrationTime:	model.startRegistrationTime,
			endRegistrationTime:	model.endRegistrationTime
		};

		self.setVenueToBody(body);

		const rivals = binding.toJS('rivals');
		switch (model.type) {
			case 'inter-schools':
				const rivalIds = rivals.map(r => r.id);

				body.invitedSchoolIds = rivalIds.slice(1);
				body.finishSchoolIds = rivalIds;

				break;
			case 'houses':
				body.invitedSchoolIds = [self.activeSchoolId];

				body.houses = rivals.map(r => r.id);

				break;
			case 'internal':
				body.invitedSchoolIds = [self.activeSchoolId];

				break;
		}

		return window.Server.events.post(
			self.activeSchoolId,
			body
		);
	},
	setVenueToBody: function(body) {
		const	self	= this,
				binding	= self.getDefaultBinding();

		const modelVenue = binding.toJS('model.venue');
		body.venue = {
			venueType: modelVenue.venueType
		};
		if(modelVenue.postcodeData.id !== 'TBD') {
			body.venue.postcodeId = modelVenue.postcodeData.id;
		}
	},
	/**
	 * Actions that do after fully event creation
	 * 1) Clear binding
	 * 2) Redirect to event page
	 * @private
	 */
	_afterEventCreation: function(event) {
		const	self	= this,
				binding	= self.getDefaultBinding();

		document.location.hash = 'event/' + event.id + '?tab=gallery&new=true';
		binding.clear();
		binding.meta().clear();

		return true;
	},
	renderStepButtons: function() {
		const	self		= this,
				binding		= self.getDefaultBinding();

		const step = binding.get('step');

		switch (true) {
			case step === 1:
				const continueButtonClassName = classNames({
					mWidth		: true,
					mDisable	: !self._isStepComplete(1)
				});

				return (
					<div className="eManager_controlButtons">
						<Button	text				= "Continue"
								onClick				= {this.toNext}
								extraStyleClasses	= {continueButtonClassName}
						/>
					</div>
				);
			case step === 2:
				const finishButtonClassName = classNames({
					mFinish:	true
				});

				return (
					<div className="eTeamManagerWrapper_footer">
						<Button	text				= "Back"
								onClick				= {this.toBack}
								extraStyleClasses	= {"mCancel mMarginRight"}
						/>
						<Button	text				= "Finish"
								onClick				= {this.handleClickFinishButton}
								extraStyleClasses	= {finishButtonClassName}
						/>
					</div>
				);
		}
	},
	_isStepComplete: function(step) {
		const	self			= this,
				binding			= self.getDefaultBinding();
		let		isStepComplete	= false;

		const hasError = binding.toJS('error').findIndex(err => err.isError) !== -1;

		switch (step) {
			case 1:
				isStepComplete = self._isFirstStepIsComplete();
				break;
			case 2:
				if(
					binding.toJS('model.type') === 'inter-schools' && !hasError || 						// for any INTER-SCHOOLS events
					TeamHelper.isInternalEventForIndividualSport(binding.toJS('model')) && !hasError ||	// for INDIVIDUAL INTERNAL events
					!hasError// for any other type of event
				) {
					isStepComplete = true;
				};
				break;
		}

		return isStepComplete;
	},
	_isFirstStepIsComplete: function() {
		const	self			= this,
				binding			= self.getDefaultBinding();

		return (
				typeof binding.get('model.startTime')				!== 'undefined' &&
				binding.get('model.startTime') 						!== null &&
				binding.get('model.startTime') 						!== '' &&
				typeof binding.toJS('model.sportId')				!== 'undefined' &&
				binding.toJS('model.sportId')						!== '' &&
				typeof binding.toJS('model.gender')					!== 'undefined' &&
				binding.toJS('model.gender')						!== '' &&
				binding.toJS('model.gender')						!== 'not-selected-gender' &&
				typeof binding.toJS('model.ages')					!== 'undefined' &&
				binding.toJS('model.ages').length					!== 0 &&
				typeof binding.toJS('model.type')					!== 'undefined' &&
				binding.toJS('model.type')							!== '' &&
				typeof binding.toJS('model.venue.postcodeData')		!== 'undefined' &&
				typeof binding.toJS('model.venue.postcodeData.id')	!== 'undefined' &&
				self.isAllRivalsSelected()
		);
	},
	isAllRivalsSelected: function() {
		const	self			= this,
				binding			= self.getDefaultBinding();
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
	showSavingChangesModePopup: function() {
		this.getDefaultBinding().set('isSavingChangesModePopupOpen', true);
	},
	renderEventManagerBase: function() {
		const	binding				= this.getDefaultBinding(),
				isEventManagerSync	= binding.get('isEventManagerSync');

		const	commonBinding	= {
				default				: binding,
				sports				: this.getBinding('sports'),
				calendar			: this.getBinding('calendar')
			};

		if(isEventManagerSync && this.getBinding('sports').toJS().sync) {
			return (
				<EventForm	binding		= {commonBinding}
							isCopyMode	= {this.isCopyMode}
				/>
			);
		} else {
			return (
				<Loader condition={true}/>
			);
		}
	},
	render: function() {
		const	binding				= this.getDefaultBinding(),
				isEventManagerSync	= binding.get('isEventManagerSync'),
				step				= binding.get('step');

		const	bManagerClasses	= classNames({
					bManager			: step === 1,
					bTeamManagerWrapper : step === 2
				});

		const	managerBinding	= {
					default				: binding,
					selectedRivalIndex	: binding.sub('selectedRivalIndex'),
					rivals				: binding.sub('rivals'),
					players				: binding.sub('players'),
					error				: binding.sub('error')
				};

		return (
			<div>
				<div className={bManagerClasses}>
					<If condition={step === 1}>
						{this.renderEventManagerBase()}
					</If>
					<If condition={step === 2}>
						<Manager	isInviteMode	= {false}
									binding			= {managerBinding}
						/>
					</If>
					<If condition={isEventManagerSync}>
						{this.renderStepButtons()}
					</If>
				</div>
				<SavingPlayerChangesPopup	binding	= {binding}
											submit	= {() => this.submit(binding.toJS('model'))}
				/>
			</div>
		);
	}
});

module.exports = EventManager;