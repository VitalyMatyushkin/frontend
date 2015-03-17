var InboxView,
    InviteInbox = require('./invite_inbox'),
    InvitesMixin = require('../mixins/invites_mixin');

OutboxView = React.createClass({
    mixins: [Morearty.Mixin, InvitesMixin],
    getInvites: function () {
        var self = this,
            activeSchoolId = self.getActiveSchoolId(),
            binding = self.getDefaultBinding(),
            invites = self.getFilteredInvites(activeSchoolId, 'inbox', 'ask', true);

        return invites.map(function (invite, index) {
            var inviterIndex = self.findIndexParticipant(invite.get('inviterId')),
                invitedIndex = self.findIndexParticipant(invite.get('invitedId')),
                inviteBinding = {
                    default: binding.sub(['models', index]),
                    inviter: binding.sub(['participants', inviterIndex]),
                    invited: binding.sub(['participants', invitedIndex])
                };

            return <InviteInbox binding={inviteBinding} />;
        }).toArray();
    },
    render: function() {
        var self = this,
            binding = self.getDefaultBinding(),
            invites = self.getInvites();

        return <div key={'inbox-view'} className="eInvites_inboxContainer">
            <h2 className="eInvites_titlePage">Inbox</h2>
            <div className="eInvites_filterPanel"></div>
            <div className="eInvites_list">{invites && invites.length ? invites : 'You don\'t have invites'}</div>
        </div>;
    }
});


module.exports = InboxView;
