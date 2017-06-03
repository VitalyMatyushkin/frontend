const	React					= require('react'),
		PlayerStatusTableHead	= require('module/ui/player_status_table/player_status_table_head.js'),
		PlayerStatusTableBody	= require('module/ui/player_status_table/player_status_table_body.js'),
		ScoreTableStyle			= require('../../../../styles/ui/b_score_table/b_score_table.scss'),
		Bootstrap				= require('../../../../styles/bootstrap-custom.scss');

const ScoreTable = React.createClass({
	propTypes: {
		players: React.PropTypes.object.isRequired
	},
	render: function(){
		return (
			<div className="bScoreTable">
				<table className="table table-striped">
					<PlayerStatusTableHead/>
					<PlayerStatusTableBody players={this.props.players}/>
				</table>
			</div>
		);
	}
});

module.exports = ScoreTable;