const	React		= require('react'),
		Messsage	= require('module/as_manager/pages/parents_pages/messages/inbox/message_list/message/message');

const MessageList = React.createClass({
	propTypes: {
		messages: React.PropTypes.array.isRequired
	},
	renderMessages: function() {
		let messages = null;

		if(
			typeof this.props.messages !== 'undefined' &&
			this.props.messages.length > 0
		) {
			messages = this.props.messages.map(message => <Messsage key={message.id} message={message}/>);
		}

		return messages;
	},
	render: function() {
		return (
			<div>
				<div className="eInvites_list container" >
					{this.renderMessages()}
				</div>
			</div>
		);
	}
});

module.exports = MessageList;