const   CalendarView        = require('module/ui/calendar/calendar'),
        EventManagerBase    = require('./manager/base'),
        If                  = require('module/ui/if/if'),
        TimePicker          = require('module/ui/timepicker/timepicker'),
        Manager             = require('module/ui/managers/manager'),
        classNames          = require('classnames'),
        React               = require('react'),
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

        self.getDefaultBinding().set('selectedRivalIndex', incorrectRivalIndex);
    },
	toFinish: function () {
		var self = this,
			binding = self.getDefaultBinding(),
            rootBinding = self.getMoreartyContext().getBinding(),
            activeSchoolId = binding.get('schoolInfo.id'),
            model = binding.toJS('model'),
            players = binding.toJS('players'),
			rivals = binding.toJS('rivals');

        if(self._isEventDataCorrect()) {
            window.Server.events.post(model).then(function (event) {
                rootBinding.update('events.models', function (events) {
                    return events.push(Immutable.fromJS(event));
                });
                rivals.forEach(function (rival, index) {
                    if (model.type === 'inter-schools' && rival.id !== activeSchoolId) {
                        window.Server.invitesByEvent.post({eventId: event.id}, {
                            eventId:   event.id,
                            inviterId: activeSchoolId,
                            guestId:   rival.id,
                            message:   'message'
                        });
                    } else {
                        var rivalModel = {
                            sportId:  event.sportId,
                            schoolId: activeSchoolId
                        };

                        if (event.type === 'internal') {
                            rivalModel.name = rival.name;
                        }

                        if (event.type === 'houses') {
                            rivalModel.houseId = rival.id;
                        }

                        window.Server.participants.post(event.id, rivalModel).then(function (res) {
                            var i = 0;
                            // TODO: fix me
                            players[index].forEach(function (player) {
                                window.Server.playersRelation.put(
                                    {
                                        teamId:    res.id,
                                        studentId: player.id
                                    },
                                    {
                                        position:  player.position,
                                        sub:       player.sub ? player.sub : false
                                    }
                                ).then(function (res) {
                                    i += 1;

                                    if (i === players.length -1) {
                                        document.location.hash = 'event/' + event.id;
                                        binding.clear();
                                        binding.meta().clear();
                                    }
                                    return res;  // each then-callback should have explicit return
                                });
                            });
                            return res;
                        });
                    }
                });
                return event;
            });
        } else {
            //So, let's show form with incorrect data
            self._changeRivalFocusToErrorForm();
        }
	},
    _isEventDataCorrect: function() {
        var self = this,
            binding = self.getDefaultBinding();

        return !binding.toJS('error.0').isError && !binding.toJS('error.1').isError;
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
