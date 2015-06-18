var FormField,
	typeList = require('module/ui/form/types/type_list');

FormField = React.createClass({
	getDefaultState: function () {
		return Immutable.Map({
			value: '',
			showError: false,
			error: false
		});
	},
	propTypes: {
		type: React.PropTypes.string.isRequired,
		field: React.PropTypes.string.isRequired
	},
	mixins: [Morearty.Mixin],
	render: function () {
		var self = this,
			binding = this.getDefaultBinding(),
			inputField = React.createElement(typeList[self.props.type], self.props),
			fieldStyleClass = 'eForm_fieldSet';

		inputField = React.addons.cloneWithProps(inputField, {
			name: self.props.children,
			service: self.props.service,
			binding: self.getDefaultBinding()
		});

		if (binding.get('showError')) {
			fieldStyleClass += ' mInvalid';
		}

		return (
			<div className="eForm_field">
				<div className="eForm_fieldName">{self.props.children}</div>

				<div className={fieldStyleClass}>
					{inputField}

					<div className="eForm_fieldValidText">{binding.get('error')}</div>
				</div>
			</div>

		)
	}
});

module.exports = FormField;
