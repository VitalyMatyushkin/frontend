var SchoolName;

SchoolName = React.createClass({
	mixins: [Morearty.Mixin],
	render: function() {
		var self = this,
			binding = self.getDefaultBinding();

		return (
			<div className="bUserName">{binding.get('name')}</div>
		)
	}
});


module.exports = SchoolName;
