var InboxView,
    Invite = require('./invite'),
	ProcessingView = require('./processing'),
    InvitesMixin = require('../mixins/invites_mixin');

InboxView = React.createClass({
    mixins: [Morearty.Mixin, InvitesMixin],
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

		window.Server.invites.get({
			filter: {
				where: {
					guestId: activeSchoolId,
					accepted: {
                        nin: [true, false]
                    }
				},
                include: [
                    {
                        inviter: ['forms', 'houses']
                    },
                    {
                        guest: ['forms', 'houses']
                    }
                ]
			}
		}).then(function (models) {
			var participants = models.reduce(function (memo, invite) {
                var foundInviter = memo.filter(function (model) {
                        return invite.inviter.id === model.id;
                    }),
                    foundGuest = memo.filter(function (model) {
                        return invite.guest.id === model.id;
                    });

				if (foundInviter.length === 0) {
					memo.push(invite.inviter);
				}

                if (foundGuest.length === 0) {
                    memo.push(invite.guest);
                }

				return memo;
			}, []);

            binding
                .atomically()
                .set('sync', true)
                .set('models', Immutable.fromJS(models))
                .set('participants', Immutable.fromJS(participants))
                .commit();
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
                    inviter: binding.sub(['models', index, 'inviter']),
                    invited: binding.sub(['models', index, 'guest'])
                };

            return <Invite type="inbox"  binding={inviteBinding} />;
        }).toArray();
    },
    render: function() {
        var self = this,
            binding = self.getDefaultBinding(),
            invites = self.getInvites();

        return <div key="inboxView" className="eInvites_inboxContainer">
            <h2 className="eInvites_titlePage">Inbox</h2>
            <div className="eInvites_filterPanel"></div>
            <div className="eInvites_list" key="inboxViewList">{invites && invites.length ? invites : null}</div>
			<ProcessingView binding={binding} />
        </div>;
    }
});


module.exports = InboxView;
