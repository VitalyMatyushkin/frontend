const   Invite          = require('./invite'),
        ProcessingView  = require('./processing'),
        React           = require('react'),
        InvitesMixin    = require('../mixins/invites_mixin'),
		MoreartyHelper	= require('module/helpers/morearty_helper'),
        Immutable       = require('immutable');

const InboxView = React.createClass({
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
			binding = self.getDefaultBinding(),
			rootBinding = self.getMoreartyContext().getBinding(),
			activeSchoolId = rootBinding.get('userRules.activeSchoolId');

		self.activeSchoolId = MoreartyHelper.getActiveSchoolId(self);

		let inboxInvites;

		// TODO Don't forget about filter
		//filter: {
		//	where: {
		//		guestId: activeSchoolId,
		//			accepted: {
		//			nin: [true, false]
		//		}
		//	},
		//	include: [
		//		{
		//			inviter: ['forms', 'houses']
		//		},
		//		{
		//			event: 'sport'
		//		},
		//		{
		//			guest: ['forms', 'houses']
		//		}
		//	]
		//}
		window.Server.schoolInvites.get(self.activeSchoolId, {
			filter: {
				limit: 100
			}
		})
		.then(function (allInvites) {
			// About all invites - get all invites for our school.
			// Then filter inbox invites
			inboxInvites = allInvites.filter(invite => invite.inviterSchoolId !== self.activeSchoolId
			&& invite.invitedSchoolId === self.activeSchoolId && invite.accepted === 'NOT_READY');

			// get info about current school
			return window.Server.school.get(self.activeSchoolId);
		})
		.then(activeSchool => {

			return Promise.all(
				inboxInvites.map(invite =>
					// inject schoolInfo to invite
					window.Server.publicSchool.get(invite.inviterSchoolId)
					.then(inviterSchool => {
						invite.inviterSchool = inviterSchool;
						invite.invitedSchool = activeSchool;

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
			// TODO to deal with this shit
			//var participants = inboxInvites.reduce(function (memo, invite) {
             //   var foundInviter = memo.filter(function (model) {
             //           return invite.inviter.id === model.id;
             //       }),
             //       foundGuest = memo.filter(function (model) {
             //           return invite.guest.id === model.id;
             //       });
			//
			//	if (foundInviter.length === 0) {
			//		memo.push(invite.inviter);
			//	}
			//
             //   if (foundGuest.length === 0) {
             //       memo.push(invite.guest);
             //   }
			//
			//	return memo;
			//}, []);

            binding
                .atomically()
                .set('sync', true)
                .set('models', Immutable.fromJS(inboxInvites))
                .set('participants', Immutable.fromJS([]))// TODO to deal with this shit
                .commit();

            return inboxInvites;
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

            return <Invite type="inbox"  binding={inviteBinding} />;
        }).toArray();
    },
    render: function() {
        var self = this,
            binding = self.getDefaultBinding(),
            invites = self.getInvites();

        return <div key="inboxView" className="eInvites_inboxContainer">
          <div className="eSchoolMaster_wrap">
            <h1 className="eSchoolMaster_title">Inbox</h1>
            <div className="eStrip">
            </div>
          </div>
            <div className="eInvites_filterPanel"></div>
            <div className="eInvites_list" key="inboxViewList">{invites && invites.length ? invites : null}</div>
			<ProcessingView binding={binding} />
        </div>;
    }
});


module.exports = InboxView;
