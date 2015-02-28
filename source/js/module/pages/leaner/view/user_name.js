var UserName;

UserName = React.createClass({
	mixins: [Morearty.Mixin],
	render: function() {
		var self = this,
			binding = self.getDefaultBinding();

		return (
			<div className="bUserName">{binding.get('name')} {binding.get('firstName')} {binding.get('lastName')}</div>
		)
	}
});


module.exports = UserName;
