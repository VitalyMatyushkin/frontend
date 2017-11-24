const	React				= require('react'),
		Morearty			= require('morearty'),
		Immutable			= require('immutable'),
		MessageListWrapper	= require('module/as_manager/pages/parents_pages/messages/message_list_wrapper/message_list_wrapper'),
		MessageConsts		= require('module/ui/message_list/message/const/message_consts'),
		MessageListActions	= require('module/as_manager/pages/parents_pages/messages/message_list_wrapper/message_list_actions/message_list_actions');

const Archive = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		userType: React.PropTypes.string.isRequired
	},
	render: function() {
		return (
			<MessageListWrapper
				binding		= { this.getDefaultBinding() }
				actions		= { MessageListActions }
				userType	= { this.props.userType }
				messageType	= { MessageConsts.MESSAGE_TYPE.ARCHIVE }
			/>
		);
	}
});

module.exports = Archive;