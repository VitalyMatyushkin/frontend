const	React			= require('react'),

		Task			= require('./task'),
		EditTaskView	= require('./edit_task_view');

const Tasks = React.createClass({
	propTypes: {
		viewMode				: React.PropTypes.string.isRequired,
		tasks					: React.PropTypes.array.isRequired,
		editingTask				: React.PropTypes.object.isRequired,
		players					: React.PropTypes.array.isRequired,
		handleClickSave			: React.PropTypes.func.isRequired,
		handleClickChangeTask	: React.PropTypes.func.isRequired,
		handleClickDeleteTask	: React.PropTypes.func.isRequired
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
					handleClickChangeTask	= {this.props.handleClickChangeTask}
					handleClickDeleteTask	= {this.props.handleClickDeleteTask}
			/>
		);
	},
	renderAddTaskView: function() {
		return (
			<div className="bTasks">
				<EditTaskView	viewMode		= {this.props.viewMode}
								handleClickSave	= {this.props.handleClickSave}
								task			= {{}}
								players			= {this.props.players}/>
			</div>
		);
	},
	renderEditTaskView: function() {
		return (
			<div className="bTasks">
				<EditTaskView	viewMode		= {this.props.viewMode}
								handleClickSave	= {this.props.handleClickSave}
								task			= {this.props.editingTask}
								players			= {this.props.players}
				/>
			</div>
		);
	},
	render: function() {
		switch (this.props.viewMode) {
			case "ADD":
				return this.renderAddTaskView();
			case "EDIT":
				return this.renderEditTaskView();
			case "VIEW":
				return this.renderTasks();
		}
	}
});

module.exports = Tasks;