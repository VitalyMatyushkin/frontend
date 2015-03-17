var OutboxView,
    InviteOutbox = require('./invite_outbox'),
	InvitesMixin = require('../mixins/invites_mixin');

OutboxView = React.createClass({
	mixins: [Morearty.Mixin, InvitesMixin],
	getInvites: function () {
		var self = this,
            activeSchoolId = self.getActiveSchoolId(),
			binding = self.getDefaultBinding(),
			invites = self.getFilteredInvites(activeSchoolId, 'outbox', 'ask', true);

        return invites.map(function (invite, index) {
            var inviterIndex = self.findIndexParticipant(invite.get('inviterId')),
                invitedIndex = self.findIndexParticipant(invite.get('invitedId')),
                inviteBinding = {
                    default: binding.sub(['models', index]),
                    inviter: binding.sub(['participants', inviterIndex]),
                    invited: binding.sub(['participants', invitedIndex])
                };

            return <InviteOutbox binding={inviteBinding} />;
        }).toArray();
	},
	render: function() {
		var self = this,
			binding = self.getDefaultBinding(),
            invites = self.getInvites();

		return <div key={'inbox-view'} class="eInvites_outboxContainer">
			<h2 className="eInvites_titlePage">Outbox</h2>
			<div className="eInvites_list">{invites && invites.length ? invites : 'You don\'t have invites'}</div>
		</div>;
	}
});


module.exports = OutboxView;
