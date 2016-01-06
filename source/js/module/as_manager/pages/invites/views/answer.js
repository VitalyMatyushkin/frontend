var AnswerView,
	React = require('react');

AnswerView = React.createClass({
    mixins: [Morearty.Mixin],
	onClickYes: function () {
		var self = this,
			rootBinding = self.getMoreartyContext().getBinding(),
			binding = self.getDefaultBinding(),
			inviteId = rootBinding.get('routing.pathParameters.0'),
			type = binding.get('type');

		if (type === 'cancel' || type === 'decline') {
			window.Server.inviteRepay.post(inviteId, {accepted: false}).then(function() {
				if (type === 'cancel') {
					document.location.href = '#invites/outbox';
				} else if (type === 'decline') {
					document.location.href = '#invites/inbox';
				}
			});
		}
	},
	onClickNo: function () {
		var self = this,
			binding = self.getDefaultBinding(),
			type = binding.get('type');

		if (type === 'cancel') {
			document.location.href = '#invites/outbox';
		} else if (type === 'decline') {
			document.location.href = '#invites/inbox';
		}
	},
    render: function() {
        var self = this,
            binding = self.getDefaultBinding(),
			isDecline = binding.get('type') === 'decline',
			message = isDecline ? 'Are you sure you want to decline?' : 'Are you sure you want to cancel?';

        return <div className='eInvites_answer'>
			<span>{message}</span>
			<div className="eInvite_buttons">
				<span className="bButton" onClick={self.onClickYes.bind(null)}>Yes</span>
				<span className="bButton mRed" onClick={self.onClickNo.bind(null)}>No</span>
			</div>
		</div>
    }
});


module.exports = AnswerView;
