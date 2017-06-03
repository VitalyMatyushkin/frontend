const	React		= require('react'),
		Bootstrap  	= require('../../../../styles/bootstrap-custom.scss');

const PlayerStatusTableBody = React.createClass({
	propTypes: {
		players: React.PropTypes.object.isRequired
	},
	renderRows: function() {
		const players = this.props.players;

		if(typeof players !== 'undefined') {
			return players.map(player => {
				return (
					<tr key={player.id}>
						<td>{player.name}</td>
						<td>{player.status}</td>
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