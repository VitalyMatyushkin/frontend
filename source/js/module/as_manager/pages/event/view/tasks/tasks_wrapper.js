const	React		= require('react'),
		Immutable	= require('immutable'),
		Morearty	= require('morearty'),

		Tasks		= require('./tasks');

const TasksWrapper = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		activeSchoolId	: React.PropTypes.string.isRequired
	},
	getTasks: function() {
		return [
			{
				id: '1',
				text: "It should not be forgotten that the strengthening and development of the structure provides a wide range of (specialist) participated in the formation of forms of development. The significance of these problems are so obvious that implementation of the planned tasks in largely determines the creation of personnel training system, and meets urgent needs.",
				players: [
					{
						id: 1,
						firstName	: "Donald",
						lastName	: "Kramb"
					}, {
						id: 2,
						firstName	: "Maxim",
						lastName	: "Rudoy"
					}
				]
			}, {
				id: '2',
				text: "It should not be forgotten that the strengthening and development of the structure provides a wide range of (specialist) participated in the formation of forms of development. The significance of these problems are so obvious that implementation of the planned tasks in largely determines the creation of personnel training system, and meets urgent needs.",
				players: [
					{
						id: 1,
						firstName	: "Louise",
						lastName	: "Lourence"
					}, {
						id: 2,
						firstName	: "Jeff",
						lastName	: "Back"
					}
				]
			}
		];
	},
	getPlayers: function() {
		//return this.getDefaultBinding().toJS('viewPlayers.players')
		return [
			{
				id: 1,
				firstName	: "Louise",
				lastName	: "Lourence"
			}, {
				id: 2,
				firstName	: "Jeff",
				lastName	: "Back"
			}
		];
	},
	handleClickChangeTask: function(taskId) {

	},
	handleClickDeleteTask: function(taskId) {

	},
	render: function() {
		return (
			<Tasks	tasks					= {this.getTasks()}
					players					= {this.getPlayers()}
					handleClickDeleteTask	= {this.handleClickDeleteTask}
			/>
		);
	}
});

module.exports = TasksWrapper;