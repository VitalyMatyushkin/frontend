const	React			= require('react'),
		MessageConsts	= require('module/ui/message_list/message/const/message_consts');

const MessageText = React.createClass({
	propTypes: {
		message: React.PropTypes.object.isRequired
	},
	getText: function() {
		const	message		= this.props.message,
				player		= message.playerDetailsData,
				playerName	= `${player.firstName} ${player.lastName}`;

		switch (message.kind) {
			case MessageConsts.MESSAGE_KIND.INVITATION:
				return `Do you give your consent ${playerName} to take part?`;
			case MessageConsts.MESSAGE_KIND.REFUSAL:
				return `${playerName} can't take part.`;
		}
	},
	render: function() {
		const text = this.getText();

		return (
			<div className="eInvite_text">
				<h4>{text}</h4>
			</div>
		);
	}
});

module.exports = MessageText;