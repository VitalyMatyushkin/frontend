import * as React from 'react'
import * as Morearty from 'morearty'

import {MessageListWrapper} from 'module/as_manager/pages/parents_pages/messages/message_list_wrapper/message_list_wrapper'
import {MessageListActions} from 'module/as_manager/pages/parents_pages/messages/message_list_wrapper/message_list_actions/message_list_actions'
import * as MessageConsts from 'module/ui/message_list/message/const/message_consts'

export const Inbox = (React as any).createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		userType: (React as any).PropTypes.string.isRequired
	},
	render() {
		return (
			<MessageListWrapper
				binding		= { this.getDefaultBinding() }
				actions		= { MessageListActions }
				userType	= { this.props.userType }
				messageType	= { MessageConsts.MESSAGE_TYPE.INBOX }
			/>
		);
	}
});