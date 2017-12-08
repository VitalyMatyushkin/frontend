const	React			= require('react'),
		MessageConsts	= require('module/ui/message_list/message/const/message_consts'),
		Bootstrap		= require('styles/bootstrap-custom.scss'),
		InviteStyles	= require('styles/pages/events/b_invite.scss');

const MessageStatus = React.createClass({
	propTypes: {
		message:	React.PropTypes.object.isRequired,
		type:		React.PropTypes.string.isRequired
	},
	getStatus: function() {
		const	message	= this.props.message,
				type	= this.props.type;

		let status = '';

		if(type === MessageConsts.MESSAGE_TYPE.ARCHIVE) {
			switch (message.kind) {
				case MessageConsts.MESSAGE_KIND.INVITATION:
					status = this.getStatusForInvitationMessage(message);
					break;
				case MessageConsts.MESSAGE_KIND.CLUB_PARTICIPANT_INVITE:
					status = this.getStatusForInvitationMessage(message);
					break;
			}
		}

		return status;
	},
	getStatusForInvitationMessage: function(message) {
		let status = '';
		switch (message.kind) {
			case MessageConsts.MESSAGE_KIND.INVITATION:
				if(message.invitationStatus === MessageConsts.MESSAGE_INVITATION_STATUS.ACCEPTED) {
					status = 'Accepted';
				} else {
					status = 'Declined';
				}
				break;
			case MessageConsts.MESSAGE_KIND.CLUB_PARTICIPANT_INVITE:
				if(message.invitationStatus === MessageConsts.MESSAGE_INVITATION_STATUS.ACCEPTED) {
					status = 'Booked';
				} else {
					status = 'Declined';
				}
				break;
		}

		return status;
	},
	render: function() {
		const status = this.getStatus();

		return (
			<div className="eInvite_message">
				<span className={'m'+status}>{status}</span>
			</div>
		);
	}
});

module.exports = MessageStatus;