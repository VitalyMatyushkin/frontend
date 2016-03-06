const   If              = require('module/ui/if/if'),
        Manager         = require('module/ui/managers/manager'),
        React           = require('react'),
        classNames      = require('classnames'),
        TeamSubmitMixin = require('module/ui/managers/helpers/team_submit_mixin'),
        Promise         = require('bluebird'),
        Immutable       = require('immutable');

const InviteAcceptView = React.createClass({
    mixins: [Morearty.Mixin, TeamSubmitMixin],
    display: 'InviteAccept',
    componentWillMount: function () {
        var self = this,
            rootBinding = self.getMoreartyContext().getBinding(),
            binding = self.getDefaultBinding(),
            inviteId = rootBinding.get('routing.pathParameters.0');

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
        var self = this;

        if(self._isEventDataCorrect()) {
            self._submit();
        }
    },
    _submit: function() {
        const self = this,
            binding = self.getDefaultBinding(),
            promises = self._submitRival(
                binding.toJS('model'),
                binding.toJS('rivals.0'),
                0
            );

        Promise.all(promises).then((data) => {
            data.forEach((elem) => {
                if(elem.teamId !== undefined) {
                    window.Server.inviteRepay.post({inviteId: binding.get('invite.id')}, {
                        teamId: elem.teamId,
                        accepted: true
                    }).then(() => {
                        document.location.hash = '#event/' + binding.get('model.id');
                        return true;
                    });
                }
            });
        });
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
