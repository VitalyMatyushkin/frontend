const	React					= require('react'),
		PlayerStatusTableHead	= require('module/ui/player_status_table/player_status_table_head.js'),
		PlayerStatusTableBody	= require('module/ui/player_status_table/player_status_table_body.js'),
		PlayerStatusTableStyle	= require('../../../../styles/ui/b_player_status_table/b_player_status_table.scss'),
		Bootstrap				= require('../../../../styles/bootstrap-custom.scss');

const PlayerStatusTable = React.createClass({
	propTypes: {
		players: 				React.PropTypes.array.isRequired,
		messages: 				React.PropTypes.array.isRequired,
		role: 					React.PropTypes.string.isRequired,
		user: 					React.PropTypes.object.isRequired,
		template: 				React.PropTypes.object.isRequired,
		onClickShowComments: 	React.PropTypes.func.isRequired,
		onClickSubmitComment: 	React.PropTypes.func.isRequired,
		checkComments: 			React.PropTypes.func.isRequired,
		onAction: 				React.PropTypes.func.isRequired
	},
	render: function(){
		return (
			<div className="bPlayerStatusTable">
				<table className="table">
					<PlayerStatusTableHead />
					<PlayerStatusTableBody
						players 				= { this.props.players }
						messages 				= { this.props.messages }
						role 					= { this.props.role }
						user 					= { this.props.user }
						template 				= { this.props.template }
						onClickShowComments 	= { this.props.onClickShowComments }
						onClickSubmitComment 	= { this.props.onClickSubmitComment }
						checkComments 			= { this.props.checkComments }
						onAction 				= { this.props.onAction }
					/>
				</table>
			</div>
		);
	}
});

module.exports = PlayerStatusTable;