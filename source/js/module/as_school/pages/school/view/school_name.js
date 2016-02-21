const React = require('react');

const SchoolName = React.createClass({
	mixins: [Morearty.Mixin],
	render: function() {
		const 	self 	= this,
				binding = self.getDefaultBinding();

		return (
			<div className="bUserName">{binding.get('name')}</div>
		)
	}
});


module.exports = SchoolName;
