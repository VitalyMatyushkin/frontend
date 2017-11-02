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
				return `Do you give your consent for ${playerName} to take part in this fixture?`;
			case MessageConsts.MESSAGE_KIND.REFUSAL:
				return `${playerName} is not available to take part.`;
			case MessageConsts.MESSAGE_KIND.AVAILABILITY:
				const isTakePart = message.isTakePart ? 'yes' : 'no';
				return `${playerName} is take part: ${isTakePart}`;
		}
	},
	getDetails: function(){
		if (this.props.message.kind === MessageConsts.MESSAGE_KIND.AVAILABILITY) {
			return <p>{this.props.message.details}</p>
		} else {
			return null;
		}
	},
	render: function() {
		const 	text 		= this.getText(),
				details 	= this.getDetails();

		return (
			<div className="eInvite_text">
				<h4>{text}</h4>
				{details}
			</div>
		);
	}
});

module.exports = MessageText;