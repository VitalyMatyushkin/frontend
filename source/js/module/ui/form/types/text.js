var TypeText,
	TypeMixin = require('module/ui/form/types/type_mixin');

TypeText = React.createClass({
	mixins: [Morearty.Mixin, TypeMixin],
	setConfirmValue: function(event) {
		var self = this,
			value = event.currentTarget.value,
			binding = self.getDefaultBinding();

		if (!binding.get('error')) {

			if (binding.get('value') !== value) {
				self.showError('Both fields should be the same');
			} else {
				self.hideError();
			}

		}

	},
	render: function () {
		var self = this,
			binding = self.getDefaultBinding(),
			fieldStyleClass,
			baseView,
			confirmView;

		if (binding.get('showError')) {
			fieldStyleClass = 'eForm_fieldSet mInvalid';
		} else {
			fieldStyleClass = 'eForm_fieldSet';
		}

		baseView =
			<div className="eForm_fieldInput">
				<input type="text" onBlur={self.setValue} onChange={self.changeValue} />
			</div>;

		if (self.validations.hasOwnProperty('confirm')) {
			confirmView =
				<div className="eForm_fieldInput">
					<div className="eForm_fieldSmallHelp">confirm {self.props.name.toLowerCase()}</div>
					<input type="text" onBlur={self.setConfirmValue} />
				</div>;
		}

		return (
			<div className={fieldStyleClass}>
				{baseView}
				{confirmView}

				<div className="eForm_fieldValidText">{binding.get('error')}</div>
			</div>
		)
	}
});

module.exports = TypeText;
