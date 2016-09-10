const	If				= require('module/ui/if/if'),
		InvitesMixin	= require('module/as_manager/pages/invites/mixins/invites_mixin'),
		React			= require('react'),
		Immutable		= require('immutable'),
		MoreartyHelper	= require('module/helpers/morearty_helper'),
		EventHelper		= require('module/helpers/eventHelper'),
		TeamHelper		= require('module/ui/managers/helpers/team_helper'),
		Morearty		= require('morearty'),
		SVG 			= require('module/ui/svg');

const EventButtons = React.createClass({
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
			.then(() => self.submitHouseResults(event))
			.then(() => self.submitTeamResults(event))
			.then(() => self.submitIndividualResults(event))
			.then(() => self.submitIndividualPerformance(event))
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
			.then(() => self.submitSchoolResults(event))
			.then(() => self.submitHouseResults(event))
			.then(() => self.submitIndividualResults(event))
			.then(() => self.submitIndividualPerformance(event))
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
				if(TeamHelper.isOneOnOneSport(event)) {
					body[0].isWinner = event.results.schoolScore[0].score > event.results.individualScore[0].score ? true : false;
				} else {
					body[0].isWinner = event.results.schoolScore[0].score > event.results.teamScore[0].score ? true : false;
				}
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
				if(TeamHelper.isOneOnOneSport(event)) {
					body[0].isWinner = event.results.houseScore[0].score > event.results.individualScore[0].score ? true : false;
				} else {
					body[0].isWinner = event.results.houseScore[0].score > event.results.teamScore[0].score ? true : false;
				}
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
			return Promise.all(body.map(scoreData => window.Server.schoolEventResultHousesScore.post({ schoolId: activeSchoolId, eventId: event.id }, scoreData)));
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
				const opponentScore = (event.results.schoolScore && event.results.schoolScore.length) ?
					event.results.schoolScore[0].score :
					event.results.houseScore[0].score;

				body[0].isWinner = opponentScore > event.results.teamScore[0].score;
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

		if(TeamHelper.isOneOnOneSport(event)) {
			if(event.results.individualScore.length === 1 && EventHelper.isInterSchoolsEvent(event)) {
				event.results.individualScore[0].isWinner = event.results.individualScore[0].score > event.results.schoolScore[0].score;
			} else if(event.results.individualScore.length === 1 && EventHelper.isHousesEvent(event)) {
				event.results.individualScore[0].isWinner = event.results.individualScore[0].score > event.results.houseScore[0].score;
			} else if(event.results.individualScore.length === 2) {
				event.results.individualScore[0].isWinner = event.results.individualScore[0].score > event.results.individualScore[1].score;
				event.results.individualScore[1].isWinner = event.results.individualScore[1].score > event.results.individualScore[0].score;
			}
		}

		console.log(event.results.individualScore);
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
	submitIndividualPerformance: function(event) {
		const self = this;

		const activeSchoolId = MoreartyHelper.getActiveSchoolId(self);

		return Promise.all(
			event.results.individualPerformance.map(
				individualPerformanceData => window.Server.schoolEventIndividualPerformance.post(
					{
						schoolId:	activeSchoolId,
						eventId:	event.id
					},
					individualPerformanceData
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
					self.changeTeamNames()
						.then(() => self.commitPlayers())
						.then(() => self.doAfterCommitActions());
				}
				break;
		}
	},
	changeTeamNames: function() {
		const	self	= this,
				binding	= self.getDefaultBinding();

		const event = binding.toJS('model');

		let promises = [];

		if(!TeamHelper.isNonTeamSport(event)) {
			if(!self.isSetTeamLaterByOrder(0) && !self.isTeamChangedByOrder(0) && self.isNameTeamChangedByOrder(0)) {
				promises = promises.concat(TeamHelper.updateTeam(
					MoreartyHelper.getActiveSchoolId(self),
					binding.toJS(`teamManagerWrapper.default.teamModeView.teamWrapper.${0}.selectedTeamId`),
					{
						name: binding.toJS(`teamManagerWrapper.default.teamModeView.teamWrapper.${0}.teamName.name`)
					}
				));
			}

			if(!EventHelper.isInterSchoolsEvent(event) && !self.isSetTeamLaterByOrder(1) && !self.isTeamChangedByOrder(1) && self.isNameTeamChangedByOrder(1)) {
				promises = promises.concat(TeamHelper.updateTeam(
					MoreartyHelper.getActiveSchoolId(self),
					binding.toJS(`teamManagerWrapper.default.teamModeView.teamWrapper.${1}.selectedTeamId`),
					{
						name: binding.toJS(`teamManagerWrapper.default.teamModeView.teamWrapper.${1}.teamName.name`)
					}
				));
			}
		}

		return Promise.all(promises);
	},
	isNameTeamChangedByOrder: function(order) {
		const	self	= this,
				binding	= self.getDefaultBinding();

		return binding.toJS(`teamManagerWrapper.default.teamModeView.teamWrapper.${order}.teamName.initName`) !== binding.toJS(`teamManagerWrapper.default.teamModeView.teamWrapper.${order}.teamName.name`);
	},
	getValidationData: function() {
		const	self	= this,
				binding	= self.getDefaultBinding();

		const event = binding.toJS('model');

		if(EventHelper.isInterSchoolsEvent(event)) {
			return [
				binding.toJS('teamManagerWrapper.default.error.0')
			];
		} else {
			return [
				binding.toJS('teamManagerWrapper.default.error.0'),
				binding.toJS('teamManagerWrapper.default.error.1')
			];
		}
	},
	commitPlayers: function() {
		const	self	= this,
				binding	= self.getDefaultBinding();

		const event = binding.toJS('model');

		let promises = [];

		if(TeamHelper.isNonTeamSport(event)) {
			promises = promises.concat(self.commitIndividualPlayerChanges());
		} else {
			if(!self.isSetTeamLaterByOrder(0)) {
				if(self.isTeamChangedByOrder(0)) {
					promises = promises.concat(self.changeTeamByOrder(0));
				} else {
					promises = promises.concat(self.commitTeamPlayerChangesByOrder(0));
				}
			}

			if(!self.isSetTeamLaterByOrder(1)) {
				if(!EventHelper.isInterSchoolsEvent(event)) {
					if(self.isTeamChangedByOrder(1)) {
						promises = promises.concat(self.changeTeamByOrder(1));
					} else {
						promises = promises.concat(self.commitTeamPlayerChangesByOrder(1));
					}
				}
			}
		}

		return Promise.all(promises);
	},
	isSetTeamLaterByOrder: function(order) {
		const	self	= this,
				binding	= self.getDefaultBinding();

		return binding.toJS(`teamManagerWrapper.default.teamModeView.teamWrapper.${order}.isSetTeamLater`);
	},
	changeTeamByOrder: function(order) {
		const	self	= this,
				binding	= self.getDefaultBinding();

		return TeamHelper.createTeam(
			MoreartyHelper.getActiveSchoolId(self),
			binding.toJS('model'),
			binding.toJS(`teamManagerWrapper.default.rivals.${order}`),
			binding.toJS(`teamManagerWrapper.default.teamModeView.teamWrapper.${order}`)
		)
		.then(team => TeamHelper.addTeamsToEvent(
			MoreartyHelper.getActiveSchoolId(self),
			binding.toJS('model'),
			[team]
		))
		.then(() => {
			const prevPlayerId = binding.toJS(`teamManagerWrapper.default.teamModeView.teamWrapper.${order}.prevSelectedTeamId`);

			if(typeof prevPlayerId !== 'undefined') {
				return TeamHelper.deleteTeamFromEvent(
					MoreartyHelper.getActiveSchoolId(self),
					binding.toJS('model').id,
					prevPlayerId
				);
			} else {
				return Promise.resolve(true);
			}
		})
	},
	isTeamChangedByOrder: function(order) {
		const	self	= this,
				binding	= self.getDefaultBinding();

		return (
			// if selected team undefined then player create addHoc team
			typeof binding.toJS(`teamManagerWrapper.default.teamModeView.teamWrapper.${order}.selectedTeamId`) === 'undefined'||
			(
				binding.toJS(`teamManagerWrapper.default.teamModeView.teamWrapper.${order}.prevSelectedTeamId`) !==
				binding.toJS(`teamManagerWrapper.default.teamModeView.teamWrapper.${order}.selectedTeamId`)
			)
		);
	},
	commitIndividualPlayerChanges: function() {
		const	self	= this,
				binding	= self.getDefaultBinding();

		const event = binding.toJS('model');

		const	schoolId		= MoreartyHelper.getActiveSchoolId(self),
				eventId			= event.id,
				players			= self.getCommitPlayersForIndividualEvent(event),
				initialPlayers	= self.getInitPlayersForIndividualEvent(event);

		return Promise.all(TeamHelper.commitIndividualPlayers(schoolId, eventId, initialPlayers, players));
	},
	getInitPlayersForIndividualEvent: function(event) {
		const self = this;

		if(TeamHelper.isInternalEventForIndividualSport(event) || TeamHelper.isInterSchoolsEventForNonTeamSport(event)) {
			return self.getInitialTeamPlayersByOrder(0);
		} else {
			return self.getInitialTeamPlayersByOrder(0).concat(self.getInitialTeamPlayersByOrder(1));
		}
	},
	getCommitPlayersForIndividualEvent: function(event) {
		const self = this;

		if(TeamHelper.isInternalEventForIndividualSport(event) || TeamHelper.isInterSchoolsEventForNonTeamSport(event)) {
			return self.getTeamPlayersByOrder(0);
		} else {
			return self.getTeamPlayersByOrder(0).concat(self.getTeamPlayersByOrder(1));
		}
	},
	getTeamPlayersByOrder: function(order) {
		const	self	= this,
				binding	= self.getDefaultBinding();

		return binding.toJS(`teamManagerWrapper.default.teamModeView.teamWrapper.${order}.___teamManagerBinding.teamStudents`);
	},
	getInitialTeamPlayersByOrder: function(order) {
		const	self	= this,
				binding	= self.getDefaultBinding();

		return binding.toJS(`teamManagerWrapper.default.teamModeView.teamWrapper.${order}.prevPlayers`);
	},
	commitTeamPlayerChangesByOrder: function(order) {
		const	self			= this,
				binding			= self.getDefaultBinding(),
				activeSchoolId	= MoreartyHelper.getActiveSchoolId(self);

		const tw = binding.toJS(`teamManagerWrapper.default.teamModeView.teamWrapper.${order}`);

		return Promise.all(
				TeamHelper.commitPlayers(
					tw.prevPlayers,
					tw.___teamManagerBinding.teamStudents,
					tw.selectedTeamId,
					activeSchoolId
				)
			);
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
			//teamManagerBindings.forEach(teamManagerBinding => {
			//	teamManagerBinding.teamStudents	= initialTeamPlayers[teamManagerBinding.teamId];
			//	teamManagerBinding.isSync		= false;
			//});
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

		binding.set('mode', 'general');
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

module.exports = EventButtons;