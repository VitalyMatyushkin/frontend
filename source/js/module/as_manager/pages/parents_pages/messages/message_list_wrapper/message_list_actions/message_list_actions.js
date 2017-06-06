const	Promise			= require('bluebird'),
		Immutable		= require('immutable'),
		MessageConsts	= require('module/ui/message_list/message/const/message_consts');

const MessageListActions = {
	loadMessages: function(messageType) {
		switch (messageType) {
			case MessageConsts.MESSAGE_TYPE.INBOX:
				return this.loadInboxMessages();
			case MessageConsts.MESSAGE_TYPE.OUTBOX:
				return this.loadOutboxMessages();
			case MessageConsts.MESSAGE_TYPE.ARCHIVE:
				return this.loadArchiveMessages();
		}
	},
	loadInboxMessages: function() {
		return window.Server.childMessageInbox.get();
	},
	loadOutboxMessages: function() {
		return window.Server.childMessageOutbox.get();
	},
	loadArchiveMessages: function() {
		return window.Server.childMessageArchive.get();
	}
};

module.exports = MessageListActions;