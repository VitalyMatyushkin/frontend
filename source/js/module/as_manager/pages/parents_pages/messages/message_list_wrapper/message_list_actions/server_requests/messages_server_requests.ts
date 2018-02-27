import * as BPromise from "bluebird";
import {ServiceList} from "module/core/service_list/service_list"

import * as MessageConsts from 'module/ui/message_list/message/const/message_consts'
import {Message} from "module/models/messages/message";

export const MessagesServerRequests = {
	messagesCountOnPage: 5,
	messageCountLimit: 5,
	loadInboxMessages(userType: MessageConsts.USER_TYPE.PARENT | MessageConsts.USER_TYPE.STUDENT): BPromise<Message[]>{
		switch (userType) {
			case MessageConsts.USER_TYPE.PARENT:
				return (window.Server as ServiceList).childMessageInbox.get({
					filter: {
						limit: 1000
					},
					order: 'updatedAt DESC'
				});
			case MessageConsts.USER_TYPE.STUDENT:
				return (window.Server as ServiceList).studentInboxMessages.get({
					filter: {
						limit: 1000,
						where: { allMessageTypes: true }
					},
					order: 'updatedAt DESC'
				});
		}
	},
	loadInboxMessagesByPage(
		page: number,
		userType: MessageConsts.USER_TYPE.PARENT | MessageConsts.USER_TYPE.STUDENT
	): BPromise<Message[]> {
		switch (userType) {
			case MessageConsts.USER_TYPE.PARENT:
				return (window.Server as ServiceList).childMessageInbox.get({
					filter: {
						skip: this.messagesCountOnPage * (page - 1),
						limit: this.messageCountLimit
					},
					order: 'updatedAt DESC'
				});
			case MessageConsts.USER_TYPE.STUDENT:
				return (window.Server as ServiceList).studentInboxMessages.get({
					filter: {
						skip: this.messagesCountOnPage * (page - 1),
						limit: this.messageCountLimit,
						where: { allMessageTypes: true }
					},
					order: 'updatedAt DESC'
				});
		}
	},
	loadOutboxMessages(userType: MessageConsts.USER_TYPE.PARENT | MessageConsts.USER_TYPE.STUDENT): BPromise<Message[]> {
		switch (userType) {
			case MessageConsts.USER_TYPE.PARENT:
				return (window.Server as ServiceList).childMessageOutbox.get({
					filter: {
						limit: 1000
					},
					order: 'updatedAt DESC'
				});
			case MessageConsts.USER_TYPE.STUDENT:
				return (window.Server as ServiceList).studentOutboxMessages.get({
					filter: {
						limit: 1000,
						where: { allMessageTypes: true }
					},
					order: 'updatedAt DESC'
				});
		}
	},
	loadOutboxMessagesByPage(
		page: number,
		userType: MessageConsts.USER_TYPE.PARENT | MessageConsts.USER_TYPE.STUDENT
	): BPromise<Message[]> {
		switch (userType) {
			case MessageConsts.USER_TYPE.PARENT:
				return (window.Server as ServiceList).childMessageOutbox.get({
					filter: {
						skip: this.messagesCountOnPage * (page - 1),
						limit: this.messageCountLimit
					},
					order: 'updatedAt DESC'
				});
			case MessageConsts.USER_TYPE.STUDENT:
				return (window.Server as ServiceList).studentOutboxMessages.get({
					filter: {
						skip: this.messagesCountOnPage * (page - 1),
						limit: this.messageCountLimit,
						where: { allMessageTypes: true }
					},
					order: 'updatedAt DESC'
				});
		}
	},
	loadArchiveMessages(userType: MessageConsts.USER_TYPE.PARENT | MessageConsts.USER_TYPE.STUDENT): BPromise<Message[]> {
		switch (userType) {
			case MessageConsts.USER_TYPE.PARENT:
				return (window.Server as ServiceList).childMessageArchive.get({
					filter: {
						limit: 1000,
						where: { allMessageTypes: true }
					},
					order: 'updatedAt DESC'
				});
			case MessageConsts.USER_TYPE.STUDENT:
				return (window.Server as ServiceList).studentArchiveMessages.get({
					filter: {
						limit: 1000,
						where: { allMessageTypes: true }
					},
					order: 'updatedAt DESC'
				});
		}
	},
	loadArchiveMessagesByPage(
		page: number,
		userType: MessageConsts.USER_TYPE.PARENT | MessageConsts.USER_TYPE.STUDENT
	): BPromise<Message[]> {
		switch (userType) {
			case MessageConsts.USER_TYPE.PARENT:
				return (window.Server as ServiceList).childMessageArchive.get({
					filter: {
						skip: this.messagesCountOnPage * (page - 1),
						limit: this.messageCountLimit,
						where: { allMessageTypes: true }
					},
					order: 'updatedAt DESC'
				});
			case MessageConsts.USER_TYPE.STUDENT:
				return (window.Server as ServiceList).studentArchiveMessages.get({
					filter: {
						skip: this.messagesCountOnPage * (page - 1),
						limit: this.messageCountLimit,
						where: { allMessageTypes: true }
					},
					order: 'updatedAt DESC'
				});
		}
	},
	acceptInvitationMessage(
		userType: MessageConsts.USER_TYPE.PARENT | MessageConsts.USER_TYPE.STUDENT,
		messageId: string
	): BPromise<any> {
		switch (userType) {
			case MessageConsts.USER_TYPE.PARENT:
				return (window.Server as ServiceList).childMessageAccept.post(
					{
						messageId: messageId
					}
				);
		}
	},
	acceptClubParticipantInvitationMessage(
		userType: MessageConsts.USER_TYPE.PARENT | MessageConsts.USER_TYPE.STUDENT,
		messageId: string
	): BPromise<any> {
		switch (userType) {
			case MessageConsts.USER_TYPE.PARENT:
				return (window.Server as ServiceList).childClubMessageAccept.post(
					{
						messageId: messageId
					}
				);
		}
	},
	declineInvitationMessage(
		userType: MessageConsts.USER_TYPE.PARENT | MessageConsts.USER_TYPE.STUDENT,
		messageId: string
	): BPromise<any> {
		switch (userType) {
			case MessageConsts.USER_TYPE.PARENT:
				return (window.Server as ServiceList).childMessageReject.post(
					{
						messageId: messageId
					}
				);
		}
	},
	declineClubParticipantInvitationMessage(
		userType: MessageConsts.USER_TYPE.PARENT | MessageConsts.USER_TYPE.STUDENT,
		messageId: string
	): BPromise<any> {
		switch (userType) {
			case MessageConsts.USER_TYPE.PARENT:
				return (window.Server as ServiceList).childClubMessageReject.post(
					{
						messageId: messageId
					}
				);
		}
	}
};