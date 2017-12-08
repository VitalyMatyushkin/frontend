const	React							= require('react');

const	SchoolLogo						= require('module/ui/message_list/message/components/school_logo'),
		TeamInfo						= require('module/ui/message_list/message/components/team_info'),
		ChildName						= require('module/ui/message_list/message/components/child_name'),
		EventInvitationMessageButtons	= require('module/ui/message_list/message/components/buttons/event_invitation_message_buttons'),
		ClubInfo						= require('module/ui/message_list/message/components/club_info'),
		MessageText						= require('module/ui/message_list/message/components/message_text'),
		MessageStatus					= require('module/ui/message_list/message/components/message_status'),
		MessageConsts					= require('module/ui/message_list/message/const/message_consts'),
		EventMessageComments			= require('module/ui/message_list/message/components/comments/event_message_comments');

const	{ If }							= require('module/ui/if/if');

const	Bootstrap						= require('styles/bootstrap-custom.scss'),
		InviteStyles					= require('styles/pages/events/b_invite.scss');

const ClubParticipationMessage = React.createClass({
	propTypes: {
		message:				React.PropTypes.object.isRequired,
		type:					React.PropTypes.string.isRequired,
		userType:				React.PropTypes.string.isRequired,
		onAction:				React.PropTypes.func.isRequired,
		onClickShowComments: 	React.PropTypes.func.isRequired,
		onClickSubmitComment: 	React.PropTypes.func.isRequired,
		checkComments: 			React.PropTypes.func.isRequired,
		user: 					React.PropTypes.object.isRequired
	},
	componentWillUnmount: function(){
		clearInterval(this.timerID);
	},
	/**
	 * Function start timer, which send request on server with count comment
	 * If count don't equal old count, then call function with get comments
	 */
	componentWillReceiveProps: function(newProps){
		if (Boolean(this.props.message.isShowComments) === false && Boolean(newProps.message.isShowComments) === true) {
			this.timerID = setInterval(
				() => this.props.checkComments(newProps.message.id),
				30000
			);
		}
		if (Boolean(this.props.message.isShowComments) === true && Boolean(newProps.message.isShowComments) === false) {
			clearInterval(this.timerID);
		}
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
						acceptButtonText	= {'Book'}
						onAccept			= {this.onAccept}
						onDecline			= {this.onDecline}
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
	renderShowCommentButton: function () {
		if(this.props.userType === MessageConsts.USER_TYPE.STUDENT) {
			const isShowComments = Boolean(this.props.message.isShowComments);

			let linkText;
			if (isShowComments) {
				linkText = 'Hide chat';
			} else {
				linkText = 'Chat';
			}

			return (
				<div className="eInviteDiscussionLink">
					<a onClick = {this.onClickShowComments}>{ linkText }</a>
				</div>
			);
		}
	},
	onClickShowComments: function(){
		this.props.onClickShowComments(this.props.message.id);
	},
	onClickSubmitComment:function(newCommentText, replyComment){
		this.props.onClickSubmitComment(newCommentText, replyComment, this.props.message.id);
	},
	render: function() {
		const	isShowComments	= Boolean(this.props.message.isShowComments),
				isSyncComments	= Boolean(this.props.message.isSyncComments),
				comments		= typeof this.props.message.comments === 'undefined' ? [] : this.props.message.comments;

		return (
			<div className='bInvite'>
				<div className="row">
					<div className="col-md-6 eInvite_left">
						<div className="row">
							<SchoolLogo message = { this.props.message } />
							<div className="eInvite_info col-md-7 col-sm-7">
								<ChildName message = { this.props.message } />
								<TeamInfo message = { this.props.message } />
								<ClubInfo message = { this.props.message } />
								<MessageText message = { this.props.message } />
								{ this.renderButtons() }
								{ this.renderStatus() }
								{ this.renderShowCommentButton() }
							</div>
						</div>
					</div>
				</div>
				<If condition = { isShowComments }>
					<div className="eInvite_comments">
						<EventMessageComments
							user			= { this.props.user }
							comments		= { comments }
							onSubmitComment	= { this.onClickSubmitComment }
							isSyncComments	= { isSyncComments }
						/>
					</div>
				</If>
			</div>
		);
	}
});

module.exports = ClubParticipationMessage;