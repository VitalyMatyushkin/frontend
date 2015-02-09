var Form = require('module/ui/form/form'),
	FormField = require('module/ui/form/form_field'),
	AddSchoolForm;

AddSchoolForm = React.createClass({
	mixins: [Morearty.Mixin],
	onSuccess: function() {
		var self = this;


	},
	render: function() {
		var self = this;

		return (
			<Form name="Add new school" service="schools" binding={self.getDefaultBinding()} onSuccess={self.props.onSuccess}>
				<FormField type="area" field="zipCodeId" validation="required">Zip code</FormField>
				<FormField type="text" field="name" validation="required">Name</FormField>
			</Form>
		)
	}
});


module.exports = AddSchoolForm;
