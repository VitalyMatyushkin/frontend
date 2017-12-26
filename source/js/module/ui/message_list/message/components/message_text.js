const	React			= require('react'),
		propz 			= require('propz'),
		MessageConsts	= require('module/ui/message_list/message/const/message_consts');

const MessageText = React.createClass({
	propTypes: {
		message: React.PropTypes.object.isRequired
	},
	getText: function() {
		const	message		= this.props.message,
				player		= message.playerDetailsData,
				playerName	= `${propz.get(player, ['firstName'])} ${propz.get(player, ['lastName'])}`;

		switch (message.kind) {
			case MessageConsts.MESSAGE_KIND.INVITATION:
				return `Do you give your consent for ${playerName} to take part in this fixture?`;
			case MessageConsts.MESSAGE_KIND.REFUSAL:
				return `${playerName} is not available to take part.`;
			case MessageConsts.MESSAGE_KIND.AVAILABILITY:
				const isTakePart = message.isTakePart ? 'yes' : 'no';
				return `${playerName} can take part: ${isTakePart}`;
			case MessageConsts.MESSAGE_KIND.CLUB_PARTICIPANT_INVITE:
				return `You can book a place for your child now. To send a request for a place click the “Book” button.`;
		}
	},
	getDetails: function(){
		switch (this.props.message.kind) {
			case MessageConsts.MESSAGE_KIND.AVAILABILITY:
				return <p> { this.props.message.details } </p>;
			default:
				return null;
		}
	},
	render: function() {
		return (
			<div className="eInvite_text">
				<h4> { this.getText() } </h4>
				{ this.getDetails() }
			</div>
		);
	}
});

module.exports = MessageText;