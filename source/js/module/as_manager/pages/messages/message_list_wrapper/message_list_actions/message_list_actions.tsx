import * as BPromise from 'bluebird'
import {ServiceList} from "module/core/service_list/service_list"

import * as MessageConsts from 'module/ui/message_list/message/const/message_consts'
import {Message} from "module/models/messages/message";

export const MessageListActions = {
	messagesCountOnPage: 5,
	messageCountLimit: 5,
	loadMessages(
		messageType: MessageConsts.MESSAGE_TYPE.INBOX | MessageConsts.MESSAGE_TYPE.OUTBOX | MessageConsts.MESSAGE_TYPE.ARCHIVE,
		activeSchoolId: string
	): BPromise<Message[]> {
		switch (messageType) {
			case MessageConsts.MESSAGE_TYPE.INBOX:
				return this.loadInboxMessages(activeSchoolId);
			case MessageConsts.MESSAGE_TYPE.OUTBOX:
				return this.loadOutboxMessages(activeSchoolId);
			case MessageConsts.MESSAGE_TYPE.ARCHIVE:
				return this.loadArchiveMessages(activeSchoolId);
		}
	},
	loadMessagesByPage(
		page: number,
		messageType: MessageConsts.MESSAGE_TYPE.INBOX | MessageConsts.MESSAGE_TYPE.OUTBOX | MessageConsts.MESSAGE_TYPE.ARCHIVE,
		activeSchoolId: string
	): BPromise<Message[]> {
		switch (messageType) {
			case MessageConsts.MESSAGE_TYPE.INBOX:
				return this.loadInboxMessagesByPage(page, activeSchoolId);
			case MessageConsts.MESSAGE_TYPE.OUTBOX:
				return this.loadOutboxMessagesByPage(page, activeSchoolId);
			case MessageConsts.MESSAGE_TYPE.ARCHIVE:
				return this.loadArchiveMessagesByPage(page, activeSchoolId);
		}
	},
	loadInboxMessagesByPage(page: number, activeSchoolId: string): BPromise<Message[]> {
		return (window.Server as ServiceList).schoolEventsMessagesInbox.get(
			{ schoolId: activeSchoolId },
			{
				filter: {
					skip: this.messagesCountOnPage * (page - 1),
					limit: this.messageCountLimit,
					order: 'updatedAt DESC',
					where: { allMessageTypes: true }
				}
			}
		);
	},
	loadOutboxMessagesByPage(page: number, activeSchoolId: string): BPromise<Message[]> {
		return (window.Server as ServiceList).schoolEventsMessagesOutbox.get(
			{ schoolId: activeSchoolId },
			{
				filter: {
					skip: this.messagesCountOnPage * (page - 1),
					limit: this.messageCountLimit,
					order: 'updatedAt DESC',
					where: { allMessageTypes: true }
				}
			}
		);
	},
	loadArchiveMessagesByPage(page: number, activeSchoolId: string): BPromise<Message[]> {
		return (window.Server as ServiceList).schoolEventsMessagesArchive.get(
			{ schoolId: activeSchoolId },
			{
				filter: {
					skip: this.messagesCountOnPage * (page - 1),
					limit: this.messageCountLimit,
					order: 'updatedAt DESC',
					where: { allMessageTypes: true }
				}
			}
		);
	},
	loadInboxMessages(activeSchoolId: string): BPromise<Message[]> {
		return (window.Server as ServiceList).schoolEventsMessagesInbox.get(
			{ schoolId: activeSchoolId },
			{
				filter: {
					limit: 1000,
					order: 'updatedAt DESC',
					where: { allMessageTypes: true }
				}
			}
		);
	},
	loadOutboxMessages(activeSchoolId: string): BPromise<Message[]> {
		return (window.Server as ServiceList).schoolEventsMessagesOutbox.get(
			{ schoolId: activeSchoolId },
			{
				filter: {
					limit: 1000,
					order: 'updatedAt DESC'
				}
			}
		);
	},
	loadArchiveMessages(activeSchoolId: string): BPromise<Message[]> {
		return (window.Server as ServiceList).schoolEventsMessagesArchive.get(
			{ schoolId: activeSchoolId },
			{
				filter: {
					limit: 1000,
					order: 'updatedAt DESC',
					where: { allMessageTypes: true }
				}
			}
		);
	},
	loadParentalConsentMessagesByEventId(schoolId: string, eventId: string): BPromise<Message[]> {
		return (window.Server as ServiceList).schoolEventsMessages.get(
			{ schoolId: schoolId },
			{
				filter:		{
					where:		{
									eventId:	eventId,
									kind:		MessageConsts.MESSAGE_KIND.INVITATION
								},
					limit:		1000
				}
			}
		);
	},
	loadParentRoleParentalConsentMessagesByEventId(eventId: string): BPromise<Message[]> {
		return (window.Server as ServiceList).childEventMessages.get(
			{ eventId: eventId },
			{
				filter:		{
					where:		{
						kind:		MessageConsts.MESSAGE_KIND.INVITATION
					},
					limit:		1000
				}
			}
		);
	},
	loadParentalConsentMessagesCountByEventId(schoolId: string, eventId: string): BPromise<Message[]> {
		return (window.Server as ServiceList).schoolEventsMessagesCount.get(
			{ schoolId: schoolId },
			{
				filter:		{
					where:		{
						eventId:	eventId,
						kind:		MessageConsts.MESSAGE_KIND.REFUSAL
					},
					limit:		1000
				}
			}
		);
	},
	loadParentalReportsMessagesByEventId(schoolId: string, eventId: string): BPromise<Message[]> {
		return (window.Server as ServiceList).schoolEventsMessages.get(
			{ schoolId: schoolId },
			{
				filter:		{
					where:		{
						eventId:	eventId,
						$or: [
							{ kind:		MessageConsts.MESSAGE_KIND.AVAILABILITY },
							{ kind:		MessageConsts.MESSAGE_KIND.REFUSAL }
						]
					},
					limit:		1000
				}
			}
		);
	},
	loadParentRoleParentalReportsMessagesByEventId(eventId: string): BPromise<Message[]> {
		return (window.Server as ServiceList).childEventMessages.get(
			{ eventId: eventId },
			{
				filter:		{
					where:		{
						eventId:	eventId,
						$or: [
							{ kind:		MessageConsts.MESSAGE_KIND.AVAILABILITY },
							{ kind:		MessageConsts.MESSAGE_KIND.REFUSAL }
						]
					},
					limit:		1000
				}
			}
		);
	},
	gotItRefusalMessage(activeSchoolId: string, messageId: string): BPromise<any> {
		return (window.Server as ServiceList).doGotItActionForEventMessage.post(
			{
				schoolId:	activeSchoolId,
				messageId:	messageId
			}
		);
	},
	gotItReportMessage(activeSchoolId: string, messageId: string): BPromise<any> {
		return (window.Server as ServiceList).doGotItActionForEventMessage.post(
			{
				schoolId:	activeSchoolId,
				messageId:	messageId
			}
		);
	}
};