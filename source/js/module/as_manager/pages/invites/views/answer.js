var AnswerView,
	MoreartyHelper	= require('module/helpers/morearty_helper'),
	React = require('react');

AnswerView = React.createClass({
    mixins: [Morearty.Mixin],
	// ID of current school
	// Will set on componentWillMount event
	activeSchoolId: undefined,
	componentWillMount: function() {
		const self = this;

		self.activeSchoolId = MoreartyHelper.getActiveSchoolId(self);
	},
	onClickYes: function () {
		var self = this,
			rootBinding = self.getMoreartyContext().getBinding(),
			binding = self.getDefaultBinding(),
			inviteId = rootBinding.get('routing.pathParameters.0'),
			type = binding.get('type');

		if (type === 'cancel' || type === 'decline') {
			window.Server.declineSchoolInvite.post({schoolId: self.activeSchoolId, inviteId: inviteId}).then(_ => {
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
			<div className="eAnswer_buttons">
				<span className="bButton" onClick={self.onClickYes.bind(null)}>Yes</span>
				<span className="bButton mRed" onClick={self.onClickNo.bind(null)}>No</span>
			</div>
		</div>
    }
});


module.exports = AnswerView;
