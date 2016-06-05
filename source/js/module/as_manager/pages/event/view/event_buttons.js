const	If				= require('module/ui/if/if'),
		InvitesMixin	= require('module/as_manager/pages/invites/mixins/invites_mixin'),
		classNames		= require('classnames'),
		React			= require('react'),
		Immutable		= require('immutable'),
		MoreartyHelper	= require('module/helpers/morearty_helper'),
		EventHelper		= require('module/helpers/eventHelper'),
		RoleHelper		= require('module/helpers/role_helper'),
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
	isEnableClose: function () {
		var self = this,
			binding = self.getDefaultBinding();

		return binding.get('participants').count() > 1;
	},
	onClickReFormTeamMatch: function () {
		var self = this,
			binding = self.getDefaultBinding();

		binding.set('mode', 'edit_squad');
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
			binding.set('mode', 'general');
		}
	},
	onClickCancel: function () {
		var self = this,
			binding = self.getDefaultBinding();

		binding
			.atomically()
			.set('points', Immutable.List())
			.set('mode', 'general')
			.commit();
	},
	render: function() {
		const	self	= this,
				binding	= self.getDefaultBinding();

		const	isUserSchoolWorker	= RoleHelper.isUserSchoolWorker(self),
				closeClasses		= classNames({
					mClose:		true,
					mRed:		self.isEnableClose(),
					mDisable:	!self.isEnableClose()
				});

		return (
			<If condition={binding.get('model.status') === EventHelper.EVENT_STATUS.NOT_FINISHED && isUserSchoolWorker}>
				<div className="bEventButtons">
					<If condition={binding.get('mode') === 'general'}>
						<div
							className="bEditButton"
							onClick={self.onClickReFormTeamMatch}
						>
							<SVG icon="icon_edit"/>
						</div>
					</If>
					<If condition={binding.get('mode') === 'general'}>
						<div
							className={closeClasses}
							onClick={self.isEnableClose() ? self.onClickCloseMatch : null}
						>
							<SVG icon="icon_close_match"/>
						</div>
					</If>
					<If condition={binding.get('mode') === 'closing'}>
						<div
							className="bEventButton mCancel"
							onClick={self.onClickCancel}
						>
							Cancel
						</div>
					</If>
					<If condition={binding.get('mode') !== 'general'}>
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