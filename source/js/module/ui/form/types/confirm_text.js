const TypeText = require('module/ui/form/types/text'),
	React = require('react'),
	ReactDOM = require('reactDom'),
	TypeMixin = require('module/ui/form/types/type_mixin'),
    errorText = 'Values in both fields do not match',

TypeConfirmText = React.createClass({
	mixins: [Morearty.Mixin, TypeMixin],
	componentWillMount: function() {
		const self = this,
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
        this.checkConfirm();
	},
	setConfirmValue: function(event) {
        this.confirmValue = event.currentTarget.value;
        this.checkConfirm();
	},
	checkConfirm: function() {
		const self = this,
			binding = self.getDefaultBinding(),
			error = binding.get('error');

		// Проверку на совпадение полей делаем только в том случае, если нет других ошибок валидации
		if (!error || error === errorText) {
			binding.set('error', errorText);

			if (self.confirmValue && binding.get('value') === self.confirmValue) {
                binding.set('error', false);
				self.hideError();
			}
		}
	},
	render: function() {
        const self = this,
            binding = self.getDefaultBinding(),
			defaultValue = binding.get('defaultValue');

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
