const   CalendarView        = require('module/ui/calendar/calendar'),
		EventManagerBase    = require('./manager/base'),
		If                  = require('module/ui/if/if'),
		TimePicker          = require('module/ui/timepicker/timepicker'),
		Manager             = require('module/ui/managers/manager'),
		classNames          = require('classnames'),
		React               = require('react'),
		TeamSubmitMixin     = require('module/ui/managers/helpers/team_submit_mixin'),
		MoreartyHelper		= require('module/helpers/morearty_helper'),
		TeamHelper			= require('module/ui/managers/helpers/team_helper'),
		EventHelper			= require('module/helpers/eventHelper'),
		Morearty			= require('morearty'),
		Immutable           = require('immutable');

const EventManager = React.createClass({
	mixins: [Morearty.Mixin, TeamSubmitMixin],
	getMergeStrategy: function () {
		return Morearty.MergeStrategy.MERGE_REPLACE;
	},
	getDefaultState: function () {
		var self = this,
			rootBinding = self.getMoreartyContext().getBinding(),
			activeSchoolId = rootBinding.get('userRules.activeSchoolId');

		return Immutable.fromJS({
			model: {
				name: '',
				startTime: null,
				type: null,
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
			]
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
					.set('schoolInfo', Immutable.fromJS(schoolData))
					.set('availableAges', Immutable.fromJS(ages))
					.commit();
			});
	},
	componentWillUnmount: function () {
		const	self	= this,
				binding	= self.getDefaultBinding();

		binding.clear();
	},
	onSelectDate: function (date) {
		var self = this,
			binding = self.getDefaultBinding(),
			time, minute = 0, hours = 10,
			_date = new Date(date.toISOString());

		if (binding.get('model.startTime')) {
			time = new Date(binding.get('model.startTime'));
			minute = time.getMinutes();
			hours = time.getHours();
		}

		_date.setMinutes(minute);
		_date.setHours(hours);

		binding.set('model.startTime', _date.toISOString());
		binding.set('model.startRegistrationTime', _date.toISOString());
		binding.set('model.endRegistrationTime', _date.toISOString());
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
	toFinish: function () {
		var self = this,
			binding = self.getDefaultBinding(),
			model = binding.toJS('model');
		
		// TODO validation
		if(self.isEventDataCorrect()) {
			self.submit(model);
		} else {
		    //So, let's show form with incorrect data
		    self._changeRivalFocusToErrorForm();
		}
	},
	submit: function(eventModel) {
		const self = this;

		let teams, savedEvent;

		switch (TeamHelper.getParticipantsType(eventModel)) {
			case "INDIVIDUAL":
				return self.submitEvent()
						.then(_event => {
							savedEvent = _event;

							return self.addIndividualPlayersToEvent(savedEvent);
						})
						.then(() => self.activateEvent(savedEvent))
						.then(() => self._afterEventCreation(savedEvent));
			case "TEAM":
				return Promise.all(self.createTeams())
					.then(_teams => {
						teams = _teams;

						return self.submitEvent();
					})
					.then(_event => {
						savedEvent = _event;

						return self.addTeamsToEvent(savedEvent, teams);
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
	addTeamsToEvent: function(event, teams) {
		const self = this;

		return Promise.all(teams.map(t => window.Server.schoolEventTeams.post(
			{
				schoolId:	self.activeSchoolId,
				eventId:	event.id
			}, {
				teamId:		t.id
			}
		)));
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
			'neutral':	"CUSTOM",
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

		document.location.hash = 'event/' + event.id + '?tab=teams';
		binding.clear();
		binding.meta().clear();

		return true;
	},
	isEventDataCorrect: function() {
		const	self	= this,
				binding	= self.getDefaultBinding();

		const event = binding.toJS('model');

		let isError = false;

		// for inter-schools event we can edit only one team - our team:)
		if(event.type === 'inter-schools' || EventHelper.isEventWithOneIndividualTeam(event)) {
			isError = binding.toJS('error.0').isError;
		} else {
			isError = !(!binding.toJS('error.0').isError && !binding.toJS('error.1').isError);
		}

		return !isError;
	},
	_renderStepButtons: function() {
		const	self		= this,
				binding		= self.getDefaultBinding();

		const step = binding.get('step');

		return (
			<div className="eEvents_buttons">
				{self._renderBackStepButton(step)}
				{self._renderNextStepButton(step)}
				{self._renderFinishStepButton(step)}
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
			return (
				<span className="eEvents_button mFinish" onClick={self.toFinish}>Finish</span>
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
					binding.toJS('model.type') === 'inter-schools' && !binding.toJS('error.0').isError || 			// for any inter-schools events
					EventHelper.isEventWithOneIndividualTeam(binding.toJS('model')) && !binding.toJS('error.0').isError ||	// for INDIVIDUAL houses and individual internal
					!binding.toJS('error.0').isError && !binding.toJS('error.1').isError							// for any other type of event
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
							<CalendarView
								binding={rootBinding.sub('events.calendar')}
								onSelect={self.onSelectDate}
							/>
							{
								binding.get('model.startTime') ?
									<TimePicker binding={binding.sub('model.startTime')}/>:
									null
							}
						</div>
					</If>
					<If condition={step === 2}>
						<EventManagerBase binding={commonBinding} />
					</If>
					<If condition={step === 3}>
						<Manager isInviteMode={false} binding={managerBinding} />
					</If>
				</div>
				{self._renderStepButtons()}
			</div>
		);
	}
});

module.exports = EventManager;