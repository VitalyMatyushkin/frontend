var Form = require('module/ui/form/form'),
	FormField = require('module/ui/form/form_field'),
	FormColumn = require('module/ui/form/form_column'),
	PupilForm;

PupilForm = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		schoolId: React.PropTypes.string.isRequired,
		title: React.PropTypes.string.isRequired,
		onFormSubmit: React.PropTypes.func
	},
	getClassService: function() {
		var self = this;

		return function() {
			return window.Server.schoolClasses.get(self.props.schoolId);
		}
	},
	getHouseService: function() {
		var self = this;

		return function() {
			return window.Server.schoolHouses.get(self.props.schoolId);
		}
	},
	render: function() {
		var self = this;

		return (
			<Form name={self.props.title} onSubmit={self.props.onFormSubmit} binding={self.getDefaultBinding()} >
				<FormColumn type="column">
					<FormField type="text" field="firstName" validation="required">First name</FormField>
					<FormField type="text" field="lastName" validation="required">Last name</FormField>
					<FormField type="text" field="gender" validation="required">Gender</FormField>
					<FormField type="text" field="age" validation="required">Age</FormField>
				</FormColumn>

				<FormColumn type="column">
					<FormField type="text" field="phone" validation="">Phone</FormField>
					<FormField type="text" field="email" validation="">E-mail</FormField>
					<FormField type="autocomplete" serviceFullData={self.getClassService()} field="classId" validation="required">Class</FormField>
					<FormField type="autocomplete" serviceFullData={self.getHouseService()} field="houseId" houseId="required">House</FormField>
				</FormColumn>
			</Form>
		)
	}
});


module.exports = PupilForm;
