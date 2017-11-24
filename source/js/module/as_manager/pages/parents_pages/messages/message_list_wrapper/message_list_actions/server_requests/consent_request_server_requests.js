const MessageConsts = require('module/ui/message_list/message/const/message_consts');

const ConsentRequestServerRequests = {
	updateConsentRequestTemplate: function(userType, messageId, data) {
		switch (userType) {
			case MessageConsts.USER_TYPE.PARENT:
				return window.Server.childMessage.put(
					{ messageId: messageId },
					{ fields: data }
				);
		}
	},
	getConsentRequestRequest: function(schoolId){
		return window.Server.consentRequestTemplate.get(schoolId);
	}
};

module.exports = ConsentRequestServerRequests;