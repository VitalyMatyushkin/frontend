var TypeConfirmText,
	TypeText = require('module/ui/form/types/text'),
	React = require('react'),
	ReactDOM = require('reactDom'),
	TypeMixin = require('module/ui/form/types/type_mixin');

TypeConfirmText = React.createClass({
	mixins: [Morearty.Mixin, TypeMixin],
	errorText: 'Values in both fields do not match',
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

		if (ReactDOM.findDOMNode(self.refs.confInput) && value) {
			ReactDOM.findDOMNode(self.refs.confInput).value = value;
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

		//self._forceNewValue(defaultValue);

		return (
			<div>
				<div className="eForm_fieldColumn">
					<TypeText {...self.props} onSetValue={self.onSetValue} />
				</div>

				<div className="eForm_fieldColumn">
					<div className="eForm_fieldInput">
						<div className="eForm_fieldName eForm_fieldSmallHelp">Confirm {self.props.name.toLowerCase()}</div>
						<input ref="confInput" type={self.props.textType || 'text'} onBlur={self.setConfirmValue} onChange={self.changeConfirmValue} />
					</div>
				</div>
			</div>

		)
	}
});

module.exports = TypeConfirmText;
