var CalendarView = require('./events_calendar'),
	EventsChallengesView = require('./events_challenges'),
	InvitesView = require('./events_invites'),
	EventsView;

EventsView = React.createClass({
	mixins: [Morearty.Mixin],
	getDefaultState: function () {
		var date = new Date();

		return Immutable.fromJS({
            activeList: 'challenges'
		});
	},
	componentWillMount: function () {
		var rootBinding = this.getMoreartyContext().getBinding(),
            eventsBinding = rootBinding.sub('events'),
            invitesBinding = rootBinding.sub('invites'),
            teamsBinding = rootBinding.sub('teams'),
            activeSchoolId = rootBinding.get('activeSchoolId');

        if (activeSchoolId && (!eventsBinding.get('sync') || !teamsBinding.get('sync'))) {
            window.Server.teamsBySchoolId.get(activeSchoolId).then(function (data) {
                teamsBinding.update(function () {
                    return Immutable.fromJS({
                        sync: true,
                        models: data
                    });
                });

                eventsBinding.update(function () {
                    return Immutable.fromJS({
                        models: data.map(function (team) {
                            return team.events[0];
                        }),
                        sync: true
                    });
                });
            });
        }

        if (activeSchoolId && !invitesBinding.get('sync')) {
            window.Server.invites.get(activeSchoolId).then(function (data) {
                invitesBinding.update(function () {
                    return Immutable.fromJS({
                        sync: true,
                        models: data
                    });
                });
            });
        }
	},
    getSchools: function () {
        var self = this,
            rootBinding = this.getMoreartyContext().getBinding(),
            activeSchoolId = rootBinding.get('activeSchoolId'),
            schoolsBinding = rootBinding.sub('schools');

        if (schoolsBinding.get().count()) {
            return schoolsBinding.get().map(function (school) {
                return <option value={school.get('id')}>{school.get('name')}</option>
            })
        } else {
            return null;
        }
    },
	render: function() {
		var self = this,
            rootBinding = this.getMoreartyContext().getBinding(),
            eventsBinding = rootBinding.sub('events'),
            teamsBinding = rootBinding.sub('teams'),
            invitesBinding = rootBinding.sub('invites'),
            activeSchoolId = rootBinding.get('activeSchoolId'),
			binding = self.getDefaultBinding(),
			activeList = binding.get('activeList') || 'challenges',
			currentView,
            eventsCount = eventsBinding.get('sync') ? eventsBinding.get('models').count() : '',
            invitesCount = invitesBinding.get('sync') ? invitesBinding.get('models').count() : '';

		if (activeList === 'calendar') {
			currentView =  <CalendarView binding={binding.sub('calendar')} />
		} else if (activeList === 'challenges') {
			currentView =  <EventsChallengesView binding={eventsBinding} />
		} else if (activeList === 'invites') {
			currentView =  <InvitesView binding={invitesBinding} />
		} else if (activeList === 'newChallenge') {
			currentView =  <InvitesView binding={invitesBinding} />
		}

		return <div className="bEvents">
            <div className="eEvents_chooser">
                <select>
                {self.getSchools()}
                </select>
            </div>
			<div className="eEvents_topPanel">
				<div className="eTopInfoBlock mMyEvent">
					<span className="eTopInfoBlock_count"></span>
					<span className="eTopInfoBlock_title">Calendar</span>
					<span className="eTopInfoBlock_action">overview</span>
				</div>
				<div className="eTopInfoBlock mNewEvent">
					<span className="eTopInfoBlock_count">{eventsCount}</span>
					<span className="eTopInfoBlock_title">Challenges</span>
					<span className="eTopInfoBlock_action">overview</span>
				</div>
				<div className="eTopInfoBlock mMyInvite">
					<span className="eTopInfoBlock_count">{invitesCount}</span>
					<span className="eTopInfoBlock_title">Invites</span>
					<span className="eTopInfoBlock_action">overview</span>
				</div>
				<div className="eTopInfoBlock mListEvent">
					<span className="eTopInfoBlock_count"></span>
					<span className="eTopInfoBlock_title">New Challenge</span>
					<span className="eTopInfoBlock_action">overview</span>
				</div>
			</div>
            {currentView}
		</div>
	}
});


module.exports = EventsView;
