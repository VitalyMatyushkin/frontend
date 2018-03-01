import {ServiceList} from "module/core/service_list/service_list";

import * as MessageConsts from 'module/ui/message_list/message/const/message_consts'
import * as BPromise from "bluebird";

export const ConsentRequestServerRequests = {
	updateConsentRequestTemplate(
		userType: MessageConsts.USER_TYPE.PARENT | MessageConsts.USER_TYPE.STUDENT,
		messageId: string,
		data: any
	):BPromise<void> {
		switch (userType) {
			case MessageConsts.USER_TYPE.PARENT:
				return (window.Server as ServiceList).childMessage.put(
					{ messageId },
					{ fields: data }
				);
		}
	},
	getConsentRequestRequest(schoolId: string):BPromise<any> {
		return (window.Server as ServiceList).consentRequestTemplate.get({ schoolId } );
	}
};