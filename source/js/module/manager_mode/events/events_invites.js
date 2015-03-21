var SVG = require('module/ui/svg'),
    InvitesList = require('module/manager_mode/events/invites/list'),
    EventsView;

EventsView = React.createClass({
	mixins: [Morearty.Mixin],
    getDefaultState: function () {
        return Immutable.fromJS({
            selectInvitesType: 'inbox',
            selectInviteAccepted: null,
            stepInviteAccepted: 0
        });
    },
    componentWillMount: function () {
        var self = this,
            invitesBinding = self.getDefaultBinding(),
            rootBinding = self.getMoreartyContext().getBinding(),
            activeSchoolId = rootBinding.get('userRules.activeSchoolId');

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
            invitesBinding
                .atomically()
                .set('sync', true)
                .set('models', Immutable.fromJS(data))
                .set('selectInvitesType', 'inbox')
                .set('selectInviteAccepted', null)
                .set('stepInviteAccepted', 0)
                .commit();

            var uniqueIds = data.reduce(function (memo, invite) {
                if (memo.indexOf(invite.inviterId) === -1) {
                    memo.push(invite.inviterId);
                }

                if (memo.indexOf(invite.invitedId) === -1) {
                    memo.push(invite.invitedId);
                }

                return memo;
            }, []);

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

                        return invite
                            .set('inviter', Immutable.fromJS(_inviter[0]))
                            .set('invited', Immutable.fromJS(_invited[0]));
                    });
                });
            });
        });
    },
	render: function() {
		var self = this,
            binding = self.getDefaultBinding();

        return <div>
            <h2>Invites</h2>
            <InvitesList binding={binding} />
        </div>;
	}
});


module.exports = EventsView;
