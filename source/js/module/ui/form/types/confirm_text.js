var TypeConfirmText,
	TypeText = require('module/ui/form/types/text'),
	TypeMixin = require('module/ui/form/types/input_mixin');

TypeConfirmText = React.createClass({
	mixins: [Morearty.Mixin, TypeMixin],
	errorText: 'Both fields should be the same',
	onSetValue: function() {
		var self = this;

		self.checkConfirm();
	},
	setConfirmValue: function(event) {
		var self = this;

		self.confirmValue = event.currentTarget.value;
		self.checkConfirm();
	},
	changeConfirmValue: function() {
		var self = this;

		self.hideError();
	},
	checkConfirm: function() {
		var self = this,
			binding = self.getDefaultBinding(),
			error = binding.get('error');

		// Проверку на совпадение полей делаем только в том случае, если нет других ошибок валидации
		if (!error || error === self.errorText) {
			binding.set('error', self.errorText);

			if (self.confirmValue && binding.get('value') === self.confirmValue) {
				self.getDefaultBinding().set('error', false);
				self.hideError();
			}
		}
	},
	render: function() {
		var self = this;

		return (
			<div>
				<TypeText {...self.props} onSetValue={self.onSetValue} />

				<div className="eForm_fieldInput">
					<div className="eForm_fieldSmallHelp">confirm {self.props.name.toLowerCase()}</div>
					<input type="text" onBlur={self.setConfirmValue} onChange={self.changeConfirmValue} />
				</div>
			</div>

		)
	}
});

module.exports = TypeConfirmText;
