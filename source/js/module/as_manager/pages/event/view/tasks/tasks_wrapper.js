const	React		= require('react'),
		Immutable	= require('immutable'),
		Morearty	= require('morearty'),

		Tasks		= require('./tasks');

const TasksWrapper = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		activeSchoolId	: React.PropTypes.string.isRequired
	},
	render: function() {
		return (
			<Tasks/>
		);
	}
});

module.exports = TasksWrapper;