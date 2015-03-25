var Form = require('module/ui/form/form'),
	FormField = require('module/ui/form/form_field'),
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
			<Form name="Add new school" binding={self.getDefaultBinding()} onSubmit={self.props.onSubmit}>
				<FormField type="area" field="zipCodeId" validation="required">Postcode</FormField>
				<FormField type="text" field="name" validation="required">Name</FormField>
				<FormField type="text" field="description" validation="required">Description</FormField>
				<FormField type="text" field="address" validation="required">Address</FormField>
			</Form>
		)
	}
});


module.exports = SchoolForm;
