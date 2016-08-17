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
				binding		= self.getDefaultBinding(),
				points		= binding.toJS('points'),
				event		= binding.toJS('model'),
				teamsData	= binding.toJS('teamsData');

		const activeSchoolId = MoreartyHelper.getActiveSchoolId(self);

		window.Server.finishSchoolEvent.post({
			schoolId:	activeSchoolId,
			eventId:	event.id
		})
		.then(() => {
			const body = event.results.teamScore.map(t => {
				return {
					teamId:	t.teamId,
					score:	t.score
				};
			});

			if(body.length < 2 ) {
				const index = teamsData.findIndex(t => t.teamId !== body[0].teamId);
				body.push({
					teamId:	teamsData[index].id,
					score:	0
				});
			}

			if(body[0].score > body[1].score) {
				body[0].isWinner = true;
				body[1].isWinner = false;
			} else if(body[0].score < body[1].score) {
				body[0].isWinner = false;
				body[1].isWinner = true;
			}

			return Promise.all(body.map(teamScoreData => window.Server.schoolEventResultTeamScore.post({ schoolId: activeSchoolId, eventId: event.id }, teamScoreData)));
		})
		.then(_ => {
			return Promise.all(
				event.results.individualScore.map(
					individualScoreData => window.Server.schoolEventResultIndividualsScore.post(
						{
							schoolId: activeSchoolId,
							eventId: event.id
						},
						individualScoreData
					)
				)
			);
		})
		.then(_ => window.Server.schoolEvent.get( { schoolId: activeSchoolId, eventId: event.id } ) )
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

		const currentMode = binding.get('mode');

		if(currentMode === 'closing') {
			self.closeMatch();
		} else {
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
				.then(() => {
					binding.atomically()
							.set('mode', 'general')
							.set('eventTeams.isSync', Immutable.fromJS(false))
							.commit();
				});
		}
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
				teamsForCommit[teamManagerBinding.teamId] = teamManagerBinding.teamStudents;
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

		teamManagerBindings.forEach(teamManagerBinding => {
			teamManagerBinding.teamStudents	= initialTeamPlayers[teamManagerBinding.teamId];
			teamManagerBinding.isSync		= false;
		});

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
					<If condition={EventHelper._isShowCloseEventButton(self)}>
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