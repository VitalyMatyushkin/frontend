const   CalendarView        = require('module/ui/calendar/calendar'),
        EventManagerBase    = require('./manager/base'),
        If                  = require('module/ui/if/if'),
        TimePicker          = require('module/ui/timepicker/timepicker'),
        Manager             = require('module/ui/managers/manager'),
        classNames          = require('classnames'),
        React               = require('react'),
        Async               = require('async'),
        Immutable           = require('immutable');

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
		var self = this,
            rootBinding = self.getMoreartyContext().getBinding(),
            activeSchoolId = rootBinding.get('userRules.activeSchoolId'),
			binding = self.getDefaultBinding();

        window.Server.school.get(activeSchoolId, {
            filter: {
                where: {
                    id: activeSchoolId
                },
                include: 'forms'
            }
        }).then(function (res) {
            res.forms = res.forms || [];
            var ages = res.forms.reduce(function (memo, form) {
                if (memo.indexOf(form.age) === -1) {
                    memo.push(form.age);
                }

                return memo;
            }, []);

            binding
                .atomically()
                .set('schoolInfo', Immutable.fromJS(res))
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

        self._eventSubmit().then((event) => {
            self.getMoreartyContext().getBinding().update('events.models', function (events) {
                return events.push(Immutable.fromJS(event));
            });
            self._submitRivals(event);
            return event;
        });
    },
    _eventSubmit: function() {
        var self = this;

        return window.Server.events.post(
            self.getDefaultBinding().toJS('model')
        );
    },
    _submitRivals: function(event) {
        const self = this,
            binding = self.getDefaultBinding(),
            rivals = binding.toJS('rivals');

        let tasks = [];
        rivals.forEach((rival, rivalIndex) => {
            tasks.push((callback) => {
                self._submitRival(event, rival, rivalIndex, callback);
            });
        });
        Async.series(tasks, () => {
            document.location.hash = 'event/' + event.id;
            binding.clear();
            binding.meta().clear();
        });
    },
    _submitRival: function(event, rival, rivalIndex, callback) {
        const self = this,
            binding = self.getDefaultBinding(),
            activeSchoolId = binding.get('schoolInfo.id'),
            model = binding.toJS('model');

        if (model.type === 'inter-schools' && rival.id !== activeSchoolId) {
            self._submitInvite(event, rival);
        }
        let mode = binding.toJS(`mode.${rivalIndex}`);
        switch (mode) {
            case 'temp':
                self._submitTempTeam(event, rival, rivalIndex, callback);
                break;
            case 'teams':
                self._submitTeam(event, rivalIndex, callback);
                break;
        }
    },
    _submitTeam: function(event, rivalIndex, callback) {
        const self = this,
            binding = self.getDefaultBinding(),
            teamId = binding.toJS(`teamModeView.teamViewer.${rivalIndex}.selectedTeamId`);

        window.Server.relParticipants.put(
            {
                eventId: event.id,
                teamId: teamId
            },
            {
                eventId: event.id,
                teamId: teamId
            }
        ).then((res) => {
            callback();
            return res;
        });
    },
    _submitTempTeam: function(event, rival, rivalIndex, callback) {
        const self = this,
            binding = self.getDefaultBinding(),
            activeSchoolId = binding.get('schoolInfo.id'),
            players = binding.toJS('players');

        let rivalModel = {
            sportId:  event.sportId,
            schoolId: activeSchoolId
        };

        switch (event.type) {
            case 'internal':
                rivalModel.name = rival.name;
                break;
            case 'houses':
                rivalModel.houseId = rival.id;
                break;
        }

        rivalModel.ages = binding.toJS('model.ages');
        rivalModel.gender = binding.toJS('model.gender');

        window.Server.participants.post(event.id, rivalModel).then(function (team) {
            let tasks = [];
            players[rivalIndex].forEach(function (player) {
                tasks.push((playerCallback) => {
                    self._submitPlayer(team, player, playerCallback);
                });
            });

            Async.series(tasks, () => {
                callback();
            });

            return team;
        });
    },
    _submitPlayer: function(team, player, callback) {
        window.Server.playersRelation.put(
            {
                teamId:    team.id,
                studentId: player.id
            },
            {
                position:  player.position,
                sub:       player.sub ? player.sub : false
            }
        ).then(function (_player) {
            callback();
            return _player;
        });
    },
    _submitInvite: function(event, rival) {
        const self = this;

        window.Server.invitesByEvent.post({eventId: event.id}, {
            eventId:   event.id,
            inviterId: self.getDefaultBinding().get('schoolInfo.id'),
            guestId:   rival.id,
            message:   'message'
        });
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
            isError = binding.toJS('error.0').isError || binding.toJS('error.1').isError;
        }

        return !isError;
    },
	render: function() {
		var self = this,
			binding = self.getDefaultBinding(),
            rootBinding = self.getMoreartyContext().getBinding(),
            step = binding.get('step'),
            titles = [
                'Choose Date',
                'Fixture Details',
				'Squad Members'
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

		return <div>
           	<h3>{'[' + step + '/' + titles.length + ']: ' + titles[step - 1]}</h3>
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
                    <Manager binding={managerBinding} />
                </If>
            </div>
			<div className="eEvents_buttons">
				{step > 1 ? <span className="eEvents_back eEvents_button" onClick={self.toBack}>Back</span> : null}
				{step < titles.length ? <span className="eEvents_next eEvents_button" onClick={self.toNext}>Next</span> : null}
				{step === titles.length ? <span className="eEvents_button mFinish" onClick={self.toFinish}>Finish</span> : null}
			</div>
		</div>;
	}
});

module.exports = EventManager;