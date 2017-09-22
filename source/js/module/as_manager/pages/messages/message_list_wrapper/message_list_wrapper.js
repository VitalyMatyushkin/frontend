const	React				= require('react'),
		Morearty			= require('morearty'),
		Immutable			= require('immutable'),
		MoreartyHelper		= require('module/helpers/morearty_helper'),
		MessageListActions	= require('module/as_manager/pages/messages/message_list_wrapper/message_list_actions/message_list_actions'),
		MessageList			= require('module/ui/message_list/message_list'),
		MessageConsts		= require('module/ui/message_list/message/const/message_consts'),
		Loader				= require('module/ui/loader');

const MessageListWrapper = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		activeSchoolId:	React.PropTypes.string.isRequired,
		messageType:	React.PropTypes.string.isRequired
	},
	componentWillMount: function() {
		this.loadAndSetMessages();
		this.loadAndSetLoggedUser();
	},
	loadAndSetMessages: function() {
		MessageListActions.loadMessages(
			this.props.messageType,
			this.props.activeSchoolId
		).then(messages => {
			this.getDefaultBinding().set('messages', Immutable.fromJS(messages));
		});
	},
	loadAndSetLoggedUser: function() {
		return window.Server.profile.get()
		.then(user => {
			this.getDefaultBinding().atomically()
				.set('loggedUser', 	Immutable.fromJS(user))
				.set('isSync',		true)
				.commit();
		});
	},
	setSync: function(value) {
		this.getDefaultBinding().set('isSync', value);
	},
	onAction: function(messageId, messageKind, actionType) {
		this.onActionByMessageKindAndActionType(messageId, messageKind, actionType);
	},
	onActionByMessageKindAndActionType: function(messageId, messageKind, actionType) {
		switch (messageKind) {
			case MessageConsts.MESSAGE_KIND.REFUSAL:
				this.onActionForRefusalMessageByActionType(messageId, actionType);
				break;
		}
	},
	onActionForRefusalMessageByActionType: function(messageId, actionType) {
		switch (actionType) {
			case MessageConsts.MESSAGE_INVITATION_ACTION_TYPE.GOT_IT:
				MessageListActions.gotItRefusalMessage(
					this.props.activeSchoolId,
					messageId
				).then(() => {
					this.setSync(false);

					this.loadAndSetMessages();
				});
				break;
		}
	},
	onClickShowComments: function(messageId){
		const 	binding			= this.getDefaultBinding(),
				messageIndex 	= binding.toJS('messages').findIndex(message => message.id === messageId),
				isShowComments 	= Boolean(binding.toJS(`messages.${messageIndex}.isShowComments`));
		
		binding.atomically()
			.set(`messages.${messageIndex}.isShowComments`, !isShowComments)
			.set(`messages.${messageIndex}.isSyncComments`, false)
			.commit();
		
		if (!isShowComments) {
			window.Server.schoolEventMessageComments.get({
				schoolId: this.props.activeSchoolId,
				messageId
			}).then(
				comments => {
					binding.atomically()
					.set(`messages.${messageIndex}.comments`, 		Immutable.fromJS(comments))
					.set(`messages.${messageIndex}.commentsCount`, 	comments.length)
					.set(`messages.${messageIndex}.isSyncComments`, true)
					.commit();
				}
			);
		}
	},
	onClickSubmitComment: function(newCommentText, replyComment, messageId){
		const 	binding 		= this.getDefaultBinding(),
				messageIndex 	= binding.toJS('messages').findIndex(message => message.id === messageId);
		
		const postData = {
			text: newCommentText
		};
		if(typeof replyComment !== 'undefined') {
			postData.replyToCommentId = replyComment.id;
		}
		
		return window.Server.schoolEventMessageComments.post(
			{
				schoolId: this.props.activeSchoolId,
				messageId: messageId
			},
			postData
		)
		.then(comment => {
			const	comments		= binding.toJS(`messages.${messageIndex}.comments`),
					commentsCount	= binding.toJS(`messages.${messageIndex}.commentsCount`);
			
			comments.push(comment);
			
			binding.atomically()
				.set(`messages.${messageIndex}.commentsCount`, 	Immutable.fromJS(commentsCount + 1))
				.set(`messages.${messageIndex}.comments`, 		Immutable.fromJS(comments))
				.commit();
		});
	},
	checkComments: function(messageId) {
		const 	binding 		= this.getDefaultBinding(),
				messageIndex 	= binding.toJS('messages').findIndex(message => message.id === messageId);
		
		return window.Server.schoolEventMessageCommentsCount.get({
			schoolId:	this.props.activeSchoolId,
			messageId: messageId
		})
		.then(res => {
			const oldCount = binding.get(`messages.${messageIndex}.commentsCount`);
			if(oldCount && oldCount !== res.count) {
				this.setComments(messageId);
			}
			return true;
		})
	},
	setComments: function(messageId){
		const 	binding 		= this.getDefaultBinding(),
				messageIndex 	= binding.toJS('messages').findIndex(message => message.id === messageId);
		
		return window.Server.schoolEventMessageComments.get(
			{
				schoolId	: this.props.activeSchoolId,
				messageId: messageId
			}, {
				filter: {
					limit: 100
				}
			})
		.then(comments => {
			binding
				.atomically()
				.set(`messages.${messageIndex}.commentsCount`, 	comments.length)
				.set(`messages.${messageIndex}.comments`, 		Immutable.fromJS(comments))
				.commit();
			
			return true;
		});
	},
	render: function() {
		const	binding		= this.getDefaultBinding();

		const	messages	= binding.toJS('messages'),
				isSync		= binding.toJS('isSync');
		
		const user = binding.toJS('loggedUser');

		if(!isSync) {
			return (
				<div className="eInvites_processing">
					<Loader/>
				</div>
			);
		} else if(isSync && messages.length > 0) {
			return (
				<MessageList
					messages				= {messages}
					messageType				= {this.props.messageType}
					onAction				= {this.onAction}
					user 					= {user}
					onClickShowComments 	= {this.onClickShowComments}
					onClickSubmitComment 	= {this.onClickSubmitComment}
					checkComments 			= {this.checkComments}
				/>
			);
		} else if(isSync && messages.length === 0) {
			return (
				<div className="eInvites_processing">
					<span>There is no messages.</span>
				</div>
			);
		}
	}
});

module.exports = MessageListWrapper;