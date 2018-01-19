const	Immutable						= require('immutable');

const	MessagesServerRequests			= require('module/as_manager/pages/parents_pages/messages/message_list_wrapper/message_list_actions/server_requests/messages_server_requests'),
		CommentServerRequests			= require('module/as_manager/pages/parents_pages/messages/message_list_wrapper/message_list_actions/server_requests/comment_server_requests'),
		ConsentRequestServerRequests	= require('module/as_manager/pages/parents_pages/messages/message_list_wrapper/message_list_actions/server_requests/consent_request_server_requests');

const	MessageConsts	= require('module/ui/message_list/message/const/message_consts'),
		RandomHelper	= require('module/helpers/random_helper');

const MessageListActions = {
	reloadMessageList: function(binding) {
		binding.set('messagesListKey', RandomHelper.getRandomString());
	},
	onAction: function(binding, userType, boxType, messageId, messageKind, actionType, templateData) {
		switch (messageKind) {
			case MessageConsts.MESSAGE_KIND.INVITATION:
				return this.onActionForRefusalMessage(binding, userType, boxType, messageId, actionType, templateData);
			case MessageConsts.MESSAGE_KIND.CLUB_PARTICIPANT_INVITE:
				return this.onActionForClubParticipantInvitationMessage(binding, userType, boxType, messageId, actionType);
		}
	},
	onActionForRefusalMessage: function(binding, userType, boxType, messageId, actionType, templateData) {
		switch (actionType) {
			case MessageConsts.MESSAGE_INVITATION_ACTION_TYPE.ACCEPT:
				return MessagesServerRequests.acceptInvitationMessage(userType, messageId)
					.then(() => this.updateConsentRequestTemplate(userType, messageId, templateData))
					.then(() => {
						this.reloadMessageList(binding);

						return true;
					});
			case MessageConsts.MESSAGE_INVITATION_ACTION_TYPE.DECLINE:
				return MessagesServerRequests.declineInvitationMessage(userType, messageId)
					.then(() => {
						this.reloadMessageList(binding);

						return true;
					});
		}
	},
	onActionForClubParticipantInvitationMessage: function(binding, userType, boxType, messageId, actionType) {
		switch (actionType) {
			case MessageConsts.MESSAGE_INVITATION_ACTION_TYPE.ACCEPT:
				return MessagesServerRequests.acceptClubParticipantInvitationMessage(userType, messageId)
					.then(() => {
						this.reloadMessageList(binding);

						return true;
					});
			case MessageConsts.MESSAGE_INVITATION_ACTION_TYPE.DECLINE:
				return MessagesServerRequests.declineClubParticipantInvitationMessage(userType, messageId)
					.then(() => {
						this.reloadMessageList(binding);

						return true;
					});
		}
	},
	loadMessages: function(userType, boxType) {
		switch (boxType) {
			case MessageConsts.MESSAGE_TYPE.INBOX:
				return MessagesServerRequests.loadInboxMessages(userType);
			case MessageConsts.MESSAGE_TYPE.OUTBOX:
				return MessagesServerRequests.loadOutboxMessages(userType);
			case MessageConsts.MESSAGE_TYPE.ARCHIVE:
				return MessagesServerRequests.loadArchiveMessages(userType);
		}
	},
	loadMessagesByPage: function (page, userType, boxType) {
		switch (boxType) {
			case MessageConsts.MESSAGE_TYPE.INBOX:
				return MessagesServerRequests.loadInboxMessagesByPage(page, userType);
			case MessageConsts.MESSAGE_TYPE.OUTBOX:
				return MessagesServerRequests.loadOutboxMessagesByPage(page, userType);
			case MessageConsts.MESSAGE_TYPE.ARCHIVE:
				return MessagesServerRequests.loadArchiveMessagesByPage(page, userType);
		}
	},
	onClickShowComments: function(binding, userType, messageId){
		const messageIndex = binding.toJS('messages').findIndex(message => message.id === messageId);
		const isShowComments = Boolean(binding.toJS(`messages.${messageIndex}.isShowComments`));

		binding.atomically()
			.set(`messages.${messageIndex}.isShowComments`, !isShowComments)
			.set(`messages.${messageIndex}.isSyncComments`, false)
			.commit();

		if(!isShowComments) {
			CommentServerRequests.getCommentsByMessageId(messageId).then(
				comments => {
					binding.atomically()
						.set(`messages.${messageIndex}.comments`,		Immutable.fromJS(comments))
						.set(`messages.${messageIndex}.commentsCount`,	comments.length)
						.set(`messages.${messageIndex}.isSyncComments`,	true)
						.commit();
				}
			);
		}
	},
	onClickSubmitComment: function(binding, userType, newCommentText, replyComment, messageId){
		const messageIndex = binding.toJS('messages').findIndex(message => message.id === messageId);

		const commentData = {
			text: newCommentText
		};
		if(typeof replyComment !== 'undefined') {
			commentData.replyToCommentId = replyComment.id;
		}

		return CommentServerRequests.postCommentByMessageId(userType, messageId, commentData)
			.then(comment => {
				const comments = binding.toJS(`messages.${messageIndex}.comments`);
				const commentsCount = binding.toJS(`messages.${messageIndex}.commentsCount`);

				comments.push(comment);

				binding.set(`messages.${messageIndex}.commentsCount`, Immutable.fromJS(commentsCount + 1));
				binding.set(`messages.${messageIndex}.comments`, Immutable.fromJS(comments))
			});
	},
	checkComments: function(binding, userType, messageId) {
		const messageIndex = binding.toJS('messages').findIndex(message => message.id === messageId);

		return CommentServerRequests.getCommentsCountByMessageId(userType, messageId).then(res => {
				const oldCount = binding.get(`messages.${messageIndex}.commentsCount`);

				if(oldCount && oldCount !== res.count) {
					this.setComments(binding, messageId);
				}

				return true;
			})
	},
	setComments: function(binding, userType, messageId){
		const messageIndex = binding.toJS('messages').findIndex(message => message.id === messageId);

		return CommentServerRequests.getCommentsByMessageId(userType, messageId)
			.then(comments => {
				binding.set(`messages.${messageIndex}.comments`, Immutable.fromJS(comments));
				binding.set(`messages.${messageIndex}.commentsCount`, comments.length);

				return true;
			});
	},
	updateConsentRequestTemplate: function(userType, messageId, templateData){
		return ConsentRequestServerRequests.updateConsentRequestTemplate(userType, messageId, templateData);
	},
	setConsentRequestTemplates: function(binding, userType) {
		switch (userType) {
			case MessageConsts.USER_TYPE.PARENT: {
				this.getChildrenSchoolIds()
					.then(schoolIds => {
						return Promise.all(
							schoolIds.map(schoolId => ConsentRequestServerRequests.getConsentRequestRequest(schoolId))
						)
					})
					.then(templates => {
						binding.set('template', Immutable.fromJS(templates));

						return true;
					});
			}
			case MessageConsts.USER_TYPE.STUDENT: {
				binding.set('template', Immutable.fromJS([]));

				return Promise.resolve('');
			}
		}
	},
	getLoggedUser: function() {
		return window.Server.profile.get();
	},
	setSync: function(binding, value) {
		binding.set('isSync', value);
	},
	getChildrenSchoolIds: function () {
		return window.Server.children.get().then(children => {
			return children.map(child => child.schoolId);
		});
	},
    acceptInvitationMessage: function(messageId) {
        return window.Server.childMessageAccept.post(
            {
                messageId: messageId
            }
        );
    },
    declineInvitationMessage: function(messageId) {
        return window.Server.childMessageReject.post(
            {
                messageId: messageId
            }
        );
    },
    sendConsentRequestTemplateWithValue: function(messageId, templateData){
        return window.Server.childMessage.put({ messageId: messageId }, { fields: templateData });
    }
};

module.exports = MessageListActions;