const	React			= require('react'),

		Task			= require('./task'),
		EditTaskView	= require('./edit_task_view');

const Tasks = React.createClass({
	propTypes: {
		tasks					: React.PropTypes.array.isRequired,
		players					: React.PropTypes.array.isRequired,
		handleClickDeleteTask	: React.PropTypes.func.isRequired
	},
	getInitialState: function() {
		return {
			editingTask	: undefined
		};
	},
	isEditMode: function() {
		return typeof this.state.editingTask !== "undefined";
	},
	handleClickChangeTask: function(task) {
		this.setState({
			editingTask: task
		});
	},
	handleClickDeleteTask: function(taskId) {

	},
	renderTasks: function() {
		return (
			<div className="bTasks">
				{this.props.tasks.map(task => this.renderTask(task))}
			</div>
		);
	},
	renderTask: function(task) {
		return (
			<Task	task					= {task}
					handleClickChangeTask	= {this.handleClickChangeTask}
					handleClickDeleteTask	= {this.handleClickDeleteTask}
			/>
		);
	},
	renderEditTaskView: function() {
		return (
			<div className="bTasks">
				<EditTaskView task={this.state.editingTask} players={this.props.players}/>
			</div>
		);
	},
	render: function() {
		if(this.isEditMode()) {
			return this.renderEditTaskView();
		} else {
			return this.renderTasks();
		}
	}
});

module.exports = Tasks;