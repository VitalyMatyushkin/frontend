const	React							= require('react'),
		Morearty						= require('morearty'),
		Immutable						= require('immutable'),
		debounce						= require('debounce');

const	Promise							= require('bluebird'),
		classNames						= require('classnames'),
		{Button}						= require('../../../../ui/button/button');

const	SavingPlayerChangesPopup		= require('../../events/saving_player_changes_popup/saving_player_changes_popup'),
		Manager							= require('../../../../ui/managers/manager');

const	EventHelper							= require('module/helpers/eventHelper'),
		TeamHelper							= require('../../../../ui/managers/helpers/team_helper'),
		SavingEventHelper					= require('../../../../helpers/saving_event_helper'),
		{ ManagerTypes }					= require('module/ui/managers/helpers/manager_types'),
		{ PlayerChoosersTabsModelFactory }	= require('module/helpers/player_choosers_tabs_models_factory'),
		SavingPlayerChangesPopupHelper		= require('../../events/saving_player_changes_popup/helper'),
		{ TeamManagerActions }				= require('module/helpers/actions/team_manager_actions');

const	InterSchoolsRivalModel			= require('module/ui/managers/rival_chooser/models/inter_schools_rival_model');

const InviteAcceptView = React.createClass({
    mixins: [Morearty.Mixin],
	propTypes: {
		activeSchoolId: React.PropTypes.string.isRequired
	},
	playerChoosersTabsModel: undefined,
	teamManagerActions: undefined,
    display: 'InviteAccept',
	// debounce decorator for changeControlButtonState func
	onDebounceChangeControlButtonState: undefined,
	/**
	 * Function check manager data and set corresponding value to isControlButtonActive
	 */
	changeControlButtonState: function() {
		const	self	= this,
				binding	= self.getDefaultBinding();

		binding.set('isControlButtonActive', this.isControlButtonActive());
	},
    componentWillMount: function () {
        var self = this,
            rootBinding = self.getMoreartyContext().getBinding(),
            binding = self.getDefaultBinding(),
            inviteId = rootBinding.get('routing.pathParameters.0');

		this.initPlayerChoosersTabsModel();
		this.initTeamManagerActions();

        binding.clear();
		binding.set('isSavingChangesModePopupOpen', false);
        let invite;
        window.Server.schoolInvite.get({schoolId: this.props.activeSchoolId, inviteId: inviteId})
			.then(_invite => {
				invite = _invite;

				return window.Server.school.get(this.props.activeSchoolId)
				.then(currentSchool => {
					invite.invitedSchool = currentSchool;

					return window.Server.schoolForms.get(this.props.activeSchoolId, {filter:{limit:1000}}).then(forms => currentSchool.forms = forms);
				})
				.then(_ => {
					return window.Server.schoolEvent.get({schoolId: this.props.activeSchoolId, eventId: invite.eventId});
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
					.set('rivals', Immutable.fromJS(this.createRivalsByInvite(invite)))
					.set('sync', true)
					.set('schoolInfo', Immutable.fromJS(invite.invitedSchool))
					.set('isControlButtonActive', false)
					.set('error', Immutable.fromJS([]))
					.commit();

				// create debounce decorator for changeControlButtonState func
				this.onDebounceChangeControlButtonState = debounce(this.changeControlButtonState, 200);

				self.addListeners();
			});
    },
	initPlayerChoosersTabsModel: function () {
		this.playerChoosersTabsModel = PlayerChoosersTabsModelFactory.createTabsModelByManagerType(
			ManagerTypes.Default
		);
	},
	initTeamManagerActions: function () {
		this.teamManagerActions = new TeamManagerActions( {schoolId: this.props.activeSchoolId} );
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
	triggerMsgCountUpdater: function () {
		this.getMoreartyContext().getBinding().set('isInvitesCountNeedUpdate', true);
	},
	createRivalsByInvite: function(invite) {
		return [
			new InterSchoolsRivalModel(invite.invitedSchool)
		];
	},
	showSavingChangesModePopup: function() {
		this.getDefaultBinding().set('isSavingChangesModePopupOpen', true);
	},
    onClickAccept: function () {
		const	self	= this,
				binding	= self.getDefaultBinding();

		const	event			= binding.toJS('model'),
				teamWrappers	= this.getTeamWrappers();

		// if true - then user click to finish button
		// so we shouldn't do anything
		if(this.isControlButtonActive()) {
			switch (true) {
				case (
						TeamHelper.isTeamSport(event) &&
						!SavingPlayerChangesPopupHelper.isAnyTeamChanged(event, teamWrappers) &&
						SavingPlayerChangesPopupHelper.isUserCreateNewTeam(event, teamWrappers, this.props.activeSchoolId)
				):
					this.showSavingChangesModePopup();
					break;
				case (
						TeamHelper.isTeamSport(event) &&
						SavingPlayerChangesPopupHelper.isAnyTeamChanged(event, teamWrappers) &&
						!SavingPlayerChangesPopupHelper.isUserCreateNewTeam(event, teamWrappers, this.props.activeSchoolId)
				):
					this.showSavingChangesModePopup();
					break;
				case (
						TeamHelper.isTeamSport(event) &&
						SavingPlayerChangesPopupHelper.isAnyTeamChanged(event, teamWrappers) &&
						SavingPlayerChangesPopupHelper.isUserCreateNewTeam(event, teamWrappers, this.props.activeSchoolId)
				):
					this.showSavingChangesModePopup();
					break;
				case (
						TeamHelper.isTeamSport(event) &&
						!SavingPlayerChangesPopupHelper.isAnyTeamChanged(event, teamWrappers) &&
						!SavingPlayerChangesPopupHelper.isUserCreateNewTeam(event, teamWrappers, this.props.activeSchoolId)
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
	removeAcceptedInvite: function(inviteId) {
		const	modelsBinding	= this.getBinding().models,
				models			= modelsBinding.toJS();

		const acceptedInviteIndex = models.findIndex(m => m.id === inviteId);

		if(acceptedInviteIndex !== -1) {
			models.splice(acceptedInviteIndex, 1);

			modelsBinding.set(Immutable.fromJS(models));
		}
	},
    _submit: function() {
        const   self    = this,
                binding = self.getDefaultBinding();

        const event = binding.toJS('model');

        if(TeamHelper.isNonTeamSport(event)) {
            // add new individuals
            TeamHelper.addIndividualPlayersToEvent(
					this.props.activeSchoolId,
	                event,
	                binding.toJS(`teamModeView.teamWrapper`
	            ))
	            // accept invite
	            .then(() => window.Server.acceptSchoolInvite.post({
	                    schoolId: this.props.activeSchoolId,
	                    inviteId: binding.get('invite.id')
	                })
	            )
	            .then(() => {
					this.removeAcceptedInvite(binding.get('invite.id'));
	                this.triggerMsgCountUpdater();
	                document.location.hash = '#event/' + event.id;

	                return true;
	            });
        } else {
			const	activeSchoolId	= this.props.activeSchoolId,
					rivals			= binding.toJS(`rivals`),
					model			= binding.toJS('model'),
					teamWrapper		= binding.toJS(`teamModeView.teamWrapper`);

			return SavingEventHelper.processSavingChangesMode(activeSchoolId, rivals, model, teamWrapper)
				.then(() => {
					const teams = TeamHelper.createTeams(activeSchoolId, model, rivals, teamWrapper);

					return Promise.all(
						TeamHelper.addTeamsToEvent(
							this.props.activeSchoolId,
							event.id,
							teams
						)
					);
				})
                // accept invite
                .then(() => window.Server.acceptSchoolInvite.post({
                        schoolId: activeSchoolId,
                        inviteId: binding.get('invite.id')
                    })
                )
                .then(() => {
					this.removeAcceptedInvite(binding.get('invite.id'));
	                this.triggerMsgCountUpdater();
                    document.location.hash = '#event/' + event.id;

                    return true;
                });
        }
    },
	isControlButtonActive: function() {
		const	binding			= this.getDefaultBinding();

		const	validationData	= binding.toJS('error');

		if(
			binding.toJS('isTeamManagerSync') &&
			!binding.toJS('isSubmitProcessing') &&
			TeamHelper.isTeamDataCorrect(validationData)
		) {
			return true;
		} else {
			return false;
		}
	},
	checkControlButtonState: function() {
		const binding = this.getDefaultBinding();

		if(binding.toJS('isControlButtonActive') !== this.isControlButtonActive()) {
			typeof this.onDebounceChangeControlButtonState !== 'undefined' && this.onDebounceChangeControlButtonState();
		}
	},

	getSaveButtonStyleClass: function() {
		return classNames({
			'mButton_leftSidePosition'	: true,
			'mDisable'			: !this.getDefaultBinding().toJS('isControlButtonActive')
		});
	},
	renderManager: function() {
		const	binding			= this.getDefaultBinding(),
				event			= binding.toJS('model'),
				managerBinding	= {
					default:	binding,
					rivals:		binding.sub('rivals'),
					players:	binding.sub('players'),
					error:		binding.sub('error')
				};

		let isShowRivals = false;
		if(EventHelper.isInterSchoolsEvent(event) && TeamHelper.isMultiparty(event)) {
			isShowRivals = true;
		}

		return (
			<Manager
				activeSchoolId			= { this.props.activeSchoolId }
				isShowRivals			= { isShowRivals }
				isInviteMode			= { true }
				isShowAddTeamButton		= { false }
				selectedRivalIndex		= { 0 }
				binding					= { managerBinding }
				playerChoosersTabsModel = { this.playerChoosersTabsModel }
				actions					= { this.teamManagerActions }
			/>
		);
	},
    render: function() {
		var	self	= this,
			binding	= self.getDefaultBinding();

		if(!!binding.get('sync')) {
			// check control button state
			// and if state was changed then call debounce decorator for changeControlButtonState
			this.checkControlButtonState();

			return (
				<div className="bInviteAccept">
					<div className="bTeamManagerWrapper">
						{ this.renderManager() }
						<div className="eTeamManagerWrapper_footer">
							<Button
								text				= "Accept"
								onClick				= {this.onClickAccept}
								extraStyleClasses	= {this.getSaveButtonStyleClass()}
							/>
						</div>
					</div>
					<SavingPlayerChangesPopup	binding			= { binding }
												activeSchoolId	= { this.props.activeSchoolId }
												submit			= { () => this._submit() }
					/>
				</div>
			);
		} else {
			return null;
		}

    }
});

module.exports = InviteAcceptView;