const	React = require('react'),

		Task = require('./task');



const Tasks = React.createClass({
	propTypes: {
		tasks					: React.PropTypes.array.isRequired,
		handleClickChangeTask	: React.PropTypes.func.isRequired,
		handleClickDeleteTask	: React.PropTypes.func.isRequired
	},
	renderTasks: function() {
		return this.props.tasks.map(task => <Task task={task}/>);
	},
	render: function() {
		return (
			<div>
				{this.renderTasks()}
			</div>
		);
	}
});

module.exports = Tasks;