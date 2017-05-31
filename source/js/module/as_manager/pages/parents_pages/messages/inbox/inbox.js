const	React				= require('react'),
		Morearty			= require('morearty'),
		Immutable			= require('immutable'),
		MessageListWrapper	= require('module/as_manager/pages/parents_pages/messages/inbox/message_list/message_list_wrapper');

const Inbox = React.createClass({
	mixins: [Morearty.Mixin],
	render: function() {
		return (
			<MessageListWrapper
				binding	={ this.getDefaultBinding() }
			/>
		);
	}
});

module.exports = Inbox;