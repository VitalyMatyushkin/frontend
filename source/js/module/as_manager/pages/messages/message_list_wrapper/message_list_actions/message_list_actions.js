const	Promise			= require('bluebird'),
		Immutable		= require('immutable'),
		MessageConsts	= require('module/ui/message_list/message/const/message_consts');

const MessageListActions = {
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
	loadMessagesByEventId: function(messagesType, activeSchoolId, eventId) {
		switch (messagesType) {
			case MessageConsts.MESSAGE_TYPE.INBOX:
				return this.loadInboxMessagesByEventId(activeSchoolId, eventId);
			case MessageConsts.MESSAGE_TYPE.OUTBOX:
				return this.loadOutboxMessagesByEventId(activeSchoolId, eventId);
			case MessageConsts.MESSAGE_TYPE.ARCHIVE:
				return this.loadArchiveMessagesByEventId(activeSchoolId, eventId);
		}
	},
	loadInboxMessages: function(activeSchoolId) {
		return window.Server.schoolEventsMessagesInbox.get(
			{
				schoolId: activeSchoolId,
				filter: {
					limit: 1000
				}
			}
		);
	},
	loadOutboxMessages: function(activeSchoolId) {
		return window.Server.schoolEventsMessagesOutbox.get(
			{
				schoolId: activeSchoolId,
				filter: {
					limit: 1000
				}
			}
		);
	},
	loadArchiveMessages: function(activeSchoolId) {
		return window.Server.schoolEventsMessagesArchive.get(
			{
				schoolId: activeSchoolId,
				filter: {
					limit: 1000
				}
			}
		);
	},
	loadInboxMessagesByEventId: function(activeSchoolId, eventId) {
		return window.Server.schoolEventsMessagesInbox.get(
			{
				schoolId: activeSchoolId,
				filter: {
					where: {
						eventId: eventId
					},
					limit: 1000
				}
			}
		).then(messages => messages.filter(m => m.eventId === eventId));
	},
	loadOutboxMessagesByEventId: function(activeSchoolId, eventId) {
		return window.Server.schoolEventsMessagesOutbox.get(
			{
				schoolId: activeSchoolId,
				filter: {
					where: {
						eventId: eventId
					},
					limit: 1000
				}
			}
		).then(messages => messages.filter(m => m.eventId === eventId));
	},
	loadArchiveMessagesByEventId: function(activeSchoolId, eventId) {
		return window.Server.schoolEventsMessagesArchive.get(
			{
				schoolId: activeSchoolId,
				filter: {
					where: {
						eventId: eventId
					},
					limit: 1000
				}
			}
		).then(messages => messages.filter(m => m.eventId === eventId));
	},
	gotItRefusalMessage: function(activeSchoolId, messageId) {
		return window.Server.doGotItActionForEventMessage.post(
			{
				schoolId:	activeSchoolId,
				messageId:	messageId
			}
		);
	}
};

module.exports = MessageListActions;