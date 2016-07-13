const 	Morearty    = require('morearty'),
		React 		= require('react');

UserName = React.createClass({
	mixins: [Morearty.Mixin],
	render: function() {
		var self = this,
			binding = self.getDefaultBinding();

		return (
			<div className="bUserName">{binding.get('student.firstName')} {binding.get('student.lastName')}</div>
		)
	}
});


module.exports = UserName;
