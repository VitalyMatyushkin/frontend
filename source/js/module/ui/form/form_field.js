var FormField,
	typeList = require('module/ui/form/types/type_list');

FormField = React.createClass({
	propTypes: {
		type: React.PropTypes.string.isRequired
	},
	mixins: [Morearty.Mixin],
	render: function () {
		var self = this,
			binding = this.getDefaultBinding(),
			inputField =  React.createElement(typeList[self.props.type], {validation: self.props.validation, name: self.props.children});
		// mInvalid
		return (
			<div className="eForm_field">
				<div className="eForm_fieldName">{self.props.children}</div>

				{inputField}
			</div>




		)
	}
});

module.exports = FormField;
