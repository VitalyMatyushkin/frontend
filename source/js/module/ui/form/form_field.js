var FormField,
	typeList = require('module/ui/form/types/type_list');

FormField = React.createClass({
	propTypes: {
		type: React.PropTypes.string.isRequired,
		field: React.PropTypes.string.isRequired
	},
	mixins: [Morearty.Mixin],
	render: function () {
		var self = this,
			binding = this.getDefaultBinding(),
			inputField =  React.createElement(typeList[self.props.type], self.props);

		inputField = React.addons.cloneWithProps(inputField, {
			name: self.props.children,
			service: self.props.service,
			binding: self.getDefaultBinding().sub(self.props.field)
		});

		return (
			<div className="eForm_field">
				<div className="eForm_fieldName">{self.props.children}</div>

				{inputField}
			</div>

		)
	}
});

module.exports = FormField;
