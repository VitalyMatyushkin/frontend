const	React				= require('react'),
		Morearty			= require('morearty'),
		Immutable			= require('immutable'),
		MessageListActions	= require('module/as_manager/pages/parents_pages/messages/inbox/message_list/message_list_actions/message_list_actions'),
		MessageList			= require('module/as_manager/pages/parents_pages/messages/inbox/message_list/message_list');

const MessageListWrapper = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function() {
		MessageListActions.loadMessages().then(messages => {
			this.getDefaultBinding().set('messages', Immutable.fromJS(messages));
		});
	},
	render: function() {
		const binding = this.getDefaultBinding();

		const messages = binding.toJS('messages');

		if(typeof messages !== 'undefined' && messages.length > 0) {
			return (
				<MessageList
					messages={messages}
				/>
			);
		} else {
			return null;
		}
	}
});

module.exports = MessageListWrapper;