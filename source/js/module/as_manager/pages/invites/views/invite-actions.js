/**
 * Created by Anatoly on 16.11.2016.
 */
const 	Promise 	= require('bluebird'),
		Immutable 	= require('immutable');

const InviteActions = {
	inviteServicesByType: {
		inbox:		'schoolInboxInvites',
		outbox:		'schoolOutboxInvites',
		archive:	'schoolArchiveInvites'
	},
	invitesCountOnPage: 5,
	invitesCountLimit: 5,
	/**
	 * Load all invites of provided type and return as array
	 * @param {string} schoolId
	 * @param {string} inviteType one of inbox|outbox|archive
	 * @returns {Promise.<Array.<Invite>>}
	 */
	loadData: function (page, schoolId, inviteType) {
		const 	serviceName	= this.inviteServicesByType[inviteType],
				service		= window.Server[serviceName];

		return service.get(schoolId,
			{
				filter: {
					skip: this.invitesCountOnPage * (page - 1),
					limit: this.invitesCountLimit,
					order: 'startTime DESC'
				}
			}
			).then(invites => {
			return invites.map( invite => {
				invite.sport			= invite.event.sport;
				invite.inviterSchool	= invite.event.inviterSchool;
				invite.invitedSchool	= invite.event.invitedSchools.find(s => s.id === invite.invitedSchoolId);

				return invite;
			}).filter(invite => typeof invite.invitedSchool !== 'undefined');
		}).then(_invites => {
			let invites;
			if(inviteType === 'outbox') {
				invites = _invites.filter(i => i.invitedSchool.name !== 'TBD');
			} else {
				invites = _invites;
			}

			return invites;
		});
	},
	declineInvite: function (schoolId, inviteId, binding, commentText) {
		return window.Server.declineSchoolInvite.post({
			schoolId: schoolId,
			inviteId: inviteId
		})
		.then(() => {
			const	invites = binding.toJS('models'),
					newList = invites.filter(i => i.id !== inviteId);

			binding.set('models', Immutable.fromJS(newList));
			return window.Server.schoolInviteComments.post(
				{
					schoolId: schoolId,
					inviteId: inviteId
				}, {
					text: "Rejected by opponent. " + commentText
				}
			)
		});
	}
};

module.exports = InviteActions;