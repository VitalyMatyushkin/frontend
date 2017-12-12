const MessageConsts = require('module/ui/message_list/message/const/message_consts');

const MessagesServerRequests = {
	messagesCountOnPage: 5,
	messageCountLimit: 5,
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
	loadInboxMessagesByPage: function(page, userType) {
		switch (userType) {
			case MessageConsts.USER_TYPE.PARENT:
				return window.Server.childMessageInbox.get({
					filter: {
						skip: this.messagesCountOnPage * (page - 1),
						limit: this.messageCountLimit
					},
					order: 'updatedAt DESC'
				});
			case MessageConsts.USER_TYPE.STUDENT:
				return window.Server.studentInboxMessages.get({
					filter: {
						skip: this.messagesCountOnPage * (page - 1),
						limit: this.messageCountLimit,
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
	loadOutboxMessagesByPage: function(page, userType) {
		switch (userType) {
			case MessageConsts.USER_TYPE.PARENT:
				return window.Server.childMessageOutbox.get({
					filter: {
						skip: this.messagesCountOnPage * (page - 1),
						limit: this.messageCountLimit
					},
					order: 'updatedAt DESC'
				});
			case MessageConsts.USER_TYPE.STUDENT:
				return window.Server.studentOutboxMessages.get({
					filter: {
						skip: this.messagesCountOnPage * (page - 1),
						limit: this.messageCountLimit,
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
						limit: 1000,
						where: { allMessageTypes: true }
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
	loadArchiveMessagesByPage: function(page, userType) {
		switch (userType) {
			case MessageConsts.USER_TYPE.PARENT:
				return window.Server.childMessageArchive.get({
					filter: {
						skip: this.messagesCountOnPage * (page - 1),
						limit: this.messageCountLimit,
						where: { allMessageTypes: true }
					},
					order: 'updatedAt DESC'
				});
			case MessageConsts.USER_TYPE.STUDENT:
				return window.Server.studentArchiveMessages.get({
					filter: {
						skip: this.messagesCountOnPage * (page - 1),
						limit: this.messageCountLimit,
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
	acceptClubParticipantInvitationMessage: function(userType, messageId) {
		switch (userType) {
			case MessageConsts.USER_TYPE.PARENT:
				return window.Server.childClubMessageAccept.post(
					{
						messageId: messageId
					}
				);
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
	},
	declineClubParticipantInvitationMessage: function(userType, messageId) {
		switch (userType) {
			case MessageConsts.USER_TYPE.PARENT:
				return window.Server.childClubMessageReject.post(
					{
						messageId: messageId
					}
				);
		}
	}
};

module.exports = MessagesServerRequests;