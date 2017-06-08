const	React				= require('react'),
		Morearty			= require('morearty'),
		Immutable			= require('immutable'),
		MessageListWrapper	= require('module/as_manager/pages/parents_pages/messages/message_list_wrapper/message_list_wrapper'),
		MessageConsts		= require('module/ui/message_list/message/const/message_consts');

const Archive = React.createClass({
	mixins: [Morearty.Mixin],
	render: function() {
		return (
			<MessageListWrapper
				binding		= {this.getDefaultBinding()}
				messageType	= {MessageConsts.MESSAGE_TYPE.ARCHIVE}
			/>
		);
	}
});

module.exports = Archive;