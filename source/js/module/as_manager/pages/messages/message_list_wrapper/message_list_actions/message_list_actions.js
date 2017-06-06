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
	loadInboxMessages: function(activeSchoolId) {
		return window.Server.schoolEventsMessagesInbox.get({schoolId: activeSchoolId});
	},
	loadOutboxMessages: function(activeSchoolId) {
		return window.Server.schoolEventsMessagesOutbox.get({schoolId: activeSchoolId});
	},
	loadArchiveMessages: function(activeSchoolId) {
		return window.Server.schoolEventsMessagesArchive.get({schoolId: activeSchoolId});
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