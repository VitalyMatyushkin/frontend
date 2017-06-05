const	React				= require('react'),
		Morearty			= require('morearty'),
		Immutable			= require('immutable'),
		MessageListActions	= require('module/as_manager/pages/parents_pages/messages/message_list_wrapper/message_list_actions/message_list_actions'),
		MessageList			= require('module/ui/message_list/message_list');

const MessageListWrapper = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		messageType: React.PropTypes.string.isRequired
	},
	componentWillMount: function() {
		MessageListActions.loadMessages(this.props.messageType).then(messages => {
			this.getDefaultBinding().set('messages', Immutable.fromJS(messages));
		});
	},
	onAction: function(messageId, messageKind, actionType) {
		console.log({messageId: messageId, messageKind: messageKind, actionType: actionType});
	},
	render: function() {
		const binding = this.getDefaultBinding();

		const messages = binding.toJS('messages');

		if(typeof messages !== 'undefined' && messages.length > 0) {
			return (
				<MessageList
					messages	= {messages}
					messageType	= {this.props.messageType}
					onAction	= {this.onAction}
				/>
			);
		} else {
			return null;
		}
	}
});

module.exports = MessageListWrapper;