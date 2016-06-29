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
                sportId: null,
                gender: null,
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

        if(self._isEventDataCorrect()) {
            self._submit();
        } else {
            //So, let's show form with incorrect data
            self._changeRivalFocusToErrorForm();
        }
	},
    _submit: function() {
        const self = this;

        self._eventSubmit()
            .then((event) => {
                self.getMoreartyContext().getBinding().update('events.models', function (events) {
                    return events.push(Immutable.fromJS(event));
                });

                self._submitRivals(event);

                return event;
            });
    },
    _eventSubmit: function() {
        const	self	= this,
				binding = self.getDefaultBinding(),
				model	= binding.toJS('model');


		const body = {
			name:					model.name,
			description:			model.description,
			gender:					model.gender,
			// convert client event type const to server event type const
			eventType:				EventHelper.clientEventTypeToServerClientTypeMapping[model.type],
			ages:					model.ages,
			sportId:				model.sportId,
			startTime:				model.startTime,
			startRegistrationTime:	model.startRegistrationTime,
			endRegistrationTime:	model.endRegistrationTime
		};

		switch (model.type) {
			case 'inter-schools':
				body.invitedSchoolId = binding.toJS('rivals.1.id');

				break;
			case 'houses':
				body.invitedSchoolId = self.activeSchoolId;

				body.houses = [
					binding.toJS('rivals.0.id'),
					binding.toJS('rivals.1.id')
				];

				break;
			case 'internal':
				body.invitedSchoolId = self.activeSchoolId;

				break;
		}

        return window.Server.events.post(
			self.activeSchoolId,
            body
        );
    },
    _submitRivals: function(event) {
        const self = this,
            binding = self.getDefaultBinding(),
            rivals = binding.toJS('rivals');

        let rivalPromises = [];
        rivals.forEach((rival, rivalIndex) => {
            rivalPromises.push(
                self._submitRival(event, rival, rivalIndex)
            );
        });

        Promise.all(rivalPromises).then(() => self._afterEventCreation(event));
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
	},
	_isEventDataCorrect: function() {
        const self = this,
            binding    = self.getDefaultBinding(),
            eventType  = binding.toJS('model.type');

        let isError = false;

        // for inter-schools event we can edit only one team - our team:)
        if(eventType === 'inter-schools') {
            isError = binding.toJS('error.0').isError;
        } else {
            isError = !(!binding.toJS('error.0').isError && !binding.toJS('error.1').isError);
        }

        return !isError;
    },
	_renderStepButtons: function() {
		const	self		= this,
				binding		= self.getDefaultBinding(),
				step		= binding.get('step');
		let		stepButtons = [];

		switch (step) {
			case 1:
				if(self._isStepComplete(1)) {
					stepButtons.push(
						<span className="eEvents_next eEvents_button" onClick={self.toNext}>Next</span>
					);
				}
				break;
			case 2:
				stepButtons.push(
					<span className="eEvents_back eEvents_button" onClick={self.toBack}>Back</span>
				);
				if(self._isStepComplete(2)) {
					stepButtons.push(
						<span className="eEvents_next eEvents_button" onClick={self.toNext}>Next</span>
					);
				}
				break;
			case 3:
				stepButtons.push(
					<span className="eEvents_back eEvents_button" onClick={self.toBack}>Back</span>
				);
				if(self._isStepComplete(3)) {
					stepButtons.push(
						<span className="eEvents_button mFinish" onClick={self.toFinish}>Finish</span>
					);
				}
				break;
		}

		return (
			<div className="eEvents_buttons">
				{stepButtons}
			</div>
		);
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
					binding.toJS('model.type') === 'inter-schools' && !binding.toJS('error.0.isError') || // for inter-schools
					!binding.toJS('error.0.isError') && !binding.toJS('error.1.isError') // for other type of event
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
								onSelect={self.onSelectDate} />
							{binding.get('model.startTime') ? <TimePicker binding={binding.sub('model.startTime')} /> : null}
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