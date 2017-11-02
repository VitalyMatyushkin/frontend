const	React									= require('react'),
		SchoolLogo								= require('module/ui/message_list/message/components/school_logo'),
		ChildName								= require('module/ui/message_list/message/components/child_name'),
		TeamInfo								= require('module/ui/message_list/message/components/team_info'),
		EventInfo								= require('module/ui/message_list/message/components/event_info'),
		EventParticipationRefusalMessageButtons	= require('module/ui/message_list/message/components/buttons/event_participation_refusal_message_buttons'),
		Venue									= require('module/ui/message_list/message/components/venue'),
		MessageStatus							= require('module/ui/message_list/message/components/message_status'),
		MessageText								= require('module/ui/message_list/message/components/message_text'),
		MessageConsts							= require('module/ui/message_list/message/const/message_consts'),
		EventMessageComments					= require('module/ui/message_list/message/components/comments/event_message_comments'),
		If 										= require('module/ui/if/if'),
		Bootstrap								= require('styles/bootstrap-custom.scss'),
		InviteStyles							= require('styles/pages/events/b_invite.scss');

const EventParticipationMessage = React.createClass({
	propTypes: {
		message:				React.PropTypes.object.isRequired,
		type:					React.PropTypes.string.isRequired,
		onAction:				React.PropTypes.func.isRequired,
		onClickShowComments: 	React.PropTypes.func.isRequired,
		onClickSubmitComment: 	React.PropTypes.func.isRequired,
		checkComments: 			React.PropTypes.func.isRequired
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
	onGotIt: function() {
		const	messageId	= this.props.message.id,
				messageKind	= this.props.message.kind,
				actionType	= MessageConsts.MESSAGE_INVITATION_ACTION_TYPE.GOT_IT;
		
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
					<EventParticipationRefusalMessageButtons
						onGotIt = {this.onGotIt}
					/>
				);
			default:
				return null;
		}
	},
	onClickShowComments: function(){
		this.props.onClickShowComments(this.props.message.id);
	},
	onClickSubmitComment:function(newCommentText, replyComment){
		this.props.onClickSubmitComment(newCommentText, replyComment, this.props.message.id);
	},
	render: function() {
		const 	isShowComments 	= Boolean(this.props.message.isShowComments),
				isSyncComments 	= Boolean(this.props.message.isSyncComments),
				comments 		= typeof this.props.message.comments === 'undefined' ? [] : this.props.message.comments;
		
		let linkText;
		if (isShowComments) {
			linkText = 'Hide chat';
		} else {
			linkText = 'Chat';
		}
		
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
								{this.renderButtons()}
								<div className="eInviteDiscussionLink">
									<a onClick = {this.onClickShowComments}>{ linkText }</a>
								</div>
							</div>
						</div>
					</div>
					<div className="col-md-6">
						<Venue message={this.props.message}/>
					</div>
				</div>
				<If condition = { isShowComments }>
					<div className="eInvite_comments">
						<EventMessageComments
							user			= {this.props.user}
							comments		= {comments}
							onSubmitComment	= {this.onClickSubmitComment}
							isSyncComments 	= {isSyncComments}
						/>
					</div>
				</If>
			</div>
		);
	}
});

module.exports = EventParticipationMessage;