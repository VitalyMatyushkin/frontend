var InfoView,
    SVG = require('module/ui/svg');

InfoView = React.createClass({
    mixins: [Morearty.Mixin],
    componentWillMount: function () {
        var rootBinding = this.getMoreartyContext().getBinding(),
            eventsBinding = rootBinding.sub('events'),
            invitesBinding = rootBinding.sub('invites'),
            teamsBinding = rootBinding.sub('teams'),
            sportsBinding = rootBinding.sub('sports'),
            activeSchoolId = rootBinding.get('userRules.activeSchoolId');

        if (activeSchoolId && (!eventsBinding.get('sync') || !teamsBinding.get('sync'))) {
            window.Server.teamsBySchoolId.get(activeSchoolId).then(function (data) {
                teamsBinding.set(Immutable.fromJS({
                    sync: true,
                    models: data
                }));

                eventsBinding.merge(Immutable.fromJS({
                    models: data.map(function (team) {
                        return team.events[0];
                    }).reduce(function (memo, val) {
                        var filtered = memo.filter(function (mem) {
                            return mem.id === val.id;
                        });

                        if (filtered.length === 0) {
                            memo.push(val);
                        }

                        return memo;
                    }, []),
                    sync: true
                }));
            });
        }

        if (activeSchoolId && !invitesBinding.get('sync')) {
            window.Server.invites.get({
                filter: {
                    where: {
                        or: [
                            {
                                inviterId: activeSchoolId
                            },
                            {
                                invitedId: activeSchoolId
                            }
                        ],
                        repaid: {
                            neq: true
                        }
                    }
                }
            }).then(function (data) {
                var uniqueIds = data.reduce(function (memo, invite) {
                        if (memo.indexOf(invite.inviterId) === -1) {
                            memo.push(invite.inviterId);
                        }

                    if (memo.indexOf(invite.invitedId) === -1) {
                        memo.push(invite.invitedId);
                    }

                        return memo;
                }, []);

                invitesBinding.update(function () {
                    return Immutable.fromJS({
                        sync: true,
                        models: data
                    });
                });

                window.Server.schools.get({
                    filter: {
                        inq: uniqueIds
                    }
                }).then(function (res) {
                    invitesBinding.update('models', function (invites) {
                       return invites.map(function (invite) {
                           var _inviter = res.filter(function (inv) {
                                   return inv.id === invite.get('inviterId')
                               }),
                               _invited = res.filter(function (inv) {
                                   return inv.id === invite.get('invitedId')
                               });

                           invite
                               .set('inviter', Immutable.fromJS(_inviter))
                               .set('invited', Immutable.fromJS(_invited));

                           return invite;
                       });
                    });
                });
            });
        }

        if (activeSchoolId && !sportsBinding.get('sync')) {
            window.Server.sports.get().then(function (data) {
                sportsBinding.update(function () {
                    return Immutable.fromJS({
                        sync: true,
                        models: data
                    });
                });
            });
        }
    },
    setActiveList: function (hash) {
        window.location.hash = 'events/' + hash;
    },
    render: function() {
        var self = this,
            rootBinding = this.getMoreartyContext().getBinding(),
            eventsBinding = rootBinding.sub('events'),
            invitesBinding = rootBinding.sub('invites'),
            activeSchoolId = rootBinding.get('activeSchoolId'),
            eventsCount = eventsBinding.get('sync') ? eventsBinding.get('models').count() : '',
            invitesCount = invitesBinding.get('sync') ? invitesBinding.get('models').count() : '';

        return <div className="eEvents_topPanel">
            <div className="eTopInfoBlock mMyEvent" onClick={self.setActiveList.bind(null, 'calendar')}>
                <span className="eTopInfoBlock_count"></span>
                <SVG icon="icon_calendar" />
                <span className="eTopInfoBlock_title">Calendar</span>
                <span className="eTopInfoBlock_action" >overview</span>
            </div>
            <div className="eTopInfoBlock mNewEvent" onClick={self.setActiveList.bind(null, 'challenges')}>
                <span className="eTopInfoBlock_count">{eventsCount}</span>
                <span className="eTopInfoBlock_title">Challenges</span>
                <span className="eTopInfoBlock_action">overview</span>
            </div>
            <div className="eTopInfoBlock mMyInvite" onClick={self.setActiveList.bind(null, 'invites')}>
                <span className="eTopInfoBlock_count">{invitesCount}</span>
                <span className="eTopInfoBlock_title">Invites</span>
                <span className="eTopInfoBlock_action">overview</span>
            </div>
            <div className="eTopInfoBlock mListEvent" onClick={self.setActiveList.bind(null, 'manager')}>
                <span className="eTopInfoBlock_count">0</span>
                <span className="eTopInfoBlock_title">New Challenge</span>
                <span className="eTopInfoBlock_action">overview</span>
            </div>
        </div>
    }
});


module.exports = InfoView;
