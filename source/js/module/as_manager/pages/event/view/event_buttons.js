const   If              = require('module/ui/if/if'),
		InvitesMixin    = require('module/as_manager/pages/invites/mixins/invites_mixin'),
		classNames      = require('classnames'),
		React           = require('react'),
		Immutable       = require('immutable'),
		MoreartyHelper	= require('module/helpers/morearty_helper'),
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
		.then( result => {
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
		.then( _ => {
			binding
				.atomically()
				.set('model.result',	Immutable.fromJS({comment: updEvent.result.comment}))
				.set('model.status',	Immutable.fromJS(updEvent.status))
				.set('mode',			Immutable.fromJS('general'))
				.commit();

			return _;
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
		const	self			= this,
				binding			= self.getDefaultBinding(),
				rootBinding		= self.getMoreartyContext().getBinding(),
				isManager		= !!rootBinding.get('userRules.activeSchoolId'),
				closeClasses	= classNames({
					mClose:		true,
					mRed:		self.isEnableClose(),
					mDisable:	!self.isEnableClose()
				});
		return (
		<If condition={binding.get('model.status') === "NOT_FINISHED" && isManager}>
			<div className="bEventButtons">
				<If condition={binding.get('mode') === 'general'}>
					<div
						className="bEditButton"
						onClick={self.onClickReFormTeamMatch}
					>
						<SVG icon="icon_edit"/>Edit squad
					</div>
				</If>
				<If condition={binding.get('mode') === 'general'}>
					<div
						className={closeClasses}
						onClick={self.isEnableClose() ? self.onClickCloseMatch : null}
					>
						Close match <SVG icon="icon_close_match"/>
					</div>
				</If>
				<If condition={binding.get('mode') !== 'general'}>
					<div
						className="bButton"
						onClick={self.onClickOk}
					>
						Ok
					</div>
				</If>
				<If condition={binding.get('mode') === 'closing'}>
					<div
						className="bButton mRed"
						onClick={self.onClickCancel}
					>
						Cancel
					</div>
				</If>
			</div>
		</If>
		);
	}
});

module.exports = EventHeader;