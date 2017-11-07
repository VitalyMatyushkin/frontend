const	React				= require('react'),
		Morearty			= require('morearty'),
		Immutable			= require('immutable'),
		Lazy 				= require('lazy.js'),
		Promise 			= require('bluebird'),
		MessageListActions	= require('module/as_manager/pages/parents_pages/messages/message_list_wrapper/message_list_actions/message_list_actions'),
		MessageList			= require('module/ui/message_list/message_list'),
		MessageConsts		= require('module/ui/message_list/message/const/message_consts'),
		Loader				= require('module/ui/loader');

const MessageListWrapper = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		messageType: React.PropTypes.string.isRequired
	},
	componentWillMount: function() {
		//load user->load messages->load templates
		const binding = this.getDefaultBinding();
		this.loadAndSetLoggedUser()
		.then(user => {
			binding.set('loggedUser', Immutable.fromJS(user));
			
			return MessageListActions.loadMessages(this.props.messageType)
		})
		.then(messages => {
			const schoolIds = Lazy(messages).map(message => message.schoolId).uniq().toArray();
			binding.atomically()
				.set('messages',		Immutable.fromJS(messages))
				.set(`template.count`, 	schoolIds.length)
				.commit();
			
			return this.loadAndSetConsentRequestTemplate(schoolIds)
		})
		.then(() => {
			binding.set('isSync', true);
		});
	},
	
	loadAndSetMessages: function() {
		MessageListActions.loadMessages(this.props.messageType).then(messages => {
			this.getDefaultBinding().atomically()
			.set('isSync',		true)
			.set('messages',	Immutable.fromJS(messages))
			.commit();
		});
	},

	loadAndSetLoggedUser: function() {
		return window.Server.profile.get()
	},
	//we should load own template for different school
	loadAndSetConsentRequestTemplate: function(schoolIds){
		const binding = this.getDefaultBinding();
		return Promise.all(schoolIds.map((schoolId, index) => {
			return window.Server.consentRequestTemplate.get(schoolId).then(template => {
				binding.set(`template.${index}`, Immutable.fromJS(template));
			})
		}));
	},
	setSync: function(value) {
		this.getDefaultBinding().set('isSync', value);
	},
	onAction: function(messageId, messageKind, actionType, templateData) {
		this.onActionByMessageKindAndActionType(messageId, messageKind, actionType, templateData);
	},
	onActionByMessageKindAndActionType: function(messageId, messageKind, actionType, templateData) {
		switch (messageKind) {
			case MessageConsts.MESSAGE_KIND.INVITATION:
				this.onActionForRefusalMessageByActionType(messageId, actionType, templateData);
				break;
		}
	},
	onActionForRefusalMessageByActionType: function(messageId, actionType, templateData) {
		switch (actionType) {
			case MessageConsts.MESSAGE_INVITATION_ACTION_TYPE.ACCEPT:
				
				MessageListActions.acceptInvitationMessage(messageId).then(() => {
					return MessageListActions.sendConsentRequestTemplateWithValue(messageId, templateData)
				})
				.then(() => {
					this.setSync(false);

					this.loadAndSetMessages();
				});
				break;
			case MessageConsts.MESSAGE_INVITATION_ACTION_TYPE.DECLINE:
				MessageListActions.declineInvitationMessage(messageId).then(() => {
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
			window.Server.childrenEventMessageComments.get({messageId}).then(
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
		
		return window.Server.childrenEventMessageComments.post(
			{
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
		
		return window.Server.childrenEventMessageCommentsCount.get({
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
		
		return window.Server.childrenEventMessageComments.get(
			{
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
	getTemplatesFromBinding: function(binding){
		let templates = [];
		const templateCount = binding.toJS('template.count');
		for (let index = 0; index < templateCount; index++){
			templates.push(
				binding.toJS(`template.${index}`)
			);
		}
		return templates
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
		} else if (isSync && messages.length > 0) {
			const templates = this.getTemplatesFromBinding(binding);
			return (
				<MessageList
					messages				= { messages }
					messageType				= { this.props.messageType }
					onAction				= { this.onAction }
					user 					= { user }
					onClickShowComments 	= { this.onClickShowComments }
					onClickSubmitComment 	= { this.onClickSubmitComment }
					checkComments 			= { this.checkComments }
					templates 				= { templates }
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