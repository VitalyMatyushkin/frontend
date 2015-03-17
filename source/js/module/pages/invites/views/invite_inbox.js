var InviteView;

InviteView = React.createClass({
    mixins: [Morearty.Mixin],
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
                mNotRedeemed: binding.get('redeemed')
            }),
            inviter = self.getBinding('inviter'),
            invited = self.getBinding('invited'),
            message = binding.get('message') || '',
            isRedeemed = binding.get('redeemed');

        return <div key={binding.get('id')} className={inviteClasses}>
            <div className="eInvite_header">
                <span className="eInvite_eventName">
                    {inviter.get('name')}
                    <span className="eInvite_vs">VS</span>
                    {invited.get('name')}
                </span>
                <span className="eInvite_eventDate"></span>
            </div>
            <div className="eInvite_message">{message}</div>
            {!isRedeemed ? <span className="eInvite_redeemed" onClick={self.onClickRedeemed}></span> : null}
        </div>;
    }
});


module.exports = InviteView;
