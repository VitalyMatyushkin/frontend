const	React				= require('react'),
		Morearty			= require('morearty'),
		MessageListWrapper	= require('module/as_manager/pages/parents_pages/messages/message_list/message_list_wrapper'),
		MessageConsts		= require('module/as_manager/pages/parents_pages/messages/message_list/message/const/message_consts');

const Outbox = React.createClass({
	mixins: [Morearty.Mixin],
	render: function() {
		return (
			<MessageListWrapper
				binding		= {this.getDefaultBinding()}
				messageType	= {MessageConsts.MESSAGE_TYPE.OUTBOX}
			/>
		);
	}
});

module.exports = Outbox;