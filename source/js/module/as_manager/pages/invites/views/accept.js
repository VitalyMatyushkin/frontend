const	React							= require('react'),
		Morearty						= require('morearty'),
		Immutable						= require('immutable');

const	classNames						= require('classnames'),
		Promise							= require('bluebird'),
		Button							= require('../../../../ui/button/button'),
		If								= require('../../../../ui/if/if');

const	SavingPlayerChangesPopup		= require('../../events/saving_player_changes_popup/saving_player_changes_popup'),
		Manager							= require('../../../../ui/managers/manager');

const	TeamHelper						= require('../../../../ui/managers/helpers/team_helper'),
		ManagerHelper					= require('../../../../ui/managers/helpers/manager_helper'),
		SavingEventHelper				= require('../../../../helpers/saving_event_helper'),
		MoreartyHelper					= require('../../../../helpers/morearty_helper'),
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
        .then(() => {
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

			self.addListeners();
        });
    },
	addListeners: function() {
		this.addListenerForTeamManager();
	},
	addListenerForTeamManager: function() {
		const binding = this.getDefaultBinding();

		binding
			.sub(`isSync`)
			.addListener(eventDescriptor => {
				// Lock submit button if team manager in searching state.
				eventDescriptor.getCurrentValue() && binding.set('isTeamManagerSync', true);

				// Unlock submit button if team manager in searching state.
				!eventDescriptor.getCurrentValue() && binding.set('isTeamManagerSync', false);
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

		const	event			= binding.toJS('model'),
				teamWrappers	= this.getTeamWrappers(),
				validationData	= [
					binding.toJS('error.0'),
					binding.toJS('error.1')
				];

		// if true - then user click to finish button
		// so we shouldn't do anything
		if(
			binding.toJS('isTeamManagerSync') &&
			!binding.toJS('isSubmitProcessing') &&
			TeamHelper.isTeamDataCorrect(event, validationData)
		) {
			switch (true) {
				case (
						TeamHelper.isTeamSport(event) &&
						!SavingPlayerChangesPopupHelper.isAnyTeamChanged(event, teamWrappers) &&
						SavingPlayerChangesPopupHelper.isUserCreateNewTeam(event, teamWrappers)
				):
					this.showSavingChangesModePopup();
					break;
				case (
						TeamHelper.isTeamSport(event) &&
						SavingPlayerChangesPopupHelper.isAnyTeamChanged(event, teamWrappers) &&
						!SavingPlayerChangesPopupHelper.isUserCreateNewTeam(event, teamWrappers)
				):
					this.showSavingChangesModePopup();
					break;
				case (
						TeamHelper.isTeamSport(event) &&
						SavingPlayerChangesPopupHelper.isAnyTeamChanged(event, teamWrappers) &&
						SavingPlayerChangesPopupHelper.isUserCreateNewTeam(event, teamWrappers)
				):
					this.showSavingChangesModePopup();
					break;
				case (
						TeamHelper.isTeamSport(event) &&
						!SavingPlayerChangesPopupHelper.isAnyTeamChanged(event, teamWrappers) &&
						!SavingPlayerChangesPopupHelper.isUserCreateNewTeam(event, teamWrappers)
				):
					binding.set('isSubmitProcessing', true);
					this._submit();
					break;
				case TeamHelper.isNonTeamSport(event):
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

		if(!!binding.get('sync')) {
			return (
				<div className="bInviteAccept">
					<div className="bTeamManagerWrapper">
						<Manager	isInviteMode	= {true}
									binding			= {managerBinding}
						/>
						<div className="eTeamManagerWrapper_footer">
							<Button	text				= "Accept"
									onClick				= {this.onClickAccept}
									extraStyleClasses	= {'mButton_leftSidePosition'}
							/>
						</div>
					</div>
					<SavingPlayerChangesPopup	binding	= {binding}
												submit	= {() => this._submit()}
					/>
				</div>
			);
		} else {
			return null;
		}

    }
});

module.exports = InviteAcceptView;