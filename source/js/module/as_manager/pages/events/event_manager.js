var CalendarView = require('module/ui/calendar/calendar'),
    EventManagerBase = require('./manager/base'),
    If = require('module/ui/if/if'),
    TimePicker = require('module/ui/timepicker/timepicker'),
    Manager = require('module/ui/managers/manager'),
    EventManager;

EventManager = React.createClass({
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
            schoolInfo: {},
            inviteModel: {},
            step: 1,
            rivals: [{id: activeSchoolId}],
            autocomplete: {
                'inter-schools': [],
                houses: [],
                internal: []
            },
            players: [[],[]],
            availableAges: []
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
	toFinish: function () {
		var self = this,
			binding = self.getDefaultBinding(),
            rootBinding = self.getMoreartyContext().getBinding(),
            activeSchoolId = binding.get('schoolInfo.id'),
            model = binding.toJS('model'),
            players = binding.toJS('players'),
			rivals = binding.toJS('rivals');

		window.Server.events.post(model).then(function (event) {
			rootBinding.update('events.models', function (events) {
				return events.push(Immutable.fromJS(event));
			});

			rivals.forEach(function (rival, index) {
                if (model.type === 'inter-schools' && rival.id !== activeSchoolId) {
					window.Server.invitesByEvent.post({eventId: event.id}, {
                        eventId: event.id,
                        inviterId: activeSchoolId,
                        guestId: rival.id,
						message: 'message'
                    });
                } else {
                    var rivalModel = {
                        sportId: event.sportId,
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

                        players[index].forEach(function (player) {
                            window.Server.playersRelation.put({
                                teamId: res.id,
                                studentId: player.id
                            }).then(function (res) {
                                i += 1;

                                if (i === players.length -1) {
                                    document.location.hash = 'event/' + event.id;
                                    binding.clear();
                                    binding.meta().clear();
                                }
                            });
                        });
                    });
                }
			});
		});
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
				{step > 1 ? <span className="bButton eEvents_button" onClick={self.toBack}>Back</span> : null}
				{step < titles.length ? <span className="bButton eEvents_button" onClick={self.toNext}>Next</span> : null}
				{step === titles.length ? <span className="bButton eEvents_button mFinish" onClick={self.toFinish}>Finish</span> : null}
			</div>
		</div>;
	}
});


module.exports = EventManager;
