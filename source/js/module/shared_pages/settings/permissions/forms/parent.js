var Form = require('module/ui/form/form'),
	FormField = require('module/ui/form/form_field'),
	FormColumn = require('module/ui/form/form_column'),
	PromiseClass = require('module/core/promise'),
	ParentPermissionForm;

ParentPermissionForm = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		title: React.PropTypes.string.isRequired,
		onFormSubmit: React.PropTypes.func
	},
	schoolListService: function (schoolName) {
		var self = this,
			binding = self.getDefaultBinding();

		return window.Server.schools.get({
			filter: {
				where: {
					name: {
						like: schoolName,
						options: 'i'
					}
				},
				limit: 10
			}
		});
	},
	render: function() {
		var self = this;

		return (
			<Form name="Ask for permission as parent..." onSubmit={self.props.onFormSubmit} binding={self.getDefaultBinding()} >
				<FormField type="autocomplete" serviceFilter={self.schoolListService} field="schoolId" validation="required">School</FormField>
				<FormField type="text" field="comment" validation="required">Children name</FormField>
			</Form>
		)
	}
});


module.exports = ParentPermissionForm;
