const	React						= require('react'),
	
		MessageConsts				= require('module/ui/message_list/message/const/message_consts'),
	
		ParentalReportsTableHead 	= require('./parental_reports_table_head'),
		ParentalReportsTableBody 	= require('./parental_reports_table_body'),
	
		ScoreTableStyle				= require('../../../../../../../styles/ui/b_score_table/b_score_table.scss'),
		Bootstrap					= require('../../../../../../../styles/bootstrap-custom.scss');

const ParentalReportsTable = React.createClass({
	propTypes: {
		messages:				React.PropTypes.array.isRequired,
		onGotIt:				React.PropTypes.func.isRequired,
		onClickShowComments:	React.PropTypes.func.isRequired,
		onClickSubmitComment:	React.PropTypes.func.isRequired,
		checkComments:			React.PropTypes.func.isRequired,
		setComments:			React.PropTypes.func.isRequired,
		role: 					React.PropTypes.string.isRequired,
		user: 					React.PropTypes.object.isRequired
	},
	
	render: function(){
		return (
			<div className="bScoreTable">
				<table className="table table-striped">
					<ParentalReportsTableHead />
					<ParentalReportsTableBody
						messages 				= { this.props.messages }
						onGotIt 				= { this.props.onGotIt }
						onClickShowComments 	= { this.props.onClickShowComments }
						onClickSubmitComment 	= { this.props.onClickSubmitComment }
						checkComments 			= { this.props.checkComments }
						setComments 			= { this.props.setComments }
						role 					= { this.props.role }
						user 					= { this.props.user }
					/>
				</table>
			</div>
		);
	}
});

module.exports = ParentalReportsTable;