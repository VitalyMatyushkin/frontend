const   If          = require('module/ui/if/if'),
        Manager     = require('module/ui/managers/manager'),
        React       = require('react'),
        classNames  = require('classnames'),
        Immutable   = require('immutable');

const InviteAcceptView = React.createClass({
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
                //TODO wtf??
                .set('model', Immutable.fromJS(res.event))
                .set('model.sportModel', Immutable.fromJS(res.event.sport))
                .set('rivals', Immutable.fromJS([res.guest, res.inviter]))
                .set('players', Immutable.fromJS([[],[]]))
                .set('sync', true)
                .set('schoolInfo', Immutable.fromJS(res.guest))
                //TODO wtf??
                .set('selectedRivalIndex', Immutable.fromJS(0))
                //TODO wtf??
                .set('error', Immutable.fromJS([
                    {
                        isError: false,
                        text: ""
                    },
                    {
                        isError: false,
                        text: ""
                    }
                ]))
                .commit();
        });
    },
    onClickAccept: function () {
        var self = this,
            binding = self.getDefaultBinding();

        if(self._isEventDataCorrect()) {
            let mode = binding.get('mode.0');

            switch (mode) {
                case 'teams':
                    window.Server.relParticipants.put(
                        {
                            eventId: binding.get('model.id'),
                            teamId: binding.get('teamModeView.teamViewer.0.selectedTeamId')
                        },
                        {
                            eventId: binding.get('model.id'),
                            teamId: binding.get('teamModeView.teamViewer.0.selectedTeamId')
                        }
                    ).then(() => {
                        return window.Server.inviteRepay.post({inviteId: binding.get('invite.id')}, {
                            teamId: binding.get('teamModeView.teamViewer.0.selectedTeamId'),
                            accepted: true
                        }).then((res) => {
                            document.location.hash = '#event/' + binding.get('model.id');
                            return res;
                        });
                    });
                    break;
                case 'temp':
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

                        binding.get('players.0').forEach(function (student, studentIndex) {
                            window.Server.playersRelation.put({
                                teamId: res.id,
                                studentId: student.get('id')
                            }).then(function (res) {
                                binding.sub('players.0.' + studentIndex).meta().set('sync', true);

                                var allSynced = binding.get('players.0').every(function (model, modelIndex) {
                                    return binding.sub('players.0.' + modelIndex).meta().get('sync');
                                });

                                if (allSynced) {
                                    document.location.hash = '#event/' + binding.get('model.id');
                                }
                                return res;
                            });
                        });
                        return res;
                    });
                    break;
            };
        }
    },
    _isEventDataCorrect: function() {
        const self = this;

        return !self.getDefaultBinding().toJS('error.0').isError;
    },
    render: function() {
        var self = this,
            binding = self.getDefaultBinding(),
            managerBinding = {
                default:            binding,
                selectedRivalIndex: binding.sub('selectedRivalIndex'),
                rivals:             binding.sub('rivals'),
                players:            binding.sub('players'),
                error:              binding.sub('error')
            },
            sport = binding.sub('model.sport'),
            ready = binding.get('sync') && binding.get('players.0').count() >= sport.get('limits.minPlayers'),
            buttonClasses = classNames({
                bButton: true,
                mButton_leftSidePosition: true,
                mDisable: !ready
            });

        return (
            <div className="bInviteAccept">
                <div className="bManager mTeamManager">
                    <If condition={!!binding.get('sync')}>
                        <Manager binding={managerBinding} />
                    </If>
                </div>
                <div className="eInviteAccept_footer">
                    <div className="eInviteAccept_acceptButtonWrapper">
                        <div className="eInviteAccept_footerLeftSide">
                        </div>
                        <div className="eInviteAccept_footerRightSide">
                            <span className={buttonClasses}
                                  onClick={ready ? self.onClickAccept : null}>Accept</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});


module.exports = InviteAcceptView;
