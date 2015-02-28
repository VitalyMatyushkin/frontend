var Panel = require('./panel'),
    SVG = require('module/ui/svg'),
    EventsView;

EventsView = React.createClass({
	mixins: [Morearty.Mixin],
	getInvites: function () {
		var binding = this.getDefaultBinding(),
			inviteCount = binding.get('models').count();

		if (inviteCount > 0) {
			return binding.get('models').map(function (invite) {
				return <div className="eInvite">
                    <span className="eInvite_invited">Invited: {invite.get('invitedId')}</span>
                    <span className="eInvite_inviter">Inviter: {invite.get('inviterId')}</span>
                    <span className="eInvite_type">Type: {invite.get('invitedType')}</span>
                    <div className="eInvite_messages">Message: {invite.get('message')}</div>
                    <span className="eInvite_redeemed">redeemed: {invite.get('redeemed') ? 'redeemed' : 'not redeemed'}</span>
                    <div className="eInvite_overlay">
                        <SVG icon="icon_check" classes={invite.get('accepted') ? 'eInvite_accept mAccept' : 'eInvite_accept'} />
                    </div>
				</div>;
			}).toArray();
		} else {
			return <div className="eNotFound">You haven't invites.</div>
		}
	},
	render: function() {
		var self = this,
            binding = self.getDefaultBinding();

        return <div className="bEvents">
            <Panel binding={binding} />
            <h2>Invites</h2>
            <div className="bInvites">
		        {self.getInvites()}
            </div>
        </div>;
	}
});


module.exports = EventsView;
