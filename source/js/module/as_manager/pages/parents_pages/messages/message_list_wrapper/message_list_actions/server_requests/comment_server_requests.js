const MessageConsts = require('module/ui/message_list/message/const/message_consts');

const CommentServerRequests = {
	postCommentByMessageId: function(userType, messageId, commentData) {
		switch (userType) {
			case MessageConsts.USER_TYPE.PARENT:
				return window.Server.childrenEventMessageComments.post(
					{ messageId: messageId },
					commentData
				);
		}
	},
	getCommentsCountByMessageId: function(userType, messageId) {
		switch (userType) {
			case MessageConsts.USER_TYPE.PARENT:
				return window.Server.childrenEventMessageCommentsCount.get( { messageId: messageId } );
		}
	},
	getCommentsByMessageId: function(userType, messageId){
		switch (userType) {
			case MessageConsts.USER_TYPE.PARENT:
				return window.Server.childrenEventMessageComments.get(
					{ messageId: messageId },
					{ filter: { limit: 100 } }
				);
		}
	}
};

module.exports = CommentServerRequests;