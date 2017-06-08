const	React							= require('react'),
		SchoolLogo						= require('module/ui/message_list/message/components/school_logo'),
		ChildName						= require('module/ui/message_list/message/components/child_name'),
		TeamInfo						= require('module/ui/message_list/message/components/team_info'),
		MessageTitle					= require('module/ui/message_list/message/components/message_title'),
		MessageText						= require('module/ui/message_list/message/components/message_text'),
		EventInfo						= require('module/ui/message_list/message/components/event_info'),
		EventInvitationMessageButtons	= require('module/ui/message_list/message/components/buttons/event_invitation_message_buttons'),
		Venue							= require('module/ui/message_list/message/components/venue'),
		MessageStatus					= require('module/ui/message_list/message/components/message_status'),
		MessageConsts					= require('module/ui/message_list/message/const/message_consts'),
		Bootstrap						= require('styles/bootstrap-custom.scss'),
		InviteStyles					= require('styles/pages/events/b_invite.scss');

const EventInvitationMessage = React.createClass({
	propTypes: {
		message:	React.PropTypes.object.isRequired,
		type:		React.PropTypes.string.isRequired,
		onAction:	React.PropTypes.func.isRequired
	},
	onAccept: function() {
		const	messageId	= this.props.message.id,
				messageKind	= this.props.message.kind,
				actionType	= MessageConsts.MESSAGE_INVITATION_ACTION_TYPE.ACCEPT;

		this.props.onAction(
			messageId,
			messageKind,
			actionType
		);
	},
	onDecline: function() {
		const	messageId	= this.props.message.id,
				messageKind	= this.props.message.kind,
				actionType	= MessageConsts.MESSAGE_INVITATION_ACTION_TYPE.DECLINE;

		this.props.onAction(
			messageId,
			messageKind,
			actionType
		);
	},
	renderButtons: function() {
		switch (this.props.type) {
			case MessageConsts.MESSAGE_TYPE.INBOX:
				return (
					<EventInvitationMessageButtons
						onAccept	= {this.onAccept}
						onDecline	= {this.onDecline}
					/>
				);
			default:
				return null;
		}
	},
	renderStatus: function() {
		switch (this.props.type) {
			case MessageConsts.MESSAGE_TYPE.ARCHIVE:
				return (
					<MessageStatus
						message	= {this.props.message}
						type	= {this.props.type}
					/>
				);
			default:
				return null;
		}
	},
	render: function() {
		console.log(this.props.message);

		return (
			<div className='bInvite'>
				<div className="row">
					<div className="col-md-6 eInvite_left">
						<div className="row">
							<SchoolLogo
								message={this.props.message}
							/>
							<div className="eInvite_info col-md-7 col-sm-7">
								<ChildName
									message={this.props.message}
								/>
								<TeamInfo
									message={this.props.message}
								/>
								<EventInfo
									message={this.props.message}
								/>
								<MessageText
									message={this.props.message}
								/>
								{ this.renderButtons() }
								{ this.renderStatus() }
							</div>
						</div>
					</div>
					<div className="col-md-6">
						<Venue
							message={this.props.message}
						/>
					</div>
				</div>
			</div>
		);
	}
});

module.exports = EventInvitationMessage;