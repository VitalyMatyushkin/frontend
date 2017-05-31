const	React		= require('react'),
		Morearty	= require('morearty'),
		Immutable	= require('immutable'),
		MessageList	= require('module/as_manager/pages/parents_pages/messages/inbox/message_list/message_list');

const MessageListWrapper = React.createClass({
	mixins: [Morearty.Mixin],
	render: function() {
		return (
			<MessageList
				messages	={[]}
			/>
		);
	}
});

module.exports = MessageListWrapper;