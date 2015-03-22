var CalendarView = require('module/ui/calendar/calendar'),
    EventManagerBase = require('./manager/base'),
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
                startTime: new Date(),
                type: null,
                sportId: null,
                gender: null,
                ages: null
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

		window.Server.schoolsFindOne.get({
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
            binding = self.getDefaultBinding();

        binding.set('model.startTime', date.toISOString());
		binding.set('model.startRegistrationTime', date.toISOString());
		binding.set('model.endRegistrationTime', date.toISOString());
        binding.set('step', 2);
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

                    if (event.type === 'houses') {
                        rivalModel.houseId = rival.id;
                    }

                    window.Server.participants.post(event.id, rivalModel).then(function (res) {
                        players[index].forEach(function (player) {
                            window.Server.playersRelation.put({
                                teamId: res.id,
                                studentId: player.id
                            });
                        });

                        document.location.hash = 'event/' + event.id;
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
                'Basic Info',
				'Form teams'
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
                {step === 1 ? <CalendarView
                    binding={rootBinding.sub('events.calendar')}
                    onSelect={self.onSelectDate} /> : null}
                {step === 2 ? <EventManagerBase binding={commonBinding} /> : null}
                {step === 3 ? <Manager binding={managerBinding} /> : null}
            </div>
			<div className="eEvents_buttons">
				{step > 1 ? <span className="bButton eEvents_button" onClick={self.toBack}>Back</span> : null}
				{step < titles.length && step > 1 ? <span className="bButton eEvents_button" onClick={self.toNext}>Next</span> : null}
				{step === titles.length ? <span className="bButton eEvents_button mFinish" onClick={self.toFinish}>Finish</span> : null}
			</div>
		</div>;
	}
});


module.exports = EventManager;
