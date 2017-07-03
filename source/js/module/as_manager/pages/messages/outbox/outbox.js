const	React				= require('react'),
		Morearty			= require('morearty'),
		MessageListWrapper	= require('module/as_manager/pages/messages/message_list_wrapper/message_list_wrapper'),
		MessageConsts		= require('module/ui/message_list/message/const/message_consts');

const Outbox = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		activeSchoolId: React.PropTypes.string.isRequired
	},
	render: function() {
		return (
			<MessageListWrapper
				binding			= {this.getDefaultBinding()}
				activeSchoolId	= {this.props.activeSchoolId}
				messageType		= {MessageConsts.MESSAGE_TYPE.OUTBOX}
			/>
		);
	}
});

module.exports = Outbox;