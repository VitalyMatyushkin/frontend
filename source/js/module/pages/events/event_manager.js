var CalendarView = require('module/ui/calendar/calendar'),
    EventManagerBase = require('./event_manager_base'),
    Manager = require('module/ui/managers/manager'),
    EventManager;

EventManager = React.createClass({
	mixins: [Morearty.Mixin],
    getMergeStrategy: function () {
        return Morearty.MergeStrategy.MERGE_REPLACE
    },
	getDefaultState: function () {
        var self = this,
            rootBinding = self.getMoreartyContext().getBinding(),
            activeSchoolId = rootBinding.get('userRules.activeSchoolId');

        return Immutable.fromJS({
			newEvent: {
				model: {
					name: '',
					startTime: '',
					rivalsType: 'schools',
					type: 'external',
					minTeams: 2,
					maxTeams: 2,
					status: 'registration'
				},
				inviteModel: {},
                step: 1,
				rivals: [{id: activeSchoolId}]
			}
		});
	},
	componentWillMount: function () {
		var self = this,
            rootBinding = self.getMoreartyContext().getBinding(),
            activeSchoolId = rootBinding.get('userRules.activeSchoolId'),
			binding = self.getDefaultBinding();

		binding.sub('newEvent.model.rivalsType').addListener(function (descriptor) {
			if (descriptor.isValueChanged()) {
				var rivalsType = binding.get(descriptor.getPath()),
					type = rivalsType !== 'schools' ? 'internal' : 'external',
					schoolInfo = rootBinding.get('schoolInfo');

				binding.set('newEvent.model.type', type);
				binding.update('newEvent.rivals', function () {
					var rivals = Immutable.List();

					if (rivalsType === 'schools' && schoolInfo) {
						rivals = Immutable.List(schoolInfo);
					} else if (rivalsType === 'schools' && !schoolInfo) {
						rivals = Immutable.List(Immutable.Map({id: activeSchoolId}));
					}

					return rivals;
				});
			}
		});

		rootBinding.sub('schoolInfo').addListener(function (descriptor) {
			if (descriptor.isValueChanged()) {
				var schoolInfo = rootBinding.get(descriptor.getPath()).get('schoolInfo'),
					rivalsType = binding.get('newEvent.model.rivalsType');

				if (rivalsType === 'schools') {
					binding.merge('newEvent.rivals.0',schoolInfo);
				}
			}
		});

		window.Server.school.get(activeSchoolId).then(function (res) {
			rootBinding.merge('schoolInfo', Immutable.fromJS(res));
		});
	},
    onSelectDate: function (date) {
        var self = this,
            binding = self.getDefaultBinding();

        binding.set('newEvent.model.startTime', date.toISOString());
		binding.set('newEvent.model.startRegistrationTime', date.toISOString());
		binding.set('newEvent.model.endRegistrationTime', date.toISOString());
        binding.set('newEvent.step', 2);
    },
	toNext: function () {
		var self = this,
			binding = self.getDefaultBinding();

        binding.update('newEvent.step', function (step) {
            return step + 1;
        });
	},
	toBack: function () {
		var self = this,
			binding = self.getDefaultBinding();

        binding.update('newEvent.step', function (step) {
            return step - 1;
        });
	},
	toFinish: function () {
		var self = this,
			rootBinding = self.getMoreartyContext().getBinding(),
			activeSchoolId = rootBinding.get('userRules.activeSchoolId'),
			binding = self.getDefaultBinding(),
			model = binding.toJS('newEvent.model'),
			rivals = binding.toJS('newEvent.rivals');

		if (!model.name) {
			model.name = model.rivalsType + ' ' + model.startTime;
		}

		if (!model.sportId) {
			var football = rootBinding.get('sports.models').filter(function (sport) {
				return sport.get('name') === 'football';
			});

			model.sportId = football.count() > 0 ? football.get(0).get('id') : null;
		}

		window.Server.events.post(model).then(function (event) {
			rootBinding.update('events.models', function (events) {
				return events.push(Immutable.fromJS(event));
			});

			rivals.forEach(function (rival) {
                if (model.rivalsType === 'schools' && rival.id !== activeSchoolId) {
					window.Server.invitesByEvent.post({eventId: event.id}, {
                        eventId: event.id,
                        inviterId: activeSchoolId,
                        invitedId: rival.id,
						message: 'message',
						invitedType: 'schools'
                    }).then(function () {
                        document.location.hash = 'events/view?id=' + event.id;
                    });
                } else {
                    var rivalModel = {
                        sportId: event.sportId,
                        schoolId: event.rivalsType === 'schools' ? rival.id : rival.schoolId
                    };

                    if (event.rivalsType === 'houses') {
                        rivalModel.houseId = rival.id;
                        rivalModel.rivalType = 'house';
                    } else if (event.rivalsType === 'classes') {
                        rivalModel.classId = rival.id;
                        rivalModel.rivalType = 'class';
                    } else {
                        rivalModel.rivalType = 'school';
                    }

                    window.Server.participants.post(event.id, rivalModel).then(function (res) {
                        rival.players.forEach(function (player) {
                            window.Server.playersRelation.put({
                                teamId: res.id,
                                studentId: player.id
                            }).then(function (res) {
                                console.log(res);
                            });
                        });


                        document.location.hash = 'events/view?id=' + event.id;
						binding.clear();
                    });
                }
			});
		});
	},
	render: function() {
		var self = this,
			binding = self.getDefaultBinding(),
            rootBinding = self.getMoreartyContext().getBinding(),
            step = binding.get('newEvent.step'),
            activeSchoolId = rootBinding.get('userRules.activeSchoolId'),
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
			});

		return <div>
           	<h3>{'[' + step + '/' + titles.length + ']: ' + titles[step - 1]}</h3>
            <div className={bManagerClasses}>
                {step === 1 ? <CalendarView
                    binding={rootBinding.sub('events.calendar')}
                    onSelect={self.onSelectDate} /> : null}
                {step === 2 ? <EventManagerBase binding={binding} /> : null}
                {step === 3 ? <Manager binding={binding.sub('newEvent')} /> : null}
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
