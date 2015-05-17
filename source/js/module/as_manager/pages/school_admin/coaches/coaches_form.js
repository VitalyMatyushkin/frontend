var Form = require('module/ui/form/form'),
	FormField = require('module/ui/form/form_field'),
	FormColumn = require('module/ui/form/form_column'),
 	PromiseClass = require('module/core/promise'),
	CoachesForm;

CoachesForm = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		title: React.PropTypes.string.isRequired,
		onFormSubmit: React.PropTypes.func
	},
	render: function() {
		var self = this;

		return (
			<Form name={self.props.title} onSubmit={self.props.onFormSubmit} binding={self.getDefaultBinding()} >
				<FormColumn type="column">
					<FormField type="text" field="realms" validation="required">Realms</FormField>
					<FormField type="text" field="firstName" validation="required">First name</FormField>
					<FormField type="text" field="lastName" validation="required">Last name</FormField>
				</FormColumn>

				<FormColumn type="column">
					<FormField type="text" field="email" validation="required">Email</FormField>
					<FormField type="text" field="phone" validation="required">Phone</FormField>
					<FormField type="text" field="password" validation="required">Password</FormField>
				</FormColumn>
			</Form>
		)
	}
});


module.exports = CoachesForm;
