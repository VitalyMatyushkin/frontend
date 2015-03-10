var SVG = require('module/ui/svg'),
    EventsView;

EventsView = React.createClass({
	mixins: [Morearty.Mixin],
    getDefaultState: function () {
        return Immutable.fromJS({
            selectInvitesType: 'inbox',
            selectInviteAccepted: null,
            stepInviteAccepted: 0
        });
    },
    onSelectInviteType: function (type) {
        var self = this,
            binding = self.getDefaultBinding();

        binding.set('selectInvitesType', type);
    },
    onClickAccept: function (invite) {
        var self = this,
            binding = self.getDefaultBinding();

        binding.set('selectInviteAccepted', invite);
        binding.set('stepInviteAccepted', 1);
    },
    onClickDecline: function (invite) {
        window.Server.inviteRepay.post({
            inviteId: invite.get('id')
        }, {
            accepted: false
        }).then(function (res) {
            console.log(res);
        })
    },
	getInvites: function () {
		var self = this,
            binding = this.getDefaultBinding(),
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
                    inbox = invite.get('invitedId') === activeSchoolId,
                    acceptedText = invite.get('accepted') ? 'accepted' : 'declined'
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
                      <div className="eInvite_buttons">
                        {inbox && !invite.get('repaid') ? <span className="bButton" onClick={self.onClickAccept.bind(null, invite)}>Accept</span> : null}
                        {inbox && !invite.get('repaid') ? <span className="bButton" onClick={self.onClickDecline.bind(null, invite)}>Decline</span> : null}
                        {invite.get('repaid') ? <span className="bButton mDisable">{acceptedText.toUpperCase()}</span> : null}
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
            step = binding.get('stepInviteAccepted'),
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
            {!step ? <div>
                <div className="bChooser">
                    <span className={inboxClasses} onClick={self.onSelectInviteType.bind(null, 'inbox')}>Inbox</span>
                    <span className={outboxClasses} onClick={self.onSelectInviteType.bind(null, 'outbox')}>Outbox</span>
                </div>
                {self.getInvites()}
            </div>: null}
            {step === 1 ? <div>

            </div>: null}
        </div>;
	}
});


module.exports = EventsView;
