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
                        neq: true,
                        neq: false
                    }
				}
			}
		}).then(function (models) {
			var uniqueIds = models.reduce(function (memo, invite) {
				if (memo.indexOf(invite.guestId) === -1) {
					memo.push(invite.guestId);
				}

				return memo;
			}, []);

			if (uniqueIds.length > 0) {
				window.Server.schools.get({
					filter: {
						where: {
							id: {
								inq: uniqueIds
							}
						}
					}
				}).then(function (participants) {
					binding
						.atomically()
						.set('sync', true)
						.set('models', Immutable.fromJS(models))
						.set('participants', Immutable.fromJS(participants))
						.commit();
				});
			} else {
                binding
                    .atomically()
                    .set('sync', true)
                    .commit();
            }
		});
	},
    getInvites: function () {
        var self = this,
            activeSchoolId = self.getActiveSchoolId(),
            binding = self.getDefaultBinding(),
            invites = self.getFilteredInvites(activeSchoolId, 'inbox', 'ask', true);

        return invites.map(function (invite, index) {
            var inviterIndex = self.findIndexParticipant(invite.get('inviterId')),
                invitedIndex = self.findIndexParticipant(invite.get('guestId')),
                inviteBinding = {
                    default: binding.sub(['models', index]),
                    inviter: binding.sub(['participants', inviterIndex]),
                    invited: binding.sub(['participants', invitedIndex])
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
            <div className="eInvites_list">{invites && invites.length ? invites : null}</div>
			<ProcessingView binding={binding} />
        </div>;
    }
});


module.exports = InboxView;
