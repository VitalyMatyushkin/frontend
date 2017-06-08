const MessageConsts = require('module/ui/message_list/message/const/message_consts');

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
		return window.Server.childMessageInbox.get({
			filter: {
				limit: 1000
			},
			order: 'updatedAt DESC'
		});
	},
	loadOutboxMessages: function() {
		return window.Server.childMessageOutbox.get({
			filter: {
				limit: 1000
			},
			order: 'updatedAt DESC'
		});
	},
	loadArchiveMessages: function() {
		return window.Server.childMessageArchive.get({
			filter: {
				limit: 1000
			},
			order: 'updatedAt DESC'
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
	}
};

module.exports = MessageListActions;