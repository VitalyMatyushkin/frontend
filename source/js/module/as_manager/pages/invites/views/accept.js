const	If								= require('module/ui/if/if'),
		Manager							= require('module/ui/managers/manager'),
		React							= require('react'),
		classNames						= require('classnames'),
		TeamHelper						= require('./../../../../ui/managers/helpers/team_helper'),
		Promise							= require('bluebird'),
		MoreartyHelper					= require('module/helpers/morearty_helper'),
		Morearty						= require('morearty'),
		Immutable						= require('immutable'),

		SavingEventHelper				= require('../../../../helpers/saving_event_helper'),
		SavingPlayerChangesPopup		= require('../../events/saving_player_changes_popup/saving_player_changes_popup'),
		SavingPlayerChangesPopupHelper	= require('../../events/saving_player_changes_popup/helper');

const InviteAcceptView = React.createClass({
    mixins: [Morearty.Mixin],
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
		binding.set('isSavingChangesModePopupOpen', false);
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
	showSavingChangesModePopup: function() {
		this.getDefaultBinding().set('isSavingChangesModePopupOpen', true);
	},
    onClickAccept: function () {
		const	self	= this,
				binding	= self.getDefaultBinding();

		// if true - then user click to finish button
		// so we shouldn't do anything
		if(!binding.toJS('isSubmitProcessing')) {
			const	event			= binding.toJS('model'),
					teamWrappers	= this.getTeamWrappers(),
					validationData	= [
						binding.toJS('error.0'),
						binding.toJS('error.1')
					];

			switch (true) {
				case (
						TeamHelper.isTeamDataCorrect(event, validationData) && TeamHelper.isTeamSport(event) &&
						!SavingPlayerChangesPopupHelper.isAnyTeamChanged(event, teamWrappers) && SavingPlayerChangesPopupHelper.isUserCreateNewTeam(event, teamWrappers)
				):
					this.showSavingChangesModePopup();
					break;
				case (
						TeamHelper.isTeamDataCorrect(event, validationData) && TeamHelper.isTeamSport(event) &&
						SavingPlayerChangesPopupHelper.isAnyTeamChanged(event, teamWrappers) && !SavingPlayerChangesPopupHelper.isUserCreateNewTeam(event, teamWrappers)
				):
					this.showSavingChangesModePopup();
					break;
				case (
						TeamHelper.isTeamDataCorrect(event, validationData) && TeamHelper.isTeamSport(event) &&
						SavingPlayerChangesPopupHelper.isAnyTeamChanged(event, teamWrappers) && SavingPlayerChangesPopupHelper.isUserCreateNewTeam(event, teamWrappers)
				):
					this.showSavingChangesModePopup();
					break;
				case (
						TeamHelper.isTeamDataCorrect(event, validationData) && TeamHelper.isTeamSport(event) &&
						!SavingPlayerChangesPopupHelper.isAnyTeamChanged(event, teamWrappers) && !SavingPlayerChangesPopupHelper.isUserCreateNewTeam(event, teamWrappers)
				):
					binding.set('isSubmitProcessing', true);
					this._submit();
					break;
				case TeamHelper.isTeamDataCorrect(event, validationData) && TeamHelper.isNonTeamSport(event):
					binding.set('isSubmitProcessing', true);
					this._submit();
					break;
			}
		}
	},
	getTeamWrappers: function() {
		return this.getDefaultBinding().toJS('teamModeView.teamWrapper');
	},
    _submit: function() {
        const   self    = this,
                binding = self.getDefaultBinding();

        const event = binding.toJS('model');

        if(TeamHelper.isNonTeamSport(event)) {
            // add new individuals
            Promise
                .all(TeamHelper.addIndividualPlayersToEvent(
                    self.activeSchoolId,
                    event,
                    binding.toJS(`teamModeView.teamWrapper`
                )))
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
			return Promise
				.all(
					SavingEventHelper.processSavingChangesMode(
						self.activeSchoolId,
						binding.toJS(`rivals`),
						binding.toJS('model'),
						binding.toJS(`teamModeView.teamWrapper`)
					)
				).then(() => {
					// create new team
					return Promise.all(TeamHelper.createTeams(
						self.activeSchoolId,
						binding.toJS('model'),
						binding.toJS(`rivals`),
						binding.toJS(`teamModeView.teamWrapper`)
					));
				})
                // add it to event
                .then(teams => Promise.all(TeamHelper.addTeamsToEvent(self.activeSchoolId, event, teams)))
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
                <SavingPlayerChangesPopup	binding	= {binding}
                                             submit	= {() => this._submit()}
                />
            </div>
        );
    }
});


module.exports = InviteAcceptView;
