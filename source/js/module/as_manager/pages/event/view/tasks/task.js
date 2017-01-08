const	React			= require('react'),

		PencilButton	= require('../../../../../ui/pencil_button'),
		CrossButton		= require('../../../../../ui/cross_button'),
		TaskCssStyle	= require('../../../../../../../styles/ui/task.scss');

const Task = React.createClass({
	propTypes: {
		task					: React.PropTypes.object.isRequired,
		handleClickChangeTask	: React.PropTypes.func.isRequired,
		handleClickDeleteTask	: React.PropTypes.func.isRequired
	},
	/**
	 * Function returns all player names from task as string.
	 * @returns {*|string}
	 */
	getPlayerNames: function() {
		if(this.props.task.assignees.length > 0) {
			return this.props.task.assignees.map(player => `${player.firstName} ${player.lastName}`).join(', ');
		} else {
			return "No assignee";
		}
	},
	render: function() {
		return (
			<div className="bTask">
				<div className="eTask_column">
					<div className="eTask_playerNames">
						<b>{this.getPlayerNames()}</b>
					</div>
					<div className="eTask_text">
						{this.props.task.text}
					</div>
				</div>
				<div className="eTask_column mButtons">
					<div className="eTask_buttonsWrapper">
						<PencilButton	handleClick	= {this.props.handleClickChangeTask.bind(null, this.props.task)}/>
						<CrossButton	handleClick	= {this.props.handleClickDeleteTask.bind(null, this.props.task.id)}/>
					</div>
				</div>
			</div>
		);
	}
});

module.exports = Task;