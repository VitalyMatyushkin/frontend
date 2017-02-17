const	EventManagerBase				= require('./manager/base'),
		If								= require('module/ui/if/if'),
		Manager							= require('module/ui/managers/manager'),
		classNames						= require('classnames'),
		React							= require('react'),
		MoreartyHelper					= require('module/helpers/morearty_helper'),
		TeamHelper						= require('../../../ui/managers/helpers/team_helper'),
		SavingEventHelper				= require('../../../helpers/saving_event_helper'),
		EventHelper						= require('module/helpers/eventHelper'),
		Morearty						= require('morearty'),
		Promise 						= require('bluebird'),
		Immutable						= require('immutable'),
		SavingPlayerChangesPopup		= require('./saving_player_changes_popup/saving_player_changes_popup'),
		SavingPlayerChangesPopupHelper	= require('./saving_player_changes_popup/helper'),
		ManagerHelper					= require('../../../ui/managers/helpers/manager_helper'),
		Button							= require('../../../ui/button/button'),
		ManagerStyles					= require('../../../../../styles/pages/events/b_events_manager.scss');

const EventManager = React.createClass({
	mixins: [Morearty.Mixin],
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
			error: [
				{
					isError: false,
					text:    ''
				},
				{
					isError: false,
					text:    ''
				}
			],
			isSync: false,
			isSavingChangesModePopupOpen: false
		});
	},
	componentWillMount: function () {
		const	self	= this,
				binding	= self.getDefaultBinding();

		self.activeSchoolId = MoreartyHelper.getActiveSchoolId(self);

		let schoolData;

		//get school data
		window.Server.school.get(self.activeSchoolId)
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
					.set('isSync',			Immutable.fromJS(true))
					.commit();

				this.addListeners();
			});
	},
	componentWillUnmount: function () {
		const	self	= this,
				binding	= self.getDefaultBinding();

		binding.clear();
	},
	addListeners: function() {
		this.addListenerForTeamManager();
	},
	addListenerForTeamManager: function() {
		const binding = this.getDefaultBinding();

		binding
			.sub('isSync')
			.addListener(eventDescriptor => {
				// Lock submit button if team manager in searching state.
				eventDescriptor.getCurrentValue() && binding.set('isTeamManagerSync', true);

				// Unlock submit button if team manager in searching state.
				!eventDescriptor.getCurrentValue() && binding.set('isTeamManagerSync', false);
			});
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
		if(!binding.toJS('isSubmitProcessing')) {
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
				body.invitedSchoolIds = [rivals[1].id];
				body.finishSchoolIds = 	[rivals[0].id, rivals[1].id];

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
	_renderStepButtons: function() {
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
					mFinish:	true,
					mDisable:	!self._isStepComplete(2) || binding.get('isSubmitProcessing') || !binding.get('isTeamManagerSync')
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

		switch (step) {
			case 1:
				isStepComplete = self._isFirstStepIsComplete();
				break;
			case 2:
				if(
					binding.toJS('model.type') === 'inter-schools' && !binding.toJS('error.0').isError || 						// for any INTER-SCHOOLS events
					TeamHelper.isInternalEventForIndividualSport(binding.toJS('model')) && !binding.toJS('error.0').isError ||	// for INDIVIDUAL INTERNAL events
					!binding.toJS('error.0').isError && !binding.toJS('error.1').isError										// for any other type of event
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
				if(binding.toJS('rivals').length === 2) {
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
	render: function() {
		const	self			= this,
				binding			= self.getDefaultBinding(),
				step			= binding.get('step');

		const	bManagerClasses	= classNames({
					bManager			: step === 1,
					bTeamManagerWrapper : step === 2
				});

		const	commonBinding	= {
					default				: binding,
					sports				: self.getBinding('sports'),
					calendar			: self.getBinding('calendar')
				},
				managerBinding	= {
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
						<EventManagerBase binding={commonBinding} />
					</If>
					<If condition={step === 2}>
						<Manager isInviteMode={false} binding={managerBinding} />
					</If>
					{self._renderStepButtons()}
				</div>
				<SavingPlayerChangesPopup	binding	= {binding}
											submit	= {() => this.submit(binding.toJS('model'))}
				/>
			</div>
		);
	}
});

module.exports = EventManager;