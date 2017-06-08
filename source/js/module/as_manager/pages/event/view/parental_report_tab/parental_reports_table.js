const	React			= require('react'),
		MessageConsts	= require('module/ui/message_list/message/const/message_consts'),
		ScoreTableStyle	= require('../../../../../../../styles/ui/b_score_table/b_score_table.scss'),
		Bootstrap		= require('../../../../../../../styles/bootstrap-custom.scss');

const ParentalReportsTable = React.createClass({
	propTypes: {
		messages:	React.PropTypes.object.isRequired,
		onGotIt:	React.PropTypes.func.isRequired
	},
	onGotIt: function(message) {
		this.props.onGotIt(message.id);
	},
	getStatus: function(message) {
		if(message.readStatus === MessageConsts.MESSAGE_READ_STATUS.READ) {
			return 'Accepted';
		} else {
			return (
				<a onClick={this.onGotIt.bind(this, message)}>
					Got It
				</a>
			);
		}
	},
	renderRows: function() {
		const messages = this.props.messages;

		if(typeof messages !== 'undefined') {
			return messages.map(message => {
				const name = `${message.playerDetailsData.firstName} ${message.playerDetailsData.lastName}`;

				return (
					<tr
						key={message.id}
					>
						<td>{name}</td>
						<td>
							{this.getStatus(message)}
						</td>
					</tr>
				);
			});
		} else {
			return null;
		}
	},
	render: function(){
		return (
			<div className="bScoreTable">
				<table className="table table-striped">
					<thead>
					<tr>
						<th>Name</th>
						<th>Status</th>
					</tr>
					</thead>
					<tbody>
						{this.renderRows()}
					</tbody>
				</table>
			</div>
		);
	}
});

module.exports = ParentalReportsTable;