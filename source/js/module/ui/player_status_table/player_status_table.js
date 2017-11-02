const	React					= require('react'),
		PlayerStatusTableHead	= require('module/ui/player_status_table/player_status_table_head.js'),
		PlayerStatusTableBody	= require('module/ui/player_status_table/player_status_table_body.js'),
		PlayerStatusTableStyle	= require('../../../../styles/ui/b_player_status_table/b_player_status_table.scss'),
		Bootstrap				= require('../../../../styles/bootstrap-custom.scss');

const PlayerStatusTable = React.createClass({
	propTypes: {
		players: React.PropTypes.array.isRequired
	},
	render: function(){
		return (
			<div className="bPlayerStatusTable">
				<table className="table table-striped">
					<PlayerStatusTableHead />
					<PlayerStatusTableBody
						players = { this.props.players }
					/>
				</table>
			</div>
		);
	}
});

module.exports = PlayerStatusTable;