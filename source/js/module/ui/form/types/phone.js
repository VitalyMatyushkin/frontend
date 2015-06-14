var TypeMixin = require('module/ui/form/types/type_mixin'),
	MaskedInput = require('module/ui/masked_input'),
	TypePhone;

// (___)___-____
TypePhone =  React.createClass({
	mixins: [Morearty.Mixin, TypeMixin],
	componentWillMount: function() {
		var self = this,
			binding = self.getDefaultBinding();

		// На случай, если форма заполняется асинхронно
		binding.addListener('defaultValue', function() {
			self._forceNewValue(binding.get('defaultValue'));
		});
	},
	render: function () {
		var self = this,
			defaultValue = self.getDefaultBinding().get('defaultValue');

		self._forceNewValue(defaultValue);

		return (
			<div className="eForm_fieldInput">
				<MaskedInput ref="fieldInput" mask="(999)999-9999" />
			</div>
		)
	}
});


module.exports = TypePhone;