var TypeText,
	ValidationMixin = require('module/ui/form/validation_mixin');

TypeText = React.createClass({
	mixins: [Morearty.Mixin, ValidationMixin],
	getInitialState: function () {
		var self = this;

		return {
			value: self.props.value || '',
			error: false
		};
	},
	setValue: function(event) {
		var self = this,
			value = event.currentTarget.value;

		self.showError(self.validate(value));

		self.setState({
			value: value
		});
	},
	setConfirmValue: function(event) {
		var self = this,
			value = event.currentTarget.value;

		self.showError(self.state.value !== value ? 'Both passwords should be the same' : false );
	},
	showError: function(errorText) {
		var self = this;

		if (errorText === undefined) {
			errorText = false;
		}

		self.setState({
			error: errorText
		});
	},
	render: function () {
		var self = this,
			binding = this.getDefaultBinding(),
			fieldStyleClass,
			baseView,
			confirmView;

		if (self.state.error) {
			fieldStyleClass = 'eForm_fieldSet mInvalid';
		} else {
			fieldStyleClass = 'eForm_fieldSet';
		}


		//
		baseView =
			<div className="eForm_fieldInput">
				<input type="text" onChange={self.setValue} />
			</div>;

		if (self.validations.hasOwnProperty('confirm')) {
			confirmView =
				<div className="eForm_fieldInput">
					<div className="eForm_fieldSmallHelp">confirm {self.props.name.toLowerCase()}</div>
					<input type="text" onChange={self.setConfirmValue} />
				</div>;
		}

		return (
			<div className={fieldStyleClass}>
				{baseView}
				{confirmView}

				<div className="eForm_fieldValidText">{self.state.error}</div>
			</div>
		)
	}
});

module.exports = TypeText;
