const   Calendar			= require('module/as_manager/pages/events/calendar/calendar'),
		CalendarActions		= require('module/as_manager/pages/events/calendar/calendar-actions'),
		EventManagerBase	= require('./manager/base'),
		If					= require('module/ui/if/if'),
		TimePickerWrapper	= require('./time_picker_wrapper'),
		Manager				= require('module/ui/managers/manager'),
		classNames			= require('classnames'),
		React				= require('react'),
		MoreartyHelper		= require('module/helpers/morearty_helper'),
		TeamHelper			= require('./../../../ui/managers/helpers/team_helper'),
		SavingEventHelper	= require('./../../../helpers/saving_event_helper'),
		EventHelper			= require('module/helpers/eventHelper'),
		Loader				= require('./../../../ui/loader'),
		Morearty			= require('morearty'),
		Promise 			= require('bluebird'),
		Immutable			= require('immutable'),
		ConfirmPopup		= require('./../../../ui/confirm_popup'),
		TeamSaveModePanel	= require('./../../../ui/managers/saving_player_changes_mode_panel/saving_player_changes_mode_panel'),
		ManagerConsts		= require('./../../../ui/managers/helpers/manager_consts');

const EventManager = React.createClass({
	mixins: [Morearty.Mixin],
	getMergeStrategy: function () {
		return Morearty.MergeStrategy.MERGE_REPLACE;
	},
	getDefaultState: function () {
		var self = this,
			rootBinding = self.getMoreartyContext().getBinding(),
			activeSchoolId = rootBinding.get('userRules.activeSchoolId');

		return Immutable.fromJS({
			// if true - then user click to finish button
			// so we must block finish button
			isSubmitProcessing: false,
			model: {
				name: '',
				startTime: null,
				type: undefined,
				sportId: undefined,
				gender: undefined,
				ages: [],
				description: ''
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
			rivals: [{id: activeSchoolId}],
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
					.set('availableAges',	Immutable.fromJS(ages))
					.set('isSync',			Immutable.fromJS(true))
					.commit();
			});
	},
	componentWillUnmount: function () {
		const	self	= this,
				binding	= self.getDefaultBinding();

		binding.clear();
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
			const	event		= binding.toJS('model'),
				validationData	= [
					binding.toJS('error.0'),
					binding.toJS('error.1')
				];

			switch (true) {
				case TeamHelper.isTeamDataCorrect(event, validationData) && TeamHelper.isTeamSport(event) && !this.isAnyTeamChanged() && this.isUserCreateNewTeam():
					this.showSavingChangesModePopup(event);
					break;
				case TeamHelper.isTeamDataCorrect(event, validationData) && TeamHelper.isTeamSport(event) && this.isAnyTeamChanged() && !this.isUserCreateNewTeam():
					this.showSavingChangesModePopup(event);
					break;
				case TeamHelper.isTeamDataCorrect(event, validationData) && TeamHelper.isTeamSport(event) && !this.isAnyTeamChanged() && !this.isUserCreateNewTeam():
					binding.set('isSubmitProcessing', true);
					this.submit(event);
					break;
				case TeamHelper.isTeamDataCorrect(event, validationData) && TeamHelper.isNonTeamSport(event):
					binding.set('isSubmitProcessing', true);
					this.submit(event);
					break;
				// If teams data isn't correct
				default:
					// So, let's show form with incorrect data
					self._changeRivalFocusToErrorForm();
					break;
			}
		}
	},
	isUserCreateNewTeam: function() {
		return (
			this.isUserCreateNewTeamByOrder(0) ||
			this.isUserCreateNewTeamByOrder(1)
		);
	},
	isUserCreateNewTeamByOrder: function(order) {
		return (
			typeof this.getDefaultBinding().toJS(`teamModeView.teamWrapper.${order}.selectedTeamId`) === 'undefined' &&
			!this.getDefaultBinding().toJS(`teamModeView.teamWrapper.${order}.isSetTeamLater`)
		);
	},
	/**
	 * Method return true, if players in any team was changed relatively prototype team
	 * @returns {any|*}
	 */
	isAnyTeamChanged: function() {

		return (
			this.isTeamChangedByOrder(0) ||
			this.isTeamChangedByOrder(1)
		);
	},
	isTeamChangedByOrder: function(order) {

		return this.getDefaultBinding().toJS(`teamModeView.teamWrapper.${order}.isTeamChanged`);
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
			name:					model.name,
			description:			model.description,
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
			venueType: self.convertVenueTypeToServerValue(modelVenue.venueType)
		};
		modelVenue.postcode && (body.venue.postcodeId = modelVenue.postcode);
	},
	convertVenueTypeToServerValue: function(venueType) {
		const map = {
			'tbd':		"TBD",
			'away':		"AWAY",
			'custom':	"CUSTOM",
			'home':		"HOME"
		};

		return map[venueType];
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

		document.location.hash = 'event/' + event.id + '?tab=gallery';
		binding.clear();
		binding.meta().clear();

		return true;
	},
	_renderStepButtons: function() {
		const	self		= this,
				binding		= self.getDefaultBinding();

		const step = binding.get('step');

		return (
			<div className="eEvents_buttons">
				{ self._renderBackStepButton(step) }
				{ self._renderNextStepButton(step) }
				{ self._renderFinishStepButton(step) }
			</div>
		);
	},
	_renderNextStepButton: function(step) {
		const self = this;

		if(
			step === 1 && self._isStepComplete(1) ||
			step === 2 && self._isStepComplete(2)
		) {
			return <span className="eEvents_next eEvents_button" onClick={self.toNext}>Next</span>;
		} else {
			return null;
		}
	},
	_renderBackStepButton: function(step) {
		const self = this;

		if(
			step === 2 ||
			step === 3
		) {
			return (
				<span className="eEvents_back eEvents_button" onClick={self.toBack}>Back</span>
			);
		} else {
			return null;
		}
	},
	_renderFinishStepButton: function(step) {
		const self = this;

		if(step === 3 && self._isStepComplete(3)) {
			const finishButtonClassName = classNames({
				eEvents_button:	true,
				mFinish:		true,
				mDisabled:		this.getDefaultBinding().toJS('isSubmitProcessing')
			});

			return (
				<span	className	= { finishButtonClassName }
						onClick		= { self.handleClickFinishButton }
				>
					Finish
				</span>
			);
		} else {
			return null;
		}
	},
	_isStepComplete: function(step) {
		const	self			= this,
				binding			= self.getDefaultBinding();
		let		isStepComplete	= false;

		switch (step) {
			case 1:
				if(binding.get('model.startTime') !== undefined && binding.get('model.startTime') !== null) {
					isStepComplete = true;
				}
				break;
			case 2:
				isStepComplete = self._isSecondStepIsComplete();
				break;
			case 3:
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
	_isSecondStepIsComplete: function() {
		const	self			= this,
				binding			= self.getDefaultBinding();

		return (
				typeof binding.toJS('model.name')		!== 'undefined' &&
				binding.toJS('model.name')				!== '' &&
				typeof binding.toJS('model.sportId')	!== 'undefined' &&
				binding.toJS('model.sportId')			!== '' &&
				typeof binding.toJS('model.gender')		!== 'undefined' &&
				binding.toJS('model.gender')			!== '' &&
				binding.toJS('model.gender')			!== 'not-selected-gender' &&
				typeof binding.toJS('model.ages')		!== 'undefined' &&
				binding.toJS('model.ages').length		!== 0 &&
				typeof binding.toJS('model.type')		!== 'undefined' &&
				binding.toJS('model.type')				!== '' &&
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
	closeSavingChangesModePopup: function() {
		this.getDefaultBinding().atomically()
			.set('isSavingChangesModePopupOpen',					false)
			.set('teamModeView.teamWrapper.0.savingChangesMode',	Immutable.fromJS(ManagerConsts.SAVING_CHANGES_MODE.DOESNT_SAVE_CHANGES))
			.set('teamModeView.teamWrapper.1.savingChangesMode',	Immutable.fromJS(ManagerConsts.SAVING_CHANGES_MODE.DOESNT_SAVE_CHANGES))
			.commit();
	},
	showSavingChangesModePopup: function() {
		this.getDefaultBinding().set('isSavingChangesModePopupOpen', true);
	},
	handleClickSavingPlayerChangesModeRadioButton: function(teamWrapperIndex, currentMode) {
		// it's important!!
		// because TeamSaveModePanel use this.props.handleClick.bind(null, ManagerConsts.SAVING_CHANGES_MODE.SAVE_CHANGES_TO_NEW_PROTOTYPE_TEAM)
		// we must save context
		// hmmm, or not.
		const self = this;

		self.getDefaultBinding().set(
			`teamModeView.teamWrapper.${teamWrapperIndex}.savingChangesMode`,
			Immutable.fromJS(currentMode)
		);
	},
	handleChangeTeamName: function(teamWrapperIndex, name) {
		const self = this;

		self.getDefaultBinding().set(
			`teamModeView.teamWrapper.${teamWrapperIndex}.teamName.name`,
			Immutable.fromJS(name)
		);
	},
	renderSavingPlayerChangesPopupBody: function(event) {
		const savingPlayerChangesModePanels = [];

		const teamWrappers = this.getDefaultBinding().toJS('teamModeView.teamWrapper');

		switch (true) {
			case EventHelper.isInterSchoolsEvent(event):
				savingPlayerChangesModePanels.push(
					<TeamSaveModePanel	key						= { `team-wrapper-0` }
										originalTeamName		= { this.getOriginalTeamName(teamWrappers, 0) }
										teamName				= { teamWrappers[0].teamName.name }
										savingChangesMode		= { teamWrappers[0].savingChangesMode }
										viewMode				= { this.getViewMode(0) }
										handleChange			= { this.handleClickSavingPlayerChangesModeRadioButton.bind(null, 0) }
										handleChangeTeamName	= { this.handleChangeTeamName.bind(null, 0) }
					/>
				);
				break;
			// for other event types check all teams
			default :
				teamWrappers.forEach((tw, index) => {
					if(this.isTeamChangedByOrder(index) || this.isUserCreateNewTeamByOrder(index)) {
						savingPlayerChangesModePanels.push(
							<TeamSaveModePanel	key						= { `team-wrapper-${index}` }
												originalTeamName		= { this.getOriginalTeamName(teamWrappers, index) }
												teamName				= { teamWrappers[index].teamName.name }
												savingChangesMode		= { teamWrappers[index].savingChangesMode }
												viewMode				= { this.getViewMode(index) }
												handleChange			= { this.handleClickSavingPlayerChangesModeRadioButton.bind(null, index) }
												handleChangeTeamName	= { this.handleChangeTeamName.bind(null, index) }
							/>
						);
					}
				});
				break;
		}

		return (
			<div className="bSavingChangesBlock">
				<div className="eSavingChangesBlock_text">
					Team have been changed. Please select one of the following options:
				</div>
				{ savingPlayerChangesModePanels }
			</div>
		);
	},
	getOriginalTeamName: function(teamWrappers, order) {
		switch (true) {
			case this.isUserCreateNewTeam(order):
				return teamWrappers[order].teamName.name;
			case this.isTeamChangedByOrder(order):
				return teamWrappers[order].prevTeamName;
		}
	},
	getViewMode: function(order) {
		switch (true) {
			case this.isUserCreateNewTeam(order):
				return ManagerConsts.VIEW_MODE.NEW_TEAM_VIEW;
			case this.isTeamChangedByOrder(order):
				return ManagerConsts.VIEW_MODE.OLD_TEAM_VIEW;
		}
	},
	renderSavingPlayerChangesPopup: function(event) {
		const binding = this.getDefaultBinding();

		const isSavingChangesModePopupOpen = !!binding.toJS('isSavingChangesModePopupOpen');

		if(isSavingChangesModePopupOpen) {
			return (
				<ConfirmPopup	okButtonText			= "Create event"
								cancelButtonText		= "Back"
								isOkButtonDisabled		= { binding.toJS('isSubmitProcessing') }
								handleClickOkButton		= {
									() => {
										binding.set('isSubmitProcessing', true);
										this.submit(event);
									}
								}
								handleClickCancelButton	= { this.closeSavingChangesModePopup }
				>
					{ this.renderSavingPlayerChangesPopupBody(event) }
				</ConfirmPopup>
			);
		} else {
			return null;
		}
	},
	render: function() {
		var self = this,
			binding = self.getDefaultBinding(),
			rootBinding = self.getMoreartyContext().getBinding(),
			step = binding.get('step'),
			titles = [
				'Choose Date',
				'Fixture Details',
				'Select from created teams'
			],
			bManagerClasses = classNames({
				bManager: true,
				mDate: step === 1,
				mBase: step === 2,
				mTeamManager: step === 3
			}),
			commonBinding = {
				default: binding,
				sports: self.getBinding('sports'),
				calendar: self.getBinding('calendar')
			},
			managerBinding = {
				default:            binding,
				selectedRivalIndex: binding.sub('selectedRivalIndex'),
				rivals:             binding.sub('rivals'),
				players:            binding.sub('players'),
				error:              binding.sub('error')
			};

		return (
			<div>
				<div className="eManager_steps" >
					<div className="eManager_step" >{step} </div>
					<h3>{titles[step - 1]}</h3></div>
				<div className={bManagerClasses}>
					<If condition={step === 1}>
						<div className="eManager_dateTimePicker">
							<Calendar
								binding={rootBinding.sub('events.calendar')}
								onSelect={self.onSelectDate}
							/>
							<TimePickerWrapper binding={binding.sub('model.startTime')}/>
						</div>
					</If>
					<If condition={step === 2}>
						<EventManagerBase binding={commonBinding} />
					</If>
					<If condition={step === 3}>
						<Manager isInviteMode={false} binding={managerBinding} />
					</If>
				</div>
				{ self._renderStepButtons() }
				{ this.renderSavingPlayerChangesPopup(binding.toJS('model')) }
			</div>
		);
	}
});

module.exports = EventManager;