var TypeConfirmText,
	TypeText = require('module/ui/form/types/text'),
	TypeMixin = require('module/ui/form/types/input_mixin');

TypeConfirmText = React.createClass({
	mixins: [Morearty.Mixin, TypeMixin],
	errorText: 'Both fields should be the same',
	componentWillMount: function() {
		var self = this,
			binding = self.getDefaultBinding();

		binding.addListener('defaultValue', function() {
			var defaultValue = binding.get('defaultValue');

			defaultValue && self._forceNewValue(defaultValue);
		});
	},
	_forceNewValue: function(value) {
		var self = this;

		if (self.refs.confInput && value) {
			self.refs.confInput.getDOMNode().value = value;
			self.confirmValue = value;
		}
	},
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
		var self = this,
			defaultValue = self.getDefaultBinding().get('defaultValue');

		self._forceNewValue(defaultValue);

		return (
			<div>
				<TypeText {...self.props} onSetValue={self.onSetValue} />

				<div className="eForm_fieldInput">
					<div className="eForm_fieldSmallHelp">confirm {self.props.name.toLowerCase()}</div>
					<input ref="confInput" type="text" onBlur={self.setConfirmValue} onChange={self.changeConfirmValue} />
				</div>
			</div>

		)
	}
});

module.exports = TypeConfirmText;
