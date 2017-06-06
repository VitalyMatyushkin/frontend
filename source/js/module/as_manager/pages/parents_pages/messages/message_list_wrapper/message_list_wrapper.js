const	React				= require('react'),
		Morearty			= require('morearty'),
		Immutable			= require('immutable'),
		MessageListActions	= require('module/as_manager/pages/parents_pages/messages/message_list_wrapper/message_list_actions/message_list_actions'),
		MessageList			= require('module/ui/message_list/message_list'),
		MessageConsts		= require('module/ui/message_list/message/const/message_consts');

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
		this.onActionByMessageKindAndActionType(messageId, messageKind, actionType);
	},
	onActionByMessageKindAndActionType: function(messageId, messageKind, actionType) {
		switch (messageKind) {
			case MessageConsts.MESSAGE_KIND.REFUSAL:
				this.onActionForRefusalMessageByActionType(messageId, actionType);
				break;
		}
	},
	onActionForRefusalMessageByActionType: function(messageId, actionType) {
		switch (actionType) {
			case MessageConsts.MESSAGE_INVITATION_ACTION_TYPE.GOT_IT:
				MessageListActions.gotItRefusalMessage(messageId);
				break;
		}
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