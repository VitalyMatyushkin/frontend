const	React			= require('react'),
		MessageConsts	= require('module/ui/message_list/message/const/message_consts'),
		Bootstrap  		= require('../../../../styles/bootstrap-custom.scss');

const PlayerStatusTableBody = React.createClass({
	propTypes: {
		players: React.PropTypes.array.isRequired
	},
	renderFields: function(player){
		const fields = player.fields;
		
		if (Array.isArray(fields) && fields.length > 0) {
			return (
				fields.map((field, index) => {
					return (
						<p><span className="mBold">{field.heading}</span>{` ${field.value}`}</p>
					)
				})
			);
		} else {
			return null;
		}
	},
	renderRows: function() {
		const players = this.props.players;

		if(typeof players !== 'undefined') {
			return players.map(player => {
				return (
					<tr key={player.id}>
						<td>{player.name}</td>
						<td>{MessageConsts.MESSAGE_INVITATION_STATUS_MAP[player.status]}</td>
						<td>{this.renderFields(player)}</td>
					</tr>
				);
			});
		} else {
			return null;
		}
	},
	render: function(){
		return (
			<tbody>
				{this.renderRows()}
			</tbody>
		);
	}
});

module.exports = PlayerStatusTableBody;