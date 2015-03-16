var OutboxView,
    Invite = require('./invite'),
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

            return <Invite binding={inviteBinding} />;
        }).toArray();
	},
	render: function() {
		var self = this,
			binding = self.getDefaultBinding();

		return <div>
			<h2>Outbox</h2>
			<div className="eInvites_filterPanel"></div>
			<div className="eInvites_list">{self.getInvites()}</div>
		</div>;
	}
});


module.exports = OutboxView;
