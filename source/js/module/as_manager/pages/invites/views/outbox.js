const	ProcessingView 	= require('./processing'),
		Invite 			= require('./invite'),
		React 			= require('react'),
		Immutable 		= require('immutable'),
		MoreartyHelper	= require('module/helpers/morearty_helper'),
		InvitesMixin 	= require('../mixins/invites_mixin');

const OutboxView = React.createClass({
	mixins: [Morearty.Mixin, InvitesMixin],
	// ID of current school
	// Will set on componentWillMount event
	activeSchoolId: undefined,
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

		let outboxInvites;
		
		// TODO Don't forget about filter
		//{
		//	filter: {
		//		where: {
		//			inviterId: activeSchoolId,
		//				accepted: {
		//				nin: [true, false]
		//			}
		//		},
		//		include: [
		//			{
		//				inviter: ['forms', 'houses']
		//			},
		//			{
		//				event: 'sport'
		//			},
		//			{
		//				guest: ['forms', 'houses']
		//			}
		//		]
		//	}
		//}
		window.Server.schoolInvites.get(self.activeSchoolId, {
			filter: {
				limit: 100
			}
		})
		.then(function (allInvites) {
			// About all invites - get all invites for our school.
			// Then filter inbox invites
			outboxInvites = allInvites.filter(invite => invite.inviterSchoolId === self.activeSchoolId
			&& invite.invitedSchoolId !== self.activeSchoolId && invite.accepted === 'NOT_READY');

			// get info about current school
			return window.Server.school.get(self.activeSchoolId);
		})
		.then(activeSchool => {
			return Promise.all(
				outboxInvites.map(invite =>
					// inject schoolInfo to invite
					window.Server.publicSchool.get(invite.invitedSchoolId)
						.then(invitedSchool => {
							invite.inviterSchool = activeSchool;
							invite.invitedSchool = invitedSchool;

							// inject event to invite
							return window.Server.schoolEvent.get({schoolId: self.activeSchoolId, eventId: invite.eventId});
						})
						.then(event => {
							invite.event = event;

							// inject sport to invite
							return window.Server.public_sport.get(event.sportId).then(sport => {
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
				.set('models', Immutable.fromJS(outboxInvites))
				.set('participants', Immutable.fromJS([]))// TODO to deal with this shit
				.commit();

			return outboxInvites;
		});
	},
	getInvites: function () {
		var self = this,
			binding = self.getDefaultBinding(),
			invites = binding.get('models');

		return invites.map(function (invite, index) {
			var inviterIndex = self.findIndexParticipant(invite.get('inviterId')),
				invitedIndex = self.findIndexParticipant(invite.get('guestId')),
				inviteBinding = {
					default: binding.sub(['models', index]),
					inviter: binding.sub(['participants', inviterIndex]),
					invited: binding.sub(['participants', invitedIndex])
				};

			return <Invite type="outbox" binding={inviteBinding} />;
		}).toArray();
	},
	render: function() {
		var self = this,
			binding = self.getDefaultBinding(),
			invites = self.getInvites();

		return <div key="OutboxView" className="eInvites_OutboxContainer">
			<div className="eSchoolMaster_wrap">
				<h1 className="eSchoolMaster_title">Outbox</h1>
				<div className="eStrip">
				</div>
			</div>
			<div className="eInvites_filterPanel"></div>
			<div className="eInvites_list" key="OutboxViewList">{invites && invites.length ? invites : null}</div>
			<ProcessingView binding={binding} />
		</div>;
	}
});


module.exports = OutboxView;
