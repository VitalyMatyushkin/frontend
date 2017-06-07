const	React				= require('react'),
		Morearty			= require('morearty'),
		Immutable			= require('immutable'),
		MoreartyHelper		= require('module/helpers/morearty_helper'),
		MessageListActions	= require('module/as_manager/pages/messages/message_list_wrapper/message_list_actions/message_list_actions'),
		MessageList			= require('module/ui/message_list/message_list'),
		MessageConsts		= require('module/ui/message_list/message/const/message_consts'),
		Loader				= require('module/ui/loader');

const MessageListWrapper = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		messageType: React.PropTypes.string.isRequired
	},
	componentWillMount: function() {
		this.activeSchoolId = MoreartyHelper.getActiveSchoolId(this);

		this.loadAndSetMessages();
	},
	loadAndSetMessages: function() {
		MessageListActions.loadMessages(this.props.messageType, this.activeSchoolId).then(messages => {
			this.getDefaultBinding().atomically()
				.set('isSync',		true)
				.set('messages',	Immutable.fromJS(messages))
				.commit();
		});
	},
	setSync: function(value) {
		this.getDefaultBinding().set('isSync', value);
	},
	onAction: function(messageId, messageKind, actionType) {
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
				MessageListActions.gotItRefusalMessage(this.activeSchoolId, messageId).then(() => {
					this.setSync(false);

					this.loadAndSetMessages();
				});
				break;
		}
	},
	render: function() {
		const	binding		= this.getDefaultBinding();

		const	messages	= binding.toJS('messages'),
				isSync		= binding.toJS('isSync');

		if(isSync) {
			return (
				<MessageList
					messages	= {messages}
					messageType	= {this.props.messageType}
					onAction	= {this.onAction}
				/>
			);
		} else {
			return (
				<div>
					<br/>
					<br/>
					<Loader/>
				</div>
			);
		}
	}
});

module.exports = MessageListWrapper;