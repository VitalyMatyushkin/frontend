import * as React from 'react'
import * as Morearty  from 'morearty'

import {MessageListWrapper} from 'module/as_manager/pages/messages/message_list_wrapper/message_list_wrapper'
import * as MessageConsts  from 'module/ui/message_list/message/const/message_consts'

export const Inbox = (React as any).createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		activeSchoolId: (React as any).PropTypes.string.isRequired
	},
	render() {
		return (
			<MessageListWrapper
				binding={this.getDefaultBinding()}
				activeSchoolId={this.props.activeSchoolId}
				messageType={MessageConsts.MESSAGE_TYPE.INBOX}
			/>
		);
	}
});