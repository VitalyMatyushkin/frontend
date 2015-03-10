var Test;

Test = React.createClass({
	mixins: [Morearty.Mixin],
	render: function () {
		var self = this,
			binding = self.getDefaultBinding(),
			globalBinding = self.getMoreartyContext().getBinding();

		return (
			<div>
				TEST PAGE :D
			</div>
		)
	}
});


module.exports = Test;
