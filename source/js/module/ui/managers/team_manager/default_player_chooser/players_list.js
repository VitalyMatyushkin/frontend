const	React	= require('react'),
		Player	= require('module/ui/managers/team_manager/default_player_chooser/player');

const { PlayerListHeader } =  require("module/ui/managers/team_manager/default_player_chooser/player_list_header");

const PlayersList = React.createClass({
	propTypes: {
		players:			React.PropTypes.array.isRequired,
		handleClickStudent:	React.PropTypes.func.isRequired
	},
	render: function() {
		return (
			<div className="ePlayerChooser_playerList">
				<table className="table table-hover">
					<PlayerListHeader/>
					<tbody>
						{
						this.props.players.map(player =>
							<Player
								key					= { player.id }
								player				= { player }
								handleClickStudent	= { this.props.handleClickStudent }
							/>
						)
					}
					</tbody>
				</table>
			</div>
		);
	}
});

module.exports = PlayersList;