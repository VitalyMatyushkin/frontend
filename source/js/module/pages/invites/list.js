var SVG = require('module/ui/svg'),
    EventsView;

EventsView = React.createClass({
	mixins: [Morearty.Mixin],
    getDefaultState: function () {
        return Immutable.fromJS({
            selectInvitesType: 'inbox'
        });
    },
    onSelectInviteType: function (type) {
        var self = this,
            binding = self.getDefaultBinding();

        binding.set('selectInvitesType', type);
    },
	getInvites: function () {
		var binding = this.getDefaultBinding(),
            activeSchoolId = this.getMoreartyContext().getBinding().get('userRules.activeSchoolId'),
            selectInvitesType = binding.get('selectInvitesType'),
			inviteCount = binding.get('models').count();

		if (inviteCount > 0) {
			return binding.get('models').filter(function (invite) {
                return selectInvitesType === 'inbox' || selectInvitesType === undefined ?
                    invite.get('invitedId') === activeSchoolId :
                    invite.get('inviterId') === activeSchoolId;
            }).map(function (invite) {
                var date = new Date(invite.get('meta').get('created')),
                    dateTime = [date.getMonth(), date.getDate(), date.getFullYear()].join('/');

				return <div className="bInvite">
                    <div className="eInvite_title">{dateTime}</div>
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
			return null;
		}
	},
	render: function() {
		var self = this,
            binding = self.getDefaultBinding(),
            selectInvitesType = binding.get('selectInvitesType'),
            inboxClasses = classNames({
                eChooser_item: true,
                mActive: selectInvitesType === 'inbox' || selectInvitesType === undefined
            }),
            outboxClasses = classNames({
                eChooser_item: true,
                mActive: selectInvitesType === 'outbox'
            });

        return <div className="bInvites">
            <div className="bChooser">
                <span className={inboxClasses} onClick={self.onSelectInviteType.bind(null, 'inbox')}>Inbox</span>
                <span className={outboxClasses} onClick={self.onSelectInviteType.bind(null, 'outbox')}>Outbox</span>
            </div>
            {self.getInvites()}
        </div>;
	}
});


module.exports = EventsView;
