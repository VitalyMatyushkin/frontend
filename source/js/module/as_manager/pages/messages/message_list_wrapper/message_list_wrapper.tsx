import * as React from 'react'
import * as Morearty from 'morearty'
import * as Immutable from 'immutable'

import {MessageListActions} from 'module/as_manager/pages/messages/message_list_wrapper/message_list_actions/message_list_actions'
import * as MessageList from 'module/ui/message_list/message_list'

import * as RandomHelper from 'module/helpers/random_helper'
import {RegionHelper} from 'module/helpers/region_helper'
import * as MessageConsts from 'module/ui/message_list/message/const/message_consts'
import {ServiceList} from "module/core/service_list/service_list";

export const MessageListWrapper = (React as any).createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		activeSchoolId:	(React as any).PropTypes.string.isRequired,
		messageType: (React as any).PropTypes.string.isRequired
	},
	componentWillMount() {
		this.setSync(false);
		(window.Server as ServiceList).profile.get().then(user => {
			this.getDefaultBinding().set('messagesListKey',	RandomHelper.getRandomString());
			this.getDefaultBinding().set('loggedUser',		Immutable.fromJS(user));
			
			this.setSync(true);
		});
	},
	triggerMsgCountUpdater () {
		this.getMoreartyContext().getBinding().set('isMessagesCountNeedUpdate', true);
	},
	reloadMessageList() {
		this.getDefaultBinding().set('messagesListKey',	RandomHelper.getRandomString());
	},
	setSync(value: boolean) {
		this.getDefaultBinding().set('isSync', value);
	},
	onAction(
		messageId: string,
		messageKind: (
			MessageConsts.MESSAGE_KIND.REFUSAL |
			MessageConsts.MESSAGE_KIND.AVAILABILITY |
			MessageConsts.MESSAGE_KIND.INVITATION |
			MessageConsts.MESSAGE_KIND.CLUB_PARTICIPANT_INVITE
		),
		actionType: (
			MessageConsts.MESSAGE_INVITATION_ACTION_TYPE.GOT_IT |
			MessageConsts.MESSAGE_INVITATION_ACTION_TYPE.DECLINE |
			MessageConsts.MESSAGE_INVITATION_ACTION_TYPE.ACCEPT
		)
	) {
		this.onActionByMessageKindAndActionType(messageId, messageKind, actionType)
			.then(() => this.triggerMsgCountUpdater());
	},
	onActionByMessageKindAndActionType(
		messageId: string,
		messageKind: (
			MessageConsts.MESSAGE_KIND.REFUSAL |
			MessageConsts.MESSAGE_KIND.AVAILABILITY |
			MessageConsts.MESSAGE_KIND.INVITATION |
			MessageConsts.MESSAGE_KIND.CLUB_PARTICIPANT_INVITE
		),
		actionType: (
			MessageConsts.MESSAGE_INVITATION_ACTION_TYPE.GOT_IT |
			MessageConsts.MESSAGE_INVITATION_ACTION_TYPE.DECLINE |
			MessageConsts.MESSAGE_INVITATION_ACTION_TYPE.ACCEPT
		)
	) {
		switch (messageKind) {
			case MessageConsts.MESSAGE_KIND.REFUSAL:
				return this.onActionForRefusalMessageByActionType(messageId, actionType);
			case MessageConsts.MESSAGE_KIND.AVAILABILITY:
				return this.onActionForReportMessageByActionType(messageId, actionType);
		}
	},
	onActionForRefusalMessageByActionType(
		messageId: string,
		actionType: (
			MessageConsts.MESSAGE_INVITATION_ACTION_TYPE.GOT_IT |
			MessageConsts.MESSAGE_INVITATION_ACTION_TYPE.DECLINE |
			MessageConsts.MESSAGE_INVITATION_ACTION_TYPE.ACCEPT
		)
	) {
		switch (actionType) {
			case MessageConsts.MESSAGE_INVITATION_ACTION_TYPE.GOT_IT:
				return MessageListActions.gotItRefusalMessage(
					this.props.activeSchoolId,
					messageId
				).then(() => {
					this.reloadMessageList();

					return true;
				});
		}
	},
	onActionForReportMessageByActionType(messageId: string, actionType: string) {
		switch (actionType) {
			case MessageConsts.MESSAGE_INVITATION_ACTION_TYPE.GOT_IT:
				return MessageListActions.gotItReportMessage(
					this.props.activeSchoolId,
					messageId
				).then(() => {
					this.reloadMessageList();

					return true;
				});
		}
	},
	onClickShowComments(messageId: string) {
		const 	binding			= this.getDefaultBinding(),
				messageIndex 	= binding.toJS('messages').findIndex(message => message.id === messageId),
				isShowComments 	= Boolean(binding.toJS(`messages.${messageIndex}.isShowComments`));
		
		binding.atomically()
			.set(`messages.${messageIndex}.isShowComments`, !isShowComments)
			.set(`messages.${messageIndex}.isSyncComments`, false)
			.commit();
		
		if (!isShowComments) {
			(window.Server as ServiceList).schoolEventMessageComments.get({
				schoolId: this.props.activeSchoolId,
				messageId
			}).then(
				comments => {
					binding.atomically()
					.set(`messages.${messageIndex}.comments`, 		Immutable.fromJS(comments))
					.set(`messages.${messageIndex}.commentsCount`, 	comments.length)
					.set(`messages.${messageIndex}.isSyncComments`, true)
					.commit();
				}
			);
		}
	},
	onClickSubmitComment(newCommentText: string, replyComment: any, messageId: string) {
		const 	binding 		= this.getDefaultBinding(),
				messageIndex 	= binding.toJS('messages').findIndex(message => message.id === messageId);
		
		const postData:{text: string, replyToCommentId?: string} = {
			text: newCommentText
		};
		if(typeof replyComment !== 'undefined') {
			postData.replyToCommentId = replyComment.id;
		}
		
		return (window.Server as ServiceList).schoolEventMessageComments.post(
			{
				schoolId: this.props.activeSchoolId,
				messageId: messageId
			},
			postData
		)
		.then(comment => {
			const	comments		= binding.toJS(`messages.${messageIndex}.comments`),
					commentsCount	= binding.toJS(`messages.${messageIndex}.commentsCount`);
			
			comments.push(comment);
			
			binding.atomically()
				.set(`messages.${messageIndex}.commentsCount`,	Immutable.fromJS(commentsCount + 1))
				.set(`messages.${messageIndex}.comments`,		Immutable.fromJS(comments))
				.commit();
		});
	},
	checkComments(messageId: string) {
		const 	binding 		= this.getDefaultBinding(),
				messageIndex 	= binding.toJS('messages').findIndex(message => message.id === messageId);
		
		return (window.Server as ServiceList).schoolEventMessageCommentsCount.get({
			schoolId:	this.props.activeSchoolId,
			messageId: messageId
		})
		.then(res => {
			const oldCount = binding.get(`messages.${messageIndex}.commentsCount`);
			if(oldCount && oldCount !== res.count) {
				this.setComments(messageId);
			}
			return true;
		})
	},
	setComments(messageId: string) {
		const 	binding 		= this.getDefaultBinding(),
				messageIndex 	= binding.toJS('messages').findIndex(message => message.id === messageId);
		
		return (window.Server as ServiceList).schoolEventMessageComments.get(
			{
				schoolId: this.props.activeSchoolId,
				messageId: messageId
			}, {
				filter: {
					limit: 100
				}
			})
		.then(comments => {
			binding
				.atomically()
				.set(`messages.${messageIndex}.commentsCount`,	comments.length)
				.set(`messages.${messageIndex}.comments`, 		Immutable.fromJS(comments))
				.commit();
			
			return true;
		});
	},
	render() {
		let content = null;

		const binding = this.getDefaultBinding();

		if(Boolean(binding.toJS('isSync'))) {
			content = (
				<MessageList
					key						= { binding.toJS('messagesListKey') }
					loadMessages			= { page =>
						MessageListActions.loadMessagesByPage(page, this.props.messageType, this.props.activeSchoolId)
					}
					messageType				= { this.props.messageType }
					onAction				= { this.onAction }
					user					= { binding.toJS('loggedUser') }
					onClickShowComments		= { this.onClickShowComments }
					onClickSubmitComment	= { this.onClickSubmitComment }
					checkComments			= { this.checkComments }
					region                  = { RegionHelper.getRegion(this.getMoreartyContext().getBinding()) }
				/>
			);
		}

		return content;
	}
});