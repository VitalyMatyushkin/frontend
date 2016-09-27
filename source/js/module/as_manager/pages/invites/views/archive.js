const 	ProcessingView 	= require('./processing'),
		InviteOutbox 	= require('./invite'),
		React 			= require('react'),
		Promise 		= require('bluebird'),
		MoreartyHelper	= require('module/helpers/morearty_helper'),
		Morearty		= require('morearty'),
		Immutable		= require('immutable');

const ArchiveView = React.createClass({
	mixins: [Morearty.Mixin],
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
		const 	self 	= this,
				binding = self.getDefaultBinding();

		self.activeSchoolId = MoreartyHelper.getActiveSchoolId(self);

		let invites;

		window.Server.schoolArchiveInvites.get(self.activeSchoolId, { filter: { limit: 100 }})
			.then( archivedInvites => {
				invites = archivedInvites;
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
				invites = invites.sort((a,b) => {
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
				binding
					.atomically()
					.set('sync', true)
					.set('models', Immutable.fromJS(invites))
					.commit();

				return invites;
			});
	},
	getInvites: function () {
		const 	self 	= this,
				binding = self.getDefaultBinding(),
				invites = binding.get('models');

		return invites.map( (invite, index) => {
			var inviteBinding = {
					default: binding.sub(['models', index]),
					inviterSchool: binding.sub(['models', index, 'inviterSchool']),
					invitedSchool: binding.sub(['models', index, 'invitedSchool'])
				};

			return <InviteOutbox key={invite.get('id')} binding={inviteBinding} />;
		}).toArray();
	},
	render: function() {
		const 	self 	= this,
				binding = self.getDefaultBinding(),
				invites = self.getInvites();

		return (
			<div className="eInvites_OutboxContainer">
				<div className="eSchoolMaster_wrap">
					<h1 className="eSchoolMaster_title">Archive</h1>
					<div className="eStrip">
					</div>
				</div>
				<div className="eInvites_filterPanel"></div>
				<div className="eInvites_list" >{invites && invites.length ? invites : null}</div>
				<ProcessingView binding={binding} />
			</div>
		);
	}
});


module.exports = ArchiveView;
