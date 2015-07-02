var Form = require('module/ui/form/form'),
	FormField = require('module/ui/form/form_field'),
	FormColumn = require('module/ui/form/form_column'),
	FormMixin = require('module/shared_pages/settings/permissions/forms/form_mixin'),
	OfficialPermissionForm;

OfficialPermissionForm = React.createClass({
	mixins: [Morearty.Mixin, FormMixin],
	render: function() {
		var self = this;

		return (
			<Form name="Ask for permission as manager..." onSubmit={self.props.onFormSubmit} binding={self.getDefaultBinding()} >
				<FormField type="autocomplete" serviceFilter={self.schoolListService} field="schoolId" validation="required">School</FormField>
				<div className="bLinkLike mLinkToLeft" onClick={self.props.goBackClick}>← change type</div>
			</Form>
		)
	}
});


module.exports = OfficialPermissionForm;
