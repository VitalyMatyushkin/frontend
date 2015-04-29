var Form = require('module/ui/form/form'),
	FormField = require('module/ui/form/form_field'),
	FormColumn = require('module/ui/form/form_column'),
	SchoolForm;

SchoolForm = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		title: React.PropTypes.string.isRequired,
		onSubmit: React.PropTypes.func
	},
	render: function() {
		var self = this;

		return (
			<Form name={self.props.title} binding={self.getDefaultBinding()} onSubmit={self.props.onSubmit}>
				<FormColumn type="column">
					<FormField type="text" field="name" validation="required">Name</FormField>
					<FormField type="text" field="description" validation="required">Description</FormField>
					<FormField type="text" field="phone" validation="required">Phone</FormField>
				</FormColumn>

				<FormColumn type="column">
					<FormField type="area" field="zipCodeId" validation="required">Postcode</FormField>
					<FormField type="text" field="address" validation="required">Address</FormField>
				</FormColumn>
			</Form>
		)
	}
});


module.exports = SchoolForm;
