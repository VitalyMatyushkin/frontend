const	React			= require('react'),
		Task			= require('./task'),
		EditTaskView	= require('./edit_task_view');

const Tasks = React.createClass({
	propTypes: {
		isShowEditButtons		: React.PropTypes.bool.isRequired,
		viewMode				: React.PropTypes.string.isRequired,
		tasks					: React.PropTypes.array.isRequired,
		editingTask				: React.PropTypes.object,
		players					: React.PropTypes.array.isRequired,
		handleClickSave			: React.PropTypes.func.isRequired,
		handleClickCancelChange	: React.PropTypes.func.isRequired,
		handleClickChangeTask	: React.PropTypes.func.isRequired,
		handleClickDeleteTask	: React.PropTypes.func.isRequired
	},
	getTasksCount: function() {
		return this.props.tasks.length;
	},
	renderTask: function(task) {
		return (
			<Task	key						= {task.id}
					task					= {task}
					isShowEditButtons		= {this.props.isShowEditButtons}
					handleClickChangeTask	= {this.props.handleClickChangeTask}
					handleClickDeleteTask	= {this.props.handleClickDeleteTask}
			/>
		);
	},
	renderAddTaskView: function() {
		return (
			<EditTaskView	viewMode			= {this.props.viewMode}
							handleClickSave		= {this.props.handleClickSave}
							handleClickCancel	= {this.props.handleClickCancelChange}
							task				= {{}}
							players				= {this.props.players}
							tasksCount			= {this.getTasksCount()}
			/>
		);
	},
	renderEditTaskView: function() {
		return (
			<EditTaskView	key					= {this.props.editingTask.id}
							viewMode			= {this.props.viewMode}
							handleClickSave		= {this.props.handleClickSave}
							handleClickCancel	= {this.props.handleClickCancelChange}
							task				= {this.props.editingTask}
							players				= {this.props.players}
							tasksCount			= {this.getTasksCount()}
			/>
		);
	},
	render: function() {
		// if there no jobs and it's parent view
		if(this.props.viewMode === "VIEW" && this.props.tasks.length === 0) {
			return (
				<div className="bTasks mEmpty">
					{"There are no jobs."}
				</div>
			);
		} else {
			let addTaskForm = null;
			if(this.props.viewMode === "ADD") {
				addTaskForm = this.renderAddTaskView();
			}

			const tasks = this.props.tasks.map(task => {
				// if there is editing, then we will show this task in "edit mode"
				if(typeof this.props.editingTask !== 'undefined' && this.props.editingTask.id === task.id) {
					return this.renderEditTaskView();
				} else {
					return this.renderTask(task);
				}
			});

			return (
				<div className="bTasks">
					{addTaskForm}
					{tasks}
				</div>
			);
		}
	}
});

module.exports = Tasks;