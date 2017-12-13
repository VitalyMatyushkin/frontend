const MessageConsts = require('module/ui/message_list/message/const/message_consts');

const MessageListActions = {
	messagesCountOnPage: 5,
	messageCountLimit: 5,
	loadMessages: function(messageType, activeSchoolId) {
		switch (messageType) {
			case MessageConsts.MESSAGE_TYPE.INBOX:
				return this.loadInboxMessages(activeSchoolId);
			case MessageConsts.MESSAGE_TYPE.OUTBOX:
				return this.loadOutboxMessages(activeSchoolId);
			case MessageConsts.MESSAGE_TYPE.ARCHIVE:
				return this.loadArchiveMessages(activeSchoolId);
		}
	},
	loadMessagesByPage: function (page, messageType, activeSchoolId) {
		switch (messageType) {
			case MessageConsts.MESSAGE_TYPE.INBOX:
				return this.loadInboxMessagesByPage(page, activeSchoolId);
			case MessageConsts.MESSAGE_TYPE.OUTBOX:
				return this.loadOutboxMessagesByPage(page, activeSchoolId);
			case MessageConsts.MESSAGE_TYPE.ARCHIVE:
				return this.loadArchiveMessagesByPage(page, activeSchoolId);
		}
	},
	loadInboxMessagesByPage: function(page, activeSchoolId) {
		return window.Server.schoolEventsMessagesInbox.get(
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
	loadOutboxMessagesByPage: function(page, activeSchoolId) {
		return window.Server.schoolEventsMessagesOutbox.get(
			{ schoolId: activeSchoolId },
			{
				filter: {
					skip: this.messagesCountOnPage * (page - 1),
					limit: this.messageCountLimit,
					order: 'updatedAt DESC'
				}
			}
		);
	},
	loadArchiveMessagesByPage: function(page, activeSchoolId) {
		return window.Server.schoolEventsMessagesArchive.get(
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
	loadInboxMessages: function(activeSchoolId) {
		return window.Server.schoolEventsMessagesInbox.get(
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
	loadOutboxMessages: function(activeSchoolId) {
		return window.Server.schoolEventsMessagesOutbox.get(
			{ schoolId: activeSchoolId },
			{
				filter: {
					limit: 1000,
					order: 'updatedAt DESC'
				}
			}
		);
	},
	loadArchiveMessages: function(activeSchoolId) {
		return window.Server.schoolEventsMessagesArchive.get(
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
	loadParentalConsentMessagesByEventId: function(schoolId, eventId) {
		return window.Server.schoolEventsMessages.get(
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
	loadParentRoleParentalConsentMessagesByEventId: function(eventId) {
		return window.Server.childEventMessages.get(
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
	loadParentalConsentMessagesCountByEventId: function(schoolId, eventId) {
		return window.Server.schoolEventsMessagesCount.get(
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
	loadParentalReportsMessagesByEventId: function(schoolId, eventId) {
		return window.Server.schoolEventsMessages.get(
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
	loadParentRoleParentalReportsMessagesByEventId: function(eventId) {
		return window.Server.childEventMessages.get(
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
	gotItRefusalMessage: function(activeSchoolId, messageId) {
		return window.Server.doGotItActionForEventMessage.post(
			{
				schoolId:	activeSchoolId,
				messageId:	messageId
			}
		);
	},
	gotItReportMessage: function(activeSchoolId, messageId) {
		return window.Server.doGotItActionForEventMessage.post(
			{
				schoolId:	activeSchoolId,
				messageId:	messageId
			}
		);
	}
};

module.exports = MessageListActions;