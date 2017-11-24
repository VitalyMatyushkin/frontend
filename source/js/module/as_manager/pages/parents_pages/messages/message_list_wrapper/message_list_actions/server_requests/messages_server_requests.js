const MessageConsts = require('module/ui/message_list/message/const/message_consts');

const MessagesServerRequests = {
	loadInboxMessages: function(userType) {
		switch (userType) {
			case MessageConsts.USER_TYPE.PARENT:
				return window.Server.childMessageInbox.get({
					filter: {
						limit: 1000
					},
					order: 'updatedAt DESC'
				});
			case MessageConsts.USER_TYPE.STUDENT:
				return window.Server.studentInboxMessages.get({
					filter: {
						limit: 1000,
						where: { allMessageTypes: true }
					},
					order: 'updatedAt DESC'
				});
		}
	},
	loadOutboxMessages: function(userType) {
		switch (userType) {
			case MessageConsts.USER_TYPE.PARENT:
				return window.Server.childMessageOutbox.get({
					filter: {
						limit: 1000
					},
					order: 'updatedAt DESC'
				});
			case MessageConsts.USER_TYPE.STUDENT:
				return window.Server.studentOutboxMessages.get({
					filter: {
						limit: 1000,
						where: { allMessageTypes: true }
					},
					order: 'updatedAt DESC'
				});
		}
	},
	loadArchiveMessages: function(userType) {
		switch (userType) {
			case MessageConsts.USER_TYPE.PARENT:
				return window.Server.childMessageArchive.get({
					filter: {
						limit: 1000
					},
					order: 'updatedAt DESC'
				});
			case MessageConsts.USER_TYPE.STUDENT:
				return window.Server.studentArchiveMessages.get({
					filter: {
						limit: 1000,
						where: { allMessageTypes: true }
					},
					order: 'updatedAt DESC'
				});
		}
	},
	acceptInvitationMessage: function(userType, messageId) {
		switch (userType) {
			case MessageConsts.USER_TYPE.PARENT:
				return window.Server.childMessageAccept.post(
					{
						messageId: messageId
					}
				);
			case MessageConsts.USER_TYPE.STUDENT:
				return window.Server.studentArchiveMessages.get({
					filter: {
						limit: 1000
					},
					order: 'updatedAt DESC'
				});
		}
	},
	declineInvitationMessage: function(userType, messageId) {
		switch (userType) {
			case MessageConsts.USER_TYPE.PARENT:
				return window.Server.childMessageReject.post(
					{
						messageId: messageId
					}
				);
		}
	}
};

module.exports = MessagesServerRequests;