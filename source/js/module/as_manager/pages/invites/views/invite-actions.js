/**
 * Created by Anatoly on 16.11.2016.
 */
const 	Promise 	= require('bluebird'),
		Immutable 	= require('immutable');

const InviteActions = {
	inviteServicesByType:{
		inbox:'schoolInboxInvites',
		outbox:'schoolOutboxInvites',
		archive:'schoolArchiveInvites'
	},
	loadData: function (schoolId, inviteType) {
		const serviceName = this.inviteServicesByType[inviteType],
			service = window.Server[serviceName];

		let invites, events;
		return service.get(schoolId, { filter: { limit: 100 }})
			.then( allInvites => {
				invites = allInvites;

				events = [];
				invites.forEach(inv =>{
					events.push(inv.eventId);
				});
				return window.Server.events.get(schoolId, {filter:{
					limit:1000,
					where:{
						id:{
							$in:events
						}
					}
				}});
			})
			.then(eventsData => {
				events = eventsData;

				invites = invites.map(invite =>{

					invite.event = events.find(e => e.id === invite.eventId);
					invite.sport = invite.event.sport;
					invite.inviterSchool = invite.event.inviterSchool;
					invite.invitedSchool = invite.event.invitedSchools[0];

					return invite;
				});

				return Promise.resolve(invites);
			})
			.then(invitesData => {
				invites = invitesData.sort((a,b) => {
					const _a = a.event.startTime,
						_b = b.event.startTime;

					if(_a < _b){
						return -1;
					}
					if(_a > _b){
						return 1;
					}
					return 0;
				});

				return Promise.resolve(invites);
			});
	},
	declineInvite:function (schoolId, inviteId, binding) {
		window.Server.declineSchoolInvite.post({schoolId: schoolId, inviteId: inviteId
		}).then( () => {
			const 	invites = binding.toJS('models'),
					newList = invites.filter(i => i.id !== inviteId);

			binding.set('models', Immutable.fromJS(newList));

		});
	}
};

module.exports = InviteActions;