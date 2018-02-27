import * as React from "react";
import * as Immutable from 'immutable'

import {MessagesServerRequests} from 'module/as_manager/pages/parents_pages/messages/message_list_wrapper/message_list_actions/server_requests/messages_server_requests'
import {CommentServerRequests} from 'module/as_manager/pages/parents_pages/messages/message_list_wrapper/message_list_actions/server_requests/comment_server_requests'
import {ConsentRequestServerRequests} from 'module/as_manager/pages/parents_pages/messages/message_list_wrapper/message_list_actions/server_requests/consent_request_server_requests'

import {ServiceList} from "module/core/service_list/service_list";

import * as MessageConsts from 'module/ui/message_list/message/const/message_consts'
import * as RandomHelper from 'module/helpers/random_helper'

export const MessageListActions = {
	reloadMessageList(binding) {
		binding.set('messagesListKey', RandomHelper.getRandomString());
	},
	onAction(
		binding: any,
		userType: MessageConsts.USER_TYPE.PARENT | MessageConsts.USER_TYPE.STUDENT,
		boxType: (
			MessageConsts.MESSAGE_TYPE.INBOX |
			MessageConsts.MESSAGE_TYPE.OUTBOX |
			MessageConsts.MESSAGE_TYPE.ARCHIVE
		),
		messageId: string,
		messageKind: (
			MessageConsts.MESSAGE_KIND.INVITATION |
			MessageConsts.MESSAGE_KIND.AVAILABILITY |
			MessageConsts.MESSAGE_KIND.REFUSAL |
			MessageConsts.MESSAGE_KIND.CLUB_PARTICIPANT_INVITE
		),
		actionType: (
			MessageConsts.MESSAGE_INVITATION_ACTION_TYPE.ACCEPT |
			MessageConsts.MESSAGE_INVITATION_ACTION_TYPE.DECLINE |
			MessageConsts.MESSAGE_INVITATION_ACTION_TYPE.GOT_IT
		),
		templateData: any
	) {
		switch (messageKind) {
			case MessageConsts.MESSAGE_KIND.INVITATION:
				return this.onActionForRefusalMessage(binding, userType, boxType, messageId, actionType, templateData);
			case MessageConsts.MESSAGE_KIND.CLUB_PARTICIPANT_INVITE:
				return this.onActionForClubParticipantInvitationMessage(binding, userType, boxType, messageId, actionType);
		}
	},
	onActionForRefusalMessage(
		binding: any,
		userType: MessageConsts.USER_TYPE.PARENT | MessageConsts.USER_TYPE.STUDENT,
		boxType: (
			MessageConsts.MESSAGE_TYPE.INBOX |
			MessageConsts.MESSAGE_TYPE.OUTBOX |
			MessageConsts.MESSAGE_TYPE.ARCHIVE
		),
		messageId: string,
		actionType: (
			MessageConsts.MESSAGE_INVITATION_ACTION_TYPE.ACCEPT |
			MessageConsts.MESSAGE_INVITATION_ACTION_TYPE.DECLINE |
			MessageConsts.MESSAGE_INVITATION_ACTION_TYPE.GOT_IT
		),
		templateData: any
	) {
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
	onActionForClubParticipantInvitationMessage(
		binding: any,
		userType: MessageConsts.USER_TYPE.PARENT | MessageConsts.USER_TYPE.STUDENT,
		boxType: (
			MessageConsts.MESSAGE_TYPE.INBOX |
			MessageConsts.MESSAGE_TYPE.OUTBOX |
			MessageConsts.MESSAGE_TYPE.ARCHIVE
		),
		messageId: string,
		actionType: (
			MessageConsts.MESSAGE_INVITATION_ACTION_TYPE.ACCEPT |
			MessageConsts.MESSAGE_INVITATION_ACTION_TYPE.DECLINE |
			MessageConsts.MESSAGE_INVITATION_ACTION_TYPE.GOT_IT
		)
	) {
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
	loadMessages(
		userType: MessageConsts.USER_TYPE.PARENT | MessageConsts.USER_TYPE.STUDENT,
		boxType: (
			MessageConsts.MESSAGE_TYPE.INBOX |
			MessageConsts.MESSAGE_TYPE.OUTBOX |
			MessageConsts.MESSAGE_TYPE.ARCHIVE
		)
	) {
		switch (boxType) {
			case MessageConsts.MESSAGE_TYPE.INBOX:
				return MessagesServerRequests.loadInboxMessages(userType);
			case MessageConsts.MESSAGE_TYPE.OUTBOX:
				return MessagesServerRequests.loadOutboxMessages(userType);
			case MessageConsts.MESSAGE_TYPE.ARCHIVE:
				return MessagesServerRequests.loadArchiveMessages(userType);
		}
	},
	loadMessagesByPage (
		page: number,
		userType: MessageConsts.USER_TYPE.PARENT | MessageConsts.USER_TYPE.STUDENT,
		boxType: (
			MessageConsts.MESSAGE_TYPE.INBOX |
			MessageConsts.MESSAGE_TYPE.OUTBOX |
			MessageConsts.MESSAGE_TYPE.ARCHIVE
		)
	) {
		switch (boxType) {
			case MessageConsts.MESSAGE_TYPE.INBOX:
				return MessagesServerRequests.loadInboxMessagesByPage(page, userType);
			case MessageConsts.MESSAGE_TYPE.OUTBOX:
				return MessagesServerRequests.loadOutboxMessagesByPage(page, userType);
			case MessageConsts.MESSAGE_TYPE.ARCHIVE:
				return MessagesServerRequests.loadArchiveMessagesByPage(page, userType);
		}
	},
	onClickShowComments(
		binding: any,
		userType: MessageConsts.USER_TYPE.PARENT | MessageConsts.USER_TYPE.STUDENT,
		messageId: string
	) {
		const messageIndex = binding.toJS('messages').findIndex(message => message.id === messageId);
		const isShowComments = Boolean(binding.toJS(`messages.${messageIndex}.isShowComments`));

		binding.set(`messages.${messageIndex}.isShowComments`, !isShowComments);
		binding.set(`messages.${messageIndex}.isSyncComments`, false);

		if(!isShowComments) {
			CommentServerRequests.getCommentsByMessageId(userType, messageId).then(
				comments => {
					binding.set(`messages.${messageIndex}.comments`, Immutable.fromJS(comments));
					binding.set(`messages.${messageIndex}.commentsCount`, comments.length);
					binding.set(`messages.${messageIndex}.isSyncComments`, true);
				}
			);
		}
	},
	onClickSubmitComment(
		binding: any,
		userType: MessageConsts.USER_TYPE.PARENT | MessageConsts.USER_TYPE.STUDENT,
		newCommentText: string,
		replyComment: {id: string}, // TODO add another fields
		messageId: string
	){
		const messageIndex = binding.toJS('messages').findIndex(message => message.id === messageId);

		const commentData:{text: string, replyToCommentId?: string} = {
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
	checkComments(
		binding: any,
		userType: MessageConsts.USER_TYPE.PARENT | MessageConsts.USER_TYPE.STUDENT,
		messageId: string
	) {
		const messageIndex = binding.toJS('messages').findIndex(message => message.id === messageId);

		return CommentServerRequests.getCommentsCountByMessageId(userType, messageId).then(res => {
				const oldCount = binding.get(`messages.${messageIndex}.commentsCount`);

				if(oldCount && oldCount !== res.count) {
					this.setComments(binding, messageId);
				}

				return true;
			})
	},
	setComments(
		binding: any,
		userType: MessageConsts.USER_TYPE.PARENT | MessageConsts.USER_TYPE.STUDENT,
		messageId: string
	){
		const messageIndex = binding.toJS('messages').findIndex(message => message.id === messageId);

		return CommentServerRequests.getCommentsByMessageId(userType, messageId)
			.then(comments => {
				binding.set(`messages.${messageIndex}.comments`, Immutable.fromJS(comments));
				binding.set(`messages.${messageIndex}.commentsCount`, comments.length);

				return true;
			});
	},
	updateConsentRequestTemplate(
		userType: MessageConsts.USER_TYPE.PARENT | MessageConsts.USER_TYPE.STUDENT,
		messageId: string,
		templateData: any
	){
		return ConsentRequestServerRequests.updateConsentRequestTemplate(userType, messageId, templateData);
	},
	setConsentRequestTemplates(
		binding: any,
		userType: MessageConsts.USER_TYPE.PARENT | MessageConsts.USER_TYPE.STUDENT
	) {
		switch (userType) {
			case MessageConsts.USER_TYPE.PARENT: {
				return this.getChildrenSchoolIds()
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
	getLoggedUser() {
		return (window.Server as ServiceList).profile.get();
	},
	setSync(binding: any, value: boolean) {
		binding.set('isSync', value);
	},
	getChildrenSchoolIds () {
		return (window.Server as ServiceList).children.get().then(children => {
			return children.map(child => child.schoolId);
		});
	},
    acceptInvitationMessage(messageId: string) {
        return (window.Server as ServiceList).childMessageAccept.post(
            {
                messageId: messageId
            }
        );
    },
    declineInvitationMessage(messageId: string) {
        return (window.Server as ServiceList).childMessageReject.post(
            {
                messageId: messageId
            }
        );
    },
    sendConsentRequestTemplateWithValue(messageId: string, templateData: any) {
        return (window.Server as ServiceList).childMessage.put({ messageId: messageId }, { fields: templateData });
    }
};