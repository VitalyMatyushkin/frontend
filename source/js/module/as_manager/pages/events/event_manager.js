const   CalendarView        = require('module/ui/calendar/calendar'),
        EventManagerBase    = require('./manager/base'),
        If                  = require('module/ui/if/if'),
        TimePicker          = require('module/ui/timepicker/timepicker'),
        Manager             = require('module/ui/managers/manager'),
        classNames          = require('classnames'),
        React               = require('react'),
        TeamHelper           = require('module/ui/managers/helpers/team_helper'),
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

        let rivalPromises = [];
        rivals.forEach((rival, rivalIndex) => {
            rivalPromises.push(self._submitRival(event, rival, rivalIndex));
        });
        Promise.all(rivalPromises).then((data) => {
            //Create players for temp team
            let playerPromises = [];
            data.forEach((teamWrapper) => {
                if(teamWrapper && teamWrapper.type == 'newTeam') {
                    playerPromises.push(self._submitPlayers(teamWrapper.team, teamWrapper.rivalIndex));
                } else if (
                    teamWrapper &&
                    teamWrapper.type == 'oldTeam' &&
                    binding.toJS(`teamModeView.teamWrapper.${teamWrapper.rivalIndex}.teamsSaveMode` == 'current')
                ) {
                    const initialPlayers = binding.toJS(`teamModeView.teamWrapper.${teamWrapper.rivalIndex}.prevPlayers`),
                        players = binding.toJS(`teamModeView.teamWrapper.${teamWrapper.rivalIndex}.players`),
                        teamId = binding.toJS(`teamModeView.teamWrapper.${teamWrapper.rivalIndex}.selectedTeamId`);

                    playerPromises.push(TeamHelper.commitPlayers(initialPlayers, players, teamId));
                }
            });
            Promise.all(playerPromises).then(() => {
                document.location.hash = 'event/' + event.id;
                binding.clear();
                binding.meta().clear();
            });
        });
    },
    _submitRival: function(event, rival, rivalIndex) {
        const self = this,
            binding = self.getDefaultBinding(),
            activeSchoolId = binding.get('schoolInfo.id'),
            model = binding.toJS('model');

        if (model.type === 'inter-schools' && rival.id !== activeSchoolId) {
            self._submitInvite(event, rival);
        }
        let mode = binding.toJS(`mode.${rivalIndex}`);
        let teamPromise;
        switch (mode) {
            case 'temp':
                teamPromise = self._submitTempCreationMode(event, rival, rivalIndex);
                break;
            case 'teams':
                teamPromise = self._submitTeamCreationMode(event, rival, rivalIndex);
                break;
        }
        return teamPromise;
    },
    _submitTempCreationMode: function(event, rival, rivalIndex) {
        const self = this;

        self._submitNewTeam(event, rival, rivalIndex, true);
    },
    _submitTeamCreationMode: function(event, rival, rivalIndex) {
        const self = this,
            binding = self.getDefaultBinding(),
            mode = binding.get(`teamModeView.teamWrapper.${rivalIndex}.teamsSaveMode`);

        let promise;
        switch (mode) {
            case 'current':
            case 'selectedTeam':
                promise = self._submitOldTeam(event, rivalIndex);
                break;
            case 'temp':
                promise = self._submitNewTeam(event, rival, rivalIndex, true);
                break;
            case 'new':
                promise = self._submitNewTeam(event, rival, rivalIndex, false);
                break;
        }

        return promise;
    },
    _submitOldTeam: function(event, rivalIndex) {
        const self = this,
            teamId = self.getDefaultBinding().toJS(`teamModeView.teamWrapper.${rivalIndex}.selectedTeamId`);

        return window.Server.relParticipants.put(
            {
                eventId: event.id,
                teamId: teamId
            },
            {
                eventId: event.id,
                teamId: teamId
            }
        ).then((team) => {
            return {
                type:'oldTeam',
                rivalIndex: rivalIndex,
                team: team
            }
        });
    },
    _submitNewTeam: function(event, rival, rivalIndex, isTemp) {
        const self = this,
            binding = self.getDefaultBinding(),
            activeSchoolId = binding.get('schoolInfo.id'),
            players = binding.toJS('players');

        let rivalModel = {
            sportId:  event.sportId,
            schoolId: activeSchoolId,
            tempTeam: isTemp
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

        return window.Server.participants.post(event.id, rivalModel).then((team) => {
            return {
                type:'newTeam',
                rivalIndex: rivalIndex,
                team: team
            }
        });
    },
    _submitPlayers: function(team, rivalIndex) {
        const self = this,
            binding = self.getDefaultBinding();

        let players;

        switch (binding.toJS(`mode.${rivalIndex}`)) {
            case 'temp':
                players = binding.toJS(`players.${rivalIndex}`);
                break;
            case 'teams':
                players = binding.toJS(`teamModeView.teamWrapper.${rivalIndex}.players`);
                break;
        }

        let playerPromises = [];

        players.forEach(function (player) {
            playerPromises.push(self._submitPlayer(team, player));
        });

        return Promise.all(playerPromises);
    },
    _submitPlayer: function(team, player) {
        return window.Server.playersRelation.put(
            {
                teamId:    team.id,
                studentId: player.id
            },
            {
                position:  player.position,
                sub:       player.sub ? player.sub : false
            }
        );
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