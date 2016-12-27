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
	/**
	 * Load all invites of provided type and return as array
	 * @param {string} schoolId
	 * @param {string} inviteType one of inbox|outbox|archive
	 * @returns {Promise.<Array.<Invite>>}
	 */
	loadData: function (schoolId, inviteType) {
		const 	serviceName	= this.inviteServicesByType[inviteType],
				service		= window.Server[serviceName];

		return service.get(schoolId, {filter: {limit: 100}}).then(invites => {
			return invites.map( invite => {
				invite.sport 			= invite.event.sport;
				invite.inviterSchool 	= invite.event.inviterSchool;
				invite.invitedSchool 	= invite.event.invitedSchools[0];
				return invite;
			});
		}).then(invites => {
			// sorting invites by time of event start not event emission
			return invites.sort((a, b) => {
				const 	_a	= a.event.startTime,
						_b	= b.event.startTime;

				if (_a < _b) {
					return -1;
				}
				if (_a > _b) {
					return 1;
				}
				return 0;
			});
		});
	},
	declineInvite: function (schoolId, inviteId, binding) {
		window.Server.declineSchoolInvite.post({
			schoolId: schoolId, inviteId: inviteId
		}).then(() => {
			const 	invites = binding.toJS('models'),
					newList = invites.filter(i => i.id !== inviteId);

			binding.set('models', Immutable.fromJS(newList));
		});
	}
};

module.exports = InviteActions;