const	React								= require('react'),
		EventInvitationMessage				= require('module/ui/message_list/message/event_invitation_message'),
		EventParticipationRefusalMessage	= require('module/ui/message_list/message/event_participation_refusal_message'),
		MessageConsts						= require('module/ui/message_list/message/const/message_consts');

const MessageList = React.createClass({
	propTypes: {
		messages:				React.PropTypes.array.isRequired,
		messageType:			React.PropTypes.string.isRequired,
		onAction:				React.PropTypes.func.isRequired,
		user: 					React.PropTypes.object.isRequired,
		onClickShowComments: 	React.PropTypes.func.isRequired,
		onClickSubmitComment: 	React.PropTypes.func.isRequired,
		checkComments: 			React.PropTypes.func.isRequired
	},
	renderMessages: function() {
		let messages = null;

		if(
			typeof this.props.messages !== 'undefined' &&
			this.props.messages.length > 0
		) {
			messages = this.props.messages.map(message => {
				switch (message.kind) {
					case MessageConsts.MESSAGE_KIND.INVITATION:
						return (
							<EventInvitationMessage
								key						= {message.id}
								message					= {message}
								type					= {this.props.messageType}
								onAction				= {this.props.onAction}
								user 					= {this.props.user}
								onClickShowComments 	= {this.props.onClickShowComments}
								onClickSubmitComment 	= {this.props.onClickSubmitComment}
								checkComments 			= {this.props.checkComments}
							/>
						);
					case MessageConsts.MESSAGE_KIND.REFUSAL:
						return (
							<EventParticipationRefusalMessage
								key						= {message.id}
								message					= {message}
								type					= {this.props.messageType}
								onAction				= {this.props.onAction}
								user 					= {this.props.user}
								onClickShowComments 	= {this.props.onClickShowComments}
								onClickSubmitComment 	= {this.props.onClickSubmitComment}
								checkComments 			= {this.props.checkComments}
							/>
						);
				}
			});
		}

		return messages;
	},
	render: function() {
		return (
			<div className="eInvites_list container" >
				{this.renderMessages()}
			</div>
		);
	}
});

module.exports = MessageList;