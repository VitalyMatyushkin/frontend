const 	ProcessingView 	= require('./processing'),
		InviteOutbox 	= require('./invite'),
		React 			= require('react'),
		InvitesMixin 	= require('../mixins/invites_mixin'),
		MoreartyHelper	= require('module/helpers/morearty_helper'),
		Immutable		= require('immutable');

const ArchiveView = React.createClass({
	mixins: [Morearty.Mixin, InvitesMixin],
	// ID of current school
	// Will set on componentWillMount event
	activeSchoolId: undefined,
    displayName: 'ArchiveView',
	getMergeStrategy: function () {
		return Morearty.MergeStrategy.MERGE_REPLACE;
	},
	getDefaultState: function () {
		return Immutable.fromJS({
			models: [],
			participants: [],
			sync: false
		});
	},
	componentWillMount: function () {
		var self = this,
			binding = self.getDefaultBinding();

		self.activeSchoolId = MoreartyHelper.getActiveSchoolId(self);

		let invites;

		// TODO Don't forget about filter
		//{
		//	filter: {
		//		where: {
		//			or: [
		//				{
		//					inviterId: activeSchoolId
		//				},
		//				{
		//					guestId: activeSchoolId
		//				}
		//			],
		//				accepted: {
		//				inq: [true, false]
		//			}
		//		},
		//		include: ['inviter', 'guest', {
		//			event: 'sport'
		//		}]
		//	}
		//}
		window.Server.schoolInvites.get(self.activeSchoolId, {
				filter: {
					limit: 100
				}
			})
			.then(function (_invites) {
				// About all invites - get all invites for our school.
				// Then filter accepted or decline invites
				invites = _invites.filter(invite => invite.accepted !== 'NOT_READY');

				// get info about current school
				return window.Server.school.get(self.activeSchoolId);
			})
			.then(activeSchool => {

				return Promise.all(
					invites.map(invite =>
						// inject schoolInfo to invite
						window.Server.publicSchool.get(
							// it all depends on whether the school is inviting active or not
							invite.inviterSchoolId !== self.activeSchoolId ? invite.inviterSchoolId : invite.invitedSchoolId
						)
							.then(otherSchool => {
								// it all depends on whether the school is inviting active or not
								invite.inviterSchool = invite.inviterSchoolId === self.activeSchoolId ? activeSchool : otherSchool;
								invite.invitedSchool = invite.invitedSchoolId === self.activeSchoolId ? activeSchool : otherSchool;

								// inject event to invite
								return window.Server.schoolEvent.get({schoolId: self.activeSchoolId, eventId: invite.eventId});
							})
							.then(event => {
								invite.event = event;

								// inject sport to invite
								return window.Server.sport.get(event.sportId).then(sport => {
									invite.sport = sport;

									return sport;
								})
							})
					)
				);
			})
			.then(_ => {

				binding
					.atomically()
					.set('sync', true)
					.set('models', Immutable.fromJS(invites))
					.commit();

				return invites;
			});
	},
	getInvites: function () {
		var self = this,
			binding = self.getDefaultBinding(),
			invites = binding.get('models');

		return invites.map(function (invite, index) {
			var inviteBinding = {
					default: binding.sub(['models', index]),
					inviterSchool: binding.sub(['models', index, 'inviterSchool']),
					invitedSchool: binding.sub(['models', index, 'invitedSchool'])
				};

			return <InviteOutbox binding={inviteBinding} />;
		}).toArray();
	},
	render: function() {
		var self = this,
			binding = self.getDefaultBinding(),
			invites = self.getInvites();

		return <div key="ArchiveView" className="eInvites_OutboxContainer">
			<div className="eSchoolMaster_wrap">
				<h1 className="eSchoolMaster_title">Archive</h1>
				<div className="eStrip">
				</div>
			</div>
			<div className="eInvites_filterPanel"></div>
			<div className="eInvites_list" key="ArchiveView_list">{invites && invites.length ? invites : 'You don\'t have invites'}</div>
		</div>;
	}
});


module.exports = ArchiveView;
