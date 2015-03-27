var InviteView;

InviteView = React.createClass({
    mixins: [Morearty.Mixin],
	propTypes: {
		type: React.PropTypes.oneOf(['inbox', 'outbox'])
	},
	onClickCancel: function () {
		var self = this,
			binding = self.getDefaultBinding();

		binding
			.set('redeemed', true)
			.set('repaid', true);

		window.Server.invite.put({
			inviteId: binding.get('id')
		}, binding.toJS());
	},
    onClickRedeemed: function () {
		var self = this,
			binding = self.getDefaultBinding();

		binding.set('redeemed', true);

		window.Server.invite.put({
			inviteId: binding.get('id')
		}, binding.toJS());
	},
    render: function() {
        var self = this,
            binding = self.getDefaultBinding(),
            inviteClasses = classNames({
                bInvite: true,
                mNotRedeemed: !binding.get('redeemed')
            }),
			isInbox = self.props.type === 'inbox',
			isOutBox = self.props.type === 'outbox',
			isRepaid = binding.get('repaid'),
            inviter = self.getBinding('inviter'),
            invited = self.getBinding('invited'),
            message = binding.get('message') || '',
            isRedeemed = binding.get('redeemed');

        return <div key={binding.get('id')} className={inviteClasses}>
            <div className="eInvite_header">
                <span className="eInvite_eventName">
                    {binding.get('inviter').get('name')}
                    <span className="eInvite_vs">VS</span>
                    {binding.get('guest').get('name')}
                </span>
                <span className="eInvite_eventDate"></span>
            </div>
            <div className="eInvite_message">{isInbox || isRepaid ? message : 'Awaiting opponent...' }</div>
			<div className="eInvite_buttons">
				{isInbox ? <a href={'/#invites/' + binding.get('id') + '/accept'} className="bButton">Accept</a> : null}
				{isInbox ? <a href={'/#invites/' + binding.get('id') + '/decline'} className="bButton mRed">Decline</a> : null}
				{isOutBox ? <a href={'/#invites/' + binding.get('id') + '/cancel'} className="bButton mRed">Cancel</a> : null}
			</div>
            {!isRedeemed && isInbox? <span className="eInvite_redeemed" onClick={self.onClickRedeemed}>{'was read?'}</span> : null}
        </div>;
    }
});


module.exports = InviteView;
