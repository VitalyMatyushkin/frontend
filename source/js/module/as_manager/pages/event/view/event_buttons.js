const	If				= require('module/ui/if/if'),
		InvitesMixin	= require('module/as_manager/pages/invites/mixins/invites_mixin'),
		React			= require('react'),
		Immutable		= require('immutable'),
		MoreartyHelper	= require('module/helpers/morearty_helper'),
		EventHelper		= require('module/helpers/eventHelper'),
		TeamHelper		= require('module/ui/managers/helpers/team_helper'),
		Morearty		= require('morearty'),
		SVG 			= require('module/ui/svg');

const EventHeader = React.createClass({
	mixins: [Morearty.Mixin, InvitesMixin],
	displayName: 'EventButtons',
	closeMatch: function () {
		const	self		= this,
				binding		= self.getDefaultBinding();

		const event = binding.toJS('model');

		if(TeamHelper.isNonTeamSport(event)) {
			self.closeMatchForIndividualSport();
		} else {
			self.closeMatchForTeamsSport();
		}
	},
	closeMatchForTeamsSport: function() {
		const	self	= this,
				binding	= self.getDefaultBinding();

		const event = binding.toJS('model');

		const activeSchoolId = MoreartyHelper.getActiveSchoolId(self);

		window.Server.finishSchoolEvent.post({
				schoolId:	activeSchoolId,
				eventId:	event.id
			})
			.then(() => self.submitSchoolResults(event))
			//.then(() => self.submitHouseResults(event))
			.then(() => self.submitTeamResults(event))
			.then(() => self.submitIndividualResults(event))
			.then(() => self.doActionsAfterCloseEvent());
	},
	closeMatchForIndividualSport: function() {
		const	self	= this,
				binding	= self.getDefaultBinding();

		const event = binding.toJS('model');

		const activeSchoolId = MoreartyHelper.getActiveSchoolId(self);

		window.Server.finishSchoolEvent.post({
				schoolId:	activeSchoolId,
				eventId:	event.id
			})
			.then(() => self.submitIndividualResults(event))
			.then(() => self.doActionsAfterCloseEvent());
	},
	submitSchoolResults: function(event) {
		const self = this;

		const activeSchoolId = MoreartyHelper.getActiveSchoolId(self);

		const body = event.results.schoolScore.map(s => {
			return {
				schoolId:	s.schoolId,
				score:		s.score
			};
		});

		switch (true) {
			case body.length === 1:
				body[0].isWinner = event.results.schoolScore[0].score > event.results.teamScore[0].score ? true : false;
				break;
			case body.length === 2:
				switch (true) {
					case body[0].score > body[1].score:
						body[0].isWinner = true;
						body[1].isWinner = false;
						break;
					case body[0].score < body[1].score:
						body[0].isWinner = false;
						body[1].isWinner = true;
						break;
				}
				break;
		}

		if(body.length !== 0) {
			return Promise.all(body.map(scoreData => window.Server.schoolEventResultSchoolScore.post({ schoolId: activeSchoolId, eventId: event.id }, scoreData)));
		} else {
			return Promise.resolve(true);
		}
	},
	submitHouseResults: function(event) {
		const self = this;

		const activeSchoolId = MoreartyHelper.getActiveSchoolId(self);

		const body = event.results.houseScore.map(h => {
			return {
				houseId:	h.houseId,
				score:		h.score
			};
		});

		switch (true) {
			case body.length === 1:
				body[0].isWinner = event.results.schoolScore[0].score > event.results.teamScore[0].score ? true : false;
				break;
			case body.length === 2:
				switch (true) {
					case body[0].score > body[1].score:
						body[0].isWinner = true;
						body[1].isWinner = false;
						break;
					case body[0].score < body[1].score:
						body[0].isWinner = false;
						body[1].isWinner = true;
						break;
				}
				break;
		}

		if(body.length !== 0) {
			//return Promise.all(body.map(scoreData => window.Server.schoolEventResultTeamScore.post({ schoolId: activeSchoolId, eventId: event.id }, scoreData)));
			console.log(body);
			return Promise.resolve(true);
		} else {
			return Promise.resolve(true);
		}
	},
	submitTeamResults: function(event) {
		const self = this;

		const activeSchoolId = MoreartyHelper.getActiveSchoolId(self);

		const body = event.results.teamScore.map(t => {
			return {
				teamId:	t.teamId,
				score:	t.score
			};
		});

		switch (true) {
			case body.length === 1:
				body[0].isWinner = event.results.schoolScore[0].score > event.results.teamScore[0].score ? true : false;
				break;
			case body.length === 2:
				switch (true) {
					case body[0].score > body[1].score:
						body[0].isWinner = true;
						body[1].isWinner = false;
						break;
					case body[0].score < body[1].score:
						body[0].isWinner = false;
						body[1].isWinner = true;
						break;
				}
				break;
		}

		if(body.length !== 0) {
			return Promise.all(body.map(scoreData => window.Server.schoolEventResultTeamScore.post({ schoolId: activeSchoolId, eventId: event.id }, scoreData)));
		} else {
			return Promise.resolve(true);
		}
	},
	submitIndividualResults: function(event) {
		const self = this;

		const activeSchoolId = MoreartyHelper.getActiveSchoolId(self);

		return Promise.all(
			event.results.individualScore.map(
				individualScoreData => window.Server.schoolEventResultIndividualsScore.post(
					{
						schoolId:	activeSchoolId,
						eventId:	event.id
					},
					individualScoreData
				)
			)
		);
	},
	/**
	 * Get updated event from server
	 * And update result and status
	 * Also got event editing page to GENERAL mode
	 */
	doActionsAfterCloseEvent: function() {
		const	self	= this,
				binding	= self.getDefaultBinding();

		const	event			= binding.toJS('model'),
				activeSchoolId	= MoreartyHelper.getActiveSchoolId(self);

		return window.Server.schoolEvent.get( { schoolId: activeSchoolId, eventId: event.id } )
			.then(event => {
				binding
					.atomically()
					.set('model.result',	Immutable.fromJS(event.result))
					.set('model.status',	Immutable.fromJS(event.status))
					.set('mode',			Immutable.fromJS('general'))
					.commit();

				// yep i'm always true
				return true;
			});
	},
	isOwner: function () {
		var self = this,
			binding = self.getDefaultBinding(),
			userId = self.getMoreartyContext().getBinding().get('userData.authorizationInfo.userId'),
			ownerId = binding.get('participants.0.school.ownerId'),
			verifiedUser = self.getMoreartyContext().getBinding().get('userData.userInfo.verified');
		return (userId === ownerId || (verifiedUser.get('email') && verifiedUser.get('phone') && verifiedUser.get('personal')));
	},
	onClickCloseMatch: function () {
		var self = this,
			binding = self.getDefaultBinding();

		binding.set('mode', 'closing');
	},
	onClickOk: function () {
		const	self	= this,
				binding	= self.getDefaultBinding();

		const currentMode	= binding.get('mode');

		switch (currentMode) {
			case 'closing':
				self.closeMatch();
				break;
			default:
				const event = binding.toJS('model');

				if(TeamHelper.isTeamDataCorrect(event, self.getValidationData())) {
					self.commitPlayers();
				}
				break;
		}
	},
	getValidationData: function() {
		const	self	= this,
				binding	= self.getDefaultBinding();

		return [
			binding.toJS('eventTeams.editPlayers.validationData.0'),
			binding.toJS('eventTeams.editPlayers.validationData.1')
		];
	},
	commitPlayers: function() {
		const	self	= this,
				binding	= self.getDefaultBinding();

		const event = binding.toJS('model');

		if(TeamHelper.isNonTeamSport(event)) {
			self.commitIndividualPlayerChanges();
		} else {
			self.commitTeamPlayerChanges();
		}
	},
	commitIndividualPlayerChanges: function() {
		const	self	= this,
				binding	= self.getDefaultBinding();

		const event = binding.toJS('model');

		const	schoolId		= MoreartyHelper.getActiveSchoolId(self),
				eventId			= event.id,
				players			= self.getCommitPlayersForIndividualEvent(event),
				initialPlayers	= binding.toJS('eventTeams.editPlayers.initialPlayers');

		Promise.all(TeamHelper.commitIndividualPlayers(schoolId, eventId, initialPlayers, players)).then(() => self.doAfterCommitActions());
	},
	getCommitPlayersForIndividualEvent: function(event) {
		const	self	= this,
				binding	= self.getDefaultBinding();

		if(TeamHelper.isInternalEventForIndividualSport(event)) {
			return binding.toJS('eventTeams.editPlayers.teamManagerBindings.0.teamStudents');
		} else {
			return binding.toJS('eventTeams.editPlayers.teamManagerBindings.0.teamStudents')
				.concat(binding.toJS('eventTeams.editPlayers.teamManagerBindings.1.teamStudents'));
		}
	},
	commitTeamPlayerChanges: function() {
		const	self	= this,
				binding	= self.getDefaultBinding();

		const	teamPlayers			= self.getTeamsPlayersForCommit(binding.toJS('model')),
				initialTeamPlayers	= binding.toJS('eventTeams.editPlayers.initialPlayers'),
				activeSchoolId		= MoreartyHelper.getActiveSchoolId(self);

		let commitPlayersPromises = [];

		Object.keys(teamPlayers).forEach(teamId => {
			commitPlayersPromises = commitPlayersPromises.concat(
				TeamHelper.commitPlayers(
					initialTeamPlayers[teamId],
					teamPlayers[teamId],
					teamId,
					activeSchoolId
				)
			)
		});

		Promise.all(commitPlayersPromises)
			.then(() => self.doAfterCommitActions());
	},
	doAfterCommitActions: function() {
		const	self	= this,
				binding	= self.getDefaultBinding();

		binding.atomically()
			.set('mode', 'general')
			.set('eventTeams.isSync', Immutable.fromJS(false))
			.commit();
	},
	/**
	 * Return player changes for commit, hash map - key:teamId, value:players
	 * @param event
	 * @returns {*}
	 */
	getTeamsPlayersForCommit: function(event) {
		const	self			= this,
				binding			= self.getDefaultBinding(),
				activeSchoolId	= MoreartyHelper.getActiveSchoolId(self);

		const teamManagerBindings = binding.toJS('eventTeams.editPlayers.teamManagerBindings');

		const teamsForCommit = {};

		if(EventHelper.isInterSchoolsEvent(event)) {
			const	foundTeam				= event.teamsData.find(t => t.schoolId === activeSchoolId),
					foundTeamManagerBinding	= teamManagerBindings.find(teamManagerBinding => teamManagerBinding.teamId === foundTeam.id);

			teamsForCommit[foundTeamManagerBinding.teamId] = foundTeamManagerBinding.teamStudents;
		} else {
			teamManagerBindings.forEach(teamManagerBinding => {
				if(teamManagerBinding.teamId) {
					teamsForCommit[teamManagerBinding.teamId] = teamManagerBinding.teamStudents;
				}
			});
		}

		return teamsForCommit;
	},
	/**
	 * Return reverted team manager binding
	 * Use if user doesn't save changes
	 * @returns {*}
	 */
	getRevertedTeamManagerBindings: function() {
		const	self			= this,
				binding			= self.getDefaultBinding();

		const	teamManagerBindings	= binding.toJS('eventTeams.editPlayers.teamManagerBindings'),
				initialTeamPlayers	= binding.toJS('eventTeams.editPlayers.initialPlayers');

		const event = binding.toJS('model');

		if(TeamHelper.isNonTeamSport(event)) {
			teamManagerBindings[0].teamStudents = initialTeamPlayers;
		} else {
			teamManagerBindings.forEach(teamManagerBinding => {
				teamManagerBinding.teamStudents	= initialTeamPlayers[teamManagerBinding.teamId];
				teamManagerBinding.isSync		= false;
			});
		}

		return teamManagerBindings;
	},
	onClickCloseCancel: function () {
		const	self	= this,
				binding	= self.getDefaultBinding();

		binding
			.atomically()
			.set('points', Immutable.List())
			.set('mode', 'general')
			.commit();
	},
	onClickEditCancel: function () {
		const	self	= this,
				binding	= self.getDefaultBinding();

		binding.atomically()
			.set('eventTeams.editPlayers.teamManagerBindings', Immutable.fromJS(self.getRevertedTeamManagerBindings()))
			.set('mode', 'general')
			.commit();
	},
	render: function() {
		const self = this;

		return (
			<If condition={EventHelper._isShowEventButtons(self)}>
				<div className="bEventButtons">
					<If condition={TeamHelper.isShowCloseEventButton(self)}>
						<div
							className='mClose mRed'
							onClick={self.onClickCloseMatch}
						>
							<SVG icon="icon_close_match"/>
						</div>
					</If>
					<If condition={EventHelper._isShowCancelEventCloseButton(self)}>
						<div
							className="bEventButton mCancel"
							onClick={self.onClickCloseCancel}
						>
							Cancel
						</div>
					</If>
					<If condition={EventHelper._isShowCancelEventEditButton(self)}>
						<div
							className="bEventButton mCancel"
							onClick={self.onClickEditCancel}
						>
							Cancel
						</div>
					</If>
					<If condition={EventHelper._isShowFinishEventEditingButton(self)}>
						<div
								className="bEventButton"
								onClick={self.onClickOk}
						>
							Save
						</div>
					</If>
				</div>
			</If>
		);
	}
});

module.exports = EventHeader;