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
		const	self	= this,
				binding	= self.getDefaultBinding(),
				points	= binding.toJS('points'),
				event	= binding.toJS('model');

		const activeSchoolId = MoreartyHelper.getActiveSchoolId(self);

		let updEvent;

		// finish event
		window.Server.finishSchoolEvent.post({
			schoolId:	activeSchoolId,
			eventId:	event.id
		})
		.then( _updEvent => {
			updEvent = _updEvent;

			// set comment
			return window.Server.schoolEventResult.put(
				{
					schoolId:	activeSchoolId,
					eventId:	event.id
				},
				{
					comment: binding.get('model.comment')
				}
			);
		})
		.then(result => {
			updEvent.result = result;

			// add points
			return Promise.all(
				points.map(point => {
					return window.Server.addPointToSchoolEventResult.post(
						{
							schoolId:	activeSchoolId,
							eventId:	event.id
						},
						{
							userId:	point.userId,
							score:	point.score,
							teamId:	point.teamId
						}
					);
				})
			);
		})
		// get event from server after adding points
		// because getting of event result faster than creating event result manually
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
		var self = this,
			binding = self.getDefaultBinding(),
			currentMode = binding.get('mode');

		if (currentMode === 'closing') {
			self.closeMatch();
		} else {
			// [[players][players]]
			const	teamPlayers			= [
											binding.toJS('eventTeams.editPlayers.teamManagerBindings.0.teamStudents'),
											binding.toJS('eventTeams.editPlayers.teamManagerBindings.1.teamStudents')
										],
					initialTeamPlayers	= binding.toJS('eventTeams.editPlayers.initialPlayers');

			const promises = teamPlayers.map(
				(players, teamIndex) => TeamHelper.commitPlayers(
					initialTeamPlayers[teamIndex],
					players,
					initialTeamPlayers[teamIndex][0].teamId, // yep, get teamId from player
					MoreartyHelper.getActiveSchoolId(self)
				)
			);

			Promise.all(promises[0].concat(promises[1]))
			.then((r) => {
				binding.atomically()
						.set('mode', 'general')
						.set('eventTeams.isSync', Immutable.fromJS(false))
						.commit();
			});
		}
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