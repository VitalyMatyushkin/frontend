var EventsView;

EventsView = React.createClass({
	mixins: [Morearty.Mixin],
	getInvites: function () {
		var binding = this.getDefaultBinding(),
			inviteCount = binding.get().count();

		if (inviteCount > 0) {
			return binding.get('models').map(function (invite) {
				return <div className="eInvite">
					<span className="eInvite_inviter">Inviter: {invite.get('inviterId')}</span>
					<span className="eInvite_type">Type: {invite.get('invitedType')}</span>
					<div className="eInvite_messages">Message: {invite.get('message')}</div>
					<span className="eInvite_redeemed">redeemed: {invite.get('redeemed') ? 'redeemed' : 'not redeemed'}</span>
					{invite.get('accepted') ?
						<button className="eInvite_accepted bButton mDisable">Accepted</button> :
						<button className="eInvite_accepted bButton mEnable">Accept</button>
						}
				</div>;
			}).toArray();
		} else {
			return <div className="eNotFound">You haven't invites.</div>
		}
	}
	,
	render: function() {
		var self = this;

		return <div className="bInvites">
		{self.getInvites()}
		</div>;
	}
});


module.exports = EventsView;
