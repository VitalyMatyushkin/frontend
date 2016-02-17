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
            selectedRivalIndex: 0,
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
                    text:    ""
                },
                {
                    isError: false,
                    text:    ""
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
    _validateTeams: function() {
        const self = this,
              binding    = self.getDefaultBinding(),
              eventType  = binding.toJS('model.type'),
              sportModel = binding.toJS('model.sportModel');

        if(eventType === 'internal') {
            self._validatePlayers(0);
            self._validatePlayers(1);

            self._changeRivalFocus();
        } else {
            self._validatePlayers(0);
        }
    },
    _changeRivalFocus: function() {
        const self   = this,
              errors = self.getDefaultBinding().toJS('error');

        for (let errIndex in errors) {
            if (errors[errIndex].isError) {
                self.getDefaultBinding().set('selectedRivalIndex', errIndex);
                break;
            }
        }
    },
    _validatePlayers: function(teamIndex) {
        const self = this,
            binding = self.getDefaultBinding(),
            allPlayers = binding.toJS('players'),
            sportModel = binding.toJS('model.sportModel');


        if(allPlayers[teamIndex].length < sportModel.limits.minPlayers) {
            binding.set(
                `error.${teamIndex}`,
                Immutable.fromJS(
                    {
                        isError: true,
                        text:    `Player count should be greater than ${sportModel.limits.minPlayers}`
                    }
                )
            );
        } else if(allPlayers[teamIndex].length > sportModel.limits.maxPlayers) {
            binding.set(
                `error.${teamIndex}`,
                Immutable.fromJS(
                    {
                        isError: true,
                        text:    `Player count should be less than ${sportModel.limits.maxPlayers}`
                    }
                )
            );
        } else if(!self._isPositionsCorrect(teamIndex)) {
            binding.set(
                `error.${teamIndex}`,
                Immutable.fromJS(
                    {
                        isError: true,
                        text:    'All players should have position'
                    }
                )
            );
        } if(self._isSubstitutionCountCorrect(teamIndex)) {
            binding.set(
                `error.${teamIndex}`,
                Immutable.fromJS(
                    {
                        isError: true,
                        text:    `Substitution count should be less than ${sportModel.limits.maxSubs}`
                    }
                )
            );
        } else {
            binding.set(
                `error.${teamIndex}`,
                Immutable.fromJS(
                    {
                        isError: false,
                        text:    ''
                    }
                )
            );
        }
    },
    _isPositionsCorrect: function(teamIndex) {
        const self = this,
              binding = self.getDefaultBinding(),
              players = binding.toJS(`players.${teamIndex}`);

        let isCorrect = true;

        for(let i = 0; i < players.length; i++) {
            if(players[i].position === undefined) {
                isCorrect = false;
                break;
            }
        }

        return isCorrect;
    },
    _isSubstitutionCountCorrect: function(teamIndex) {
        const self = this,
            binding = self.getDefaultBinding(),
            players = binding.toJS(`players.${teamIndex}`);

        let subCount = 0;

        for(let i = 0; i < players.length; i++) {
            if(players[i].isSub === undefined && players[i].isSub) {
                subCount++;
            }
        }

        return !(subCount > binding.toJS('model.sportModel.limits.maxSubs'));
    },
	toFinish: function () {
		var self = this,
			binding = self.getDefaultBinding(),
            rootBinding = self.getMoreartyContext().getBinding(),
            activeSchoolId = binding.get('schoolInfo.id'),
            model = binding.toJS('model'),
            players = binding.toJS('players'),
			rivals = binding.toJS('rivals');

        self._validateTeams();

        if(!binding.toJS('error.0').isError && !binding.toJS('error.1').isError) {
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
                                        sub:     player.isSub
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
                default: binding,
                rivals: binding.sub('rivals'),
                players: binding.sub('players')
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
