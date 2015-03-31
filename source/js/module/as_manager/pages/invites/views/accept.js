var InviteAcceptView,
    If = require('module/ui/if/if'),
    Manager = require('module/ui/managers/manager');

InviteAcceptView = React.createClass({
    mixins: [Morearty.Mixin],
    display: 'InviteAccept',
    componentWillMount: function () {
        var self = this,
            rootBinding = self.getMoreartyContext().getBinding(),
            binding = self.getDefaultBinding(),
            inviteId = rootBinding.get('routing.pathParameters.0'),
            mode = rootBinding.get('routing.pathParameters.1');

        window.Server.invitesFindOne.get({
            filter: {
                where: {
                    id: inviteId
                },
                include: [
                    {
                        guest: ['forms']
                    },
                    {
                        event: 'sport'
                    },
                    {
                        inviter: ['forms']
                    }
                ]
            }
        }).then(function (res) {
            binding.atomically()
                .set('invite', Immutable.fromJS(res))
                .set('model', Immutable.fromJS(res.event))
                .set('rivals', Immutable.fromJS([res.guest, res.inviter]))
                .set('players', Immutable.fromJS([[],[]]))
                .set('sync', true)
                .set('schoolInfo', Immutable.fromJS(res.guest))
                .commit();
        });
    },
    onClickAccept: function () {
        var self = this,
            binding = self.getDefaultBinding();

        window.Server.participants.post({eventId: binding.get('model.id')}, {
            eventId: binding.get('model.id'),
            schoolId: binding.get('rivals.0.id'),
            sportId: binding.get('model.sportId'),
            name: binding.get('rivals.0.name')
        }).then(function (res) {

            window.Server.inviteRepay.post({inviteId: binding.get('invite.id')}, {
                teamId: res.id,
                accepted: true
            });

            binding.get('players.0').forEach(function (player) {
                var i = 0;
                window.Server.playersRelation.put({
                    teamId: res.id,
                    studentId: player.get('id')
                }).then(function () {
                    i += 1;

                    if (i === binding.get('players.0').count()) {
                        document.location.hash = '#event/' + binding.get('model.id');

                    }
                });
            });
        });
    },
    render: function() {
        var self = this,
            binding = self.getDefaultBinding(),
            managerBinding = {
                default: binding,
                rivals: binding.sub('rivals'),
                players: binding.sub('players')
            },
            sport = binding.sub('model.sport'),
            ready = binding.get('sync') && binding.get('players.0').count() >= sport.get('limits.minPlayers'),
            buttonClasses = classNames({
                bButton: true,
                mDisable: !ready
            });

        return <div>
            <If condition={!!binding.get('sync')}>
                <Manager binding={managerBinding} />
            </If>
            <span className={buttonClasses} onClick={ready ? self.onClickAccept : null}>Accept</span>
        </div>;
    }
});


module.exports = InviteAcceptView;
