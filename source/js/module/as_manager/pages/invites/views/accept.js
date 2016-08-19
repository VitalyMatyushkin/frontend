const   If              = require('module/ui/if/if'),
        Manager         = require('module/ui/managers/manager'),
        React           = require('react'),
        classNames      = require('classnames'),
        TeamSubmitMixin = require('module/ui/managers/helpers/team_submit_mixin'),
        TeamHelper      = require('./../../../../ui/managers/helpers/team_helper'),
        Promise         = require('bluebird'),
        MoreartyHelper	= require('module/helpers/morearty_helper'),
        Morearty		= require('morearty'),
        Immutable       = require('immutable');

const InviteAcceptView = React.createClass({
    mixins: [Morearty.Mixin, TeamSubmitMixin],
    // ID of current school
    // Will set on componentWillMount event
    activeSchoolId: undefined,
    display: 'InviteAccept',
    componentWillMount: function () {
        var self = this,
            rootBinding = self.getMoreartyContext().getBinding(),
            binding = self.getDefaultBinding(),
            inviteId = rootBinding.get('routing.pathParameters.0');

        self.activeSchoolId = MoreartyHelper.getActiveSchoolId(self);

        binding.clear();
        let invite;
        window.Server.schoolInvite.get({schoolId: self.activeSchoolId, inviteId: inviteId})
        .then(_invite => {
            invite = _invite;

            return window.Server.school.get(self.activeSchoolId)
            .then(currentSchool => {
                invite.invitedSchool = currentSchool;

                return window.Server.schoolForms.get(self.activeSchoolId, {filter:{limit:1000}}).then(forms => currentSchool.forms = forms);
            })
            .then(_ => {
                return window.Server.publicSchool.get(invite.inviterSchoolId).then(inviterSchool => {
                    invite.inviterSchool = inviterSchool;

                    return window.Server.publicSchoolForms.get(invite.inviterSchoolId, {filter:{limit:1000}}).then(forms => inviterSchool.forms = forms);
                });
            })
            .then(_ => {
                return window.Server.schoolEvent.get({schoolId: self.activeSchoolId, eventId: invite.eventId});
            })
            .then(event => {
                invite.event = event;

                return window.Server.sport.get(event.sportId).then(sport => invite.event.sport = sport);
            });
        })
        .then(function (res) {
            binding.atomically()
                .set('invite', Immutable.fromJS(invite))
                //TODO wtf??
                .set('model', Immutable.fromJS(invite.event))
                .set('model.sportModel', Immutable.fromJS(invite.event.sport))
                .set('rivals', Immutable.fromJS([invite.invitedSchool, invite.inviterSchool]))
                .set('players', Immutable.fromJS([[],[]]))
                .set('sync', true)
                .set('schoolInfo', Immutable.fromJS(invite.invitedSchool))
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
    componentWillUnmount: function () {
        const   self    = this,
                binding = self.getDefaultBinding();

        binding.clear();
    },
    onClickAccept: function () {
        var self = this;

        if(self._isEventDataCorrect()) {
            self._submit();
        }
    },
    _submit: function() {
        const   self    = this,
                binding = self.getDefaultBinding();

        const event = binding.toJS('model');

        if(TeamHelper.isNonTeamSport(event)) {
            // add new individuals
            Promise.all(self.addIndividualPlayersToEvent(event))
                // accept invite
                .then(() => window.Server.acceptSchoolInvite.post({
                        schoolId: self.activeSchoolId,
                        inviteId: binding.get('invite.id')
                    })
                )
                .then(() => {
                    document.location.hash = '#event/' + event.id;

                    return true;
                });
        } else {
            // create new team
            Promise.all(self.createTeams())
                // add it to event
                .then(teams => Promise.all(self.addTeamsToEvent(event, teams)))
                // accept invite
                .then(() => window.Server.acceptSchoolInvite.post({
                        schoolId: self.activeSchoolId,
                        inviteId: binding.get('invite.id')
                    })
                )
                .then(() => {
                    document.location.hash = '#event/' + event.id;

                    return true;
                });
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
            sport = binding.sub('model.sport');

        return (
            <div className="bInviteAccept">
                <div className="bManager mTeamManager">
                    <If condition={!!binding.get('sync')}>
                        <Manager isInviteMode={true} binding={managerBinding} />
                    </If>
                </div>
                <div className="eInviteAccept_footer">
                    <div className="eInviteAccept_acceptButtonWrapper">
                        <div className="eInviteAccept_footerLeftSide">
                        </div>
                        <div className="eInviteAccept_footerRightSide">
                            <span className='bButton mButton_leftSidePosition'
                                  onClick={self.onClickAccept}>Accept</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});


module.exports = InviteAcceptView;
