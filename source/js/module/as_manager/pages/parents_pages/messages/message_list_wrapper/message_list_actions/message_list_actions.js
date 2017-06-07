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
		return window.Server.childMessageInbox.get({}, {filter: {limit: 100}});
	},
	loadOutboxMessages: function() {
		return window.Server.childMessageOutbox.get({}, {filter: {limit: 100}});
	},
	loadArchiveMessages: function() {
		return window.Server.childMessageArchive.get({}, {filter: {limit: 100}});
	},
	acceptInvitationMessage: function(messageId) {
		return window.Server.childMessageAccept.post({messageId:messageId});
	},
	declineInvitationMessage: function(messageId) {
		return window.Server.childMessageReject.post({messageId:messageId});
	}
};

module.exports = MessageListActions;