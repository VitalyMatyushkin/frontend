import * as  React from 'react'
import * as  Morearty from 'morearty'
import * as  Immutable from 'immutable'

import * as  MessageList from 'module/ui/message_list/message_list'
import * as MessageConsts from "module/ui/message_list/message/const/message_consts";

export const MessageListWrapper = (React as any).createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		messageType: (React as any).PropTypes.string.isRequired,
		actions: (React as any).PropTypes.object.isRequired,
		userType: (React as any).PropTypes.string.isRequired
	},
	componentWillMount() {
		//load user->load messages->load templates
		const binding = this.getDefaultBinding();

		this.props.actions.setSync(binding, false);
		this.props.actions.getLoggedUser()
			.then(user => {
				binding.set('loggedUser', Immutable.fromJS(user));

				return this.props.actions.setConsentRequestTemplates(
					binding,
					this.props.userType
				);
			})
			.then(() => this.props.actions.setSync(binding, true));
	},
	getTemplatesFromBinding(binding) {
		return binding.toJS('template');
	},
	triggerMsgCountUpdater() {
		this.getMoreartyContext().getBinding().set('isMessagesCountNeedUpdate', true);
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
		),
		templateData: any
	) {
		this.props.actions.onAction(
			this.getDefaultBinding(),
			this.props.userType,
			this.props.messageType,
			messageId,
			messageKind,
			actionType,
			templateData
		).then(() => this.triggerMsgCountUpdater());
	},
	onClickShowComments(messageId: string) {
		this.props.actions.onClickShowComments(
			this.getDefaultBinding(),
			this.props.userType,
			messageId
		);
	},
	onClickSubmitComment(newCommentText: string, replyComment: {id: string}, messageId: string){
		this.props.actions.onClickSubmitComment(
			this.getDefaultBinding(),
			this.props.userType,
			newCommentText,
			replyComment,
			messageId
		);
	},
	checkComments(messageId: string) {
		this.props.actions.checkComments(
			this.getDefaultBinding(),
			this.props.userType,
			messageId
		);
	},
	render() {
		let content = null;

		const binding = this.getDefaultBinding();

		if( Boolean(binding.toJS('isSync')) ) {
			const templates = this.getTemplatesFromBinding(binding);

			content = (
				<MessageList
					key						= { binding.toJS('messagesListKey') }
					loadMessages			= { page =>
						this.props.actions.loadMessagesByPage(page, this.props.userType, this.props.messageType)
					}
					messageType				= { this.props.messageType }
					onAction				= { this.onAction }
					user					= { binding.toJS('loggedUser') }
					onClickShowComments		= { this.onClickShowComments }
					onClickSubmitComment	= { this.onClickSubmitComment }
					checkComments			= { this.checkComments }
					templates				= { templates }
				/>
			);
		}

		return content;
	}
});