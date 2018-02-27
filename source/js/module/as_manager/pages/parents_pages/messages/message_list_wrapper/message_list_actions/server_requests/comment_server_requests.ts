import * as BPromise from 'bluebird'
import {ServiceList} from "module/core/service_list/service_list";

import * as MessageConsts from 'module/ui/message_list/message/const/message_consts'
import {Message} from "module/models/messages/message";

export const CommentServerRequests = {
	postCommentByMessageId(
		userType: MessageConsts.USER_TYPE.PARENT | MessageConsts.USER_TYPE.STUDENT,
		messageId: string,
		commentData: any
	): BPromise<any> {
		switch (userType) {
			case MessageConsts.USER_TYPE.PARENT: {
				return (window.Server as ServiceList).childrenEventMessageComments.post(
					{ messageId: messageId },
					commentData
				);
			}
		}
	},
	getCommentsCountByMessageId(
		userType: MessageConsts.USER_TYPE.PARENT | MessageConsts.USER_TYPE.STUDENT,
		messageId: string
	): BPromise<any> {
		switch (userType) {
			case MessageConsts.USER_TYPE.PARENT: {
				return (window.Server as ServiceList).childrenEventMessageCommentsCount.get( { messageId: messageId } );
			}
		}
	},
	getCommentsByMessageId(
		userType: MessageConsts.USER_TYPE.PARENT | MessageConsts.USER_TYPE.STUDENT,
		messageId: string
	): BPromise<any[]> {
		switch (userType) {
			case MessageConsts.USER_TYPE.PARENT: {
				return (window.Server as ServiceList).childrenEventMessageComments.get(
					{messageId: messageId},
					{filter: {limit: 100}}
				);
			}
		}
	}
};