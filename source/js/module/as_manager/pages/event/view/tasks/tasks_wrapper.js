const	React		= require('react'),
		Immutable	= require('immutable'),
		Morearty	= require('morearty'),

		Tasks		= require('./tasks');

const TasksWrapper = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		activeSchoolId	: React.PropTypes.string.isRequired
	},
	getViewMode: function() {
		return this.getDefaultBinding().toJS('viewMode');
	},
	setViewMode: function(viewMode) {
		this.getDefaultBinding().set('viewMode', viewMode);
	},
	getEvent: function() {
		return this.getBinding('event').toJS();
	},
	getTasks: function() {
		const tasks = this.getDefaultBinding().toJS('tasks');

		return typeof tasks !== "undefined" ? tasks : [];
	},
	setTasks: function(tasks) {
		this.getDefaultBinding().set('tasks', Immutable.fromJS(tasks))
	},
	getEditingTask: function() {
		return this.getDefaultBinding().toJS('editingTask');
	},
	setEditingTask: function(task) {
		return this.getDefaultBinding().set('editingTask', Immutable.fromJS(task));
	},
	getPlayers: function() {
		return this.getDefaultBinding().toJS('players');
	},
	handleClickSave: function(task) {
		const editingTask = this.getEditingTask();

		if(typeof editingTask !== "undefined") {
			window.Server.schoolEventTask
				.put({
					schoolId	: this.props.activeSchoolId,
					eventId		: this.getEvent().id,
					taskId		: editingTask.id
				}, {
					text		: task.text,
					assignees	: task.selectedPlayers.map(p => {
						return {
							userId			: p.userId,
							permissionId	: p.permissionId
						};
					})
				})
				.then(() => window.Server.schoolEventTasks.get({schoolId: this.props.activeSchoolId, eventId: this.getEvent().id}))
				.then(tasks => this.setTasks(tasks));
		} else {
			window.Server.schoolEventTasks
				.post({
					schoolId	: this.props.activeSchoolId,
					eventId		: this.getEvent().id
				}, {
					text		: task.text,
					assignees	: task.selectedPlayers.map(p => {
						return {
							userId			: p.userId,
							permissionId	: p.permissionId
						};
					})
				})
				.then(() => window.Server.schoolEventTasks.get({schoolId: this.props.activeSchoolId, eventId: this.getEvent().id}))
				.then(tasks => this.setTasks(tasks));
		}
		this.setViewMode('VIEW');
	},
	handleClickChangeTask: function(task) {
		this.setEditingTask(task);
		this.setViewMode('EDIT');
	},
	handleClickDeleteTask: function(taskId) {
		window.Server.schoolEventTask
		.delete(
			{
				schoolId	: this.props.activeSchoolId,
				eventId		: this.getEvent().id,
				taskId		: taskId
			}
		)
		.then(() => window.Server.schoolEventTasks.get({schoolId: this.props.activeSchoolId, eventId: this.getEvent().id}))
		.then(tasks => this.setTasks(tasks));
	},
	render: function() {
		return (
			<Tasks	viewMode				= {this.getViewMode()}
					tasks					= {this.getTasks()}
					editingTask				= {this.getEditingTask()}
					players					= {this.getPlayers()}
					handleClickSave			= {this.handleClickSave}
					handleClickChangeTask	= {this.handleClickChangeTask}
					handleClickDeleteTask	= {this.handleClickDeleteTask}
			/>
		);
	}
});

module.exports = TasksWrapper;