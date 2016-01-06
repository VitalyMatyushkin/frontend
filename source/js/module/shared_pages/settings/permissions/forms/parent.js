var Form = require('module/ui/form/form'),
	FormField = require('module/ui/form/form_field'),
	FormColumn = require('module/ui/form/form_column'),
	FormMixin = require('module/shared_pages/settings/permissions/forms/form_mixin'),
	React = require('react'),
	ReactDOM = require('reactDom'),
	ParentPermissionForm;

ParentPermissionForm = React.createClass({
	mixins: [Morearty.Mixin, FormMixin],
	render: function() {
		var self = this;

		return (
			<div>
				<Form name="Ask for permission as parent..." onSubmit={self.props.onFormSubmit} binding={self.getDefaultBinding()} >
					<FormField type="autocomplete" serviceFilter={self.schoolListService} field="schoolId" validation="required">School</FormField>
					<FormField type="text" field="comment" validation="required">Children name</FormField>
					<div className="bLinkLike mLinkToLeft" onClick={self.props.goBackClick}>← change type</div>
				</Form>

			</div>
		)
	}
});


module.exports = ParentPermissionForm;
