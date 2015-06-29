var Form = require('module/ui/form/form'),
	FormField = require('module/ui/form/form_field'),
	FormColumn = require('module/ui/form/form_column'),
	CoachPermissionForm;

CoachPermissionForm = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		title: React.PropTypes.string.isRequired,
		onFormSubmit: React.PropTypes.func
	},
	render: function() {
		var self = this;

		return (
			<Form name="Ask for permission as coach..." onSubmit={self.props.onFormSubmit} binding={self.getDefaultBinding()} >
				<FormField type="text" field="comment" validation="required">Children name</FormField>
			</Form>
		)
	}
});


module.exports = CoachPermissionForm;
