const	React				= require('react'),
		Morearty			= require('morearty'),
		Immutable			= require('immutable'),
		MessageListWrapper	= require('module/as_manager/pages/parents_pages/messages/inbox/message_list/message_list_wrapper'),
		MessageConsts		= require('module/as_manager/pages/parents_pages/messages/inbox/message_list/message/const/message_consts');

const Inbox = React.createClass({
	mixins: [Morearty.Mixin],
	render: function() {
		return (
			<MessageListWrapper
				binding		= {this.getDefaultBinding()}
				messageType	= {MessageConsts.MESSAGE_TYPE.INBOX}
			/>
		);
	}
});

module.exports = Inbox;