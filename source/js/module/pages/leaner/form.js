var Form = require('module/ui/form/form'),
	FormField = require('module/ui/form/form_field'),
	FormColumn = require('module/ui/form/form_column'),
	AddNewLeaner;

AddNewLeaner = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		schoolId: React.PropTypes.string.isRequired,
		learnerId: React.PropTypes.string,
		mode: React.PropTypes.string
	},
	onSuccess: function(data) {
		var self = this;

		// Переход к списку школ
		document.location.hash = 'school?id=' + self.props.schoolId;
	},
	submitForm: function(data) {
		var self = this;

		if (self.props.mode === 'edit' && self.props.learnerId) {
			window.Server.learner.put({
				learnerId: self.props.learnerId,
				schoolId: self.props.schoolId
			}, data).then(self.onSuccess.bind(self));
		} else {
			data.schoolId = self.props.schoolId;
			window.Server.learners.post(self.props.schoolId, data).then(self.onSuccess.bind(self));
		}
	},
	getClassService: function() {
		var self = this;

		return function() {
			return window.Server.classes.get(self.props.schoolId);
		}
	},
	getHouseService: function() {
		var self = this;

		return function() {
			return window.Server.houses.get(self.props.schoolId);
		}
	},
	render: function() {
		var self = this,
			formTitle = self.props.mode === 'edit' ? 'Edit pupil' : 'Add new pupil';

		return (
			<Form name={formTitle} onSubmit={self.submitForm} binding={self.getDefaultBinding()} >
				<FormColumn type="column">
					<FormField type="text" field="firstName" validation="required">First name</FormField>
					<FormField type="text" field="lastName" validation="required">Last name</FormField>
					<FormField type="text" field="gender" validation="required">Gender</FormField>
					<FormField type="text" field="age" validation="required">Age</FormField>
				</FormColumn>

				<FormColumn type="column">
					<FormField type="text" field="phone" validation="">Phone</FormField>
					<FormField type="text" field="email" validation="">E-mail</FormField>
					<FormField type="autocomplete" serviceFunction={self.getClassService()} field="classId" validation="required">Class</FormField>
					<FormField type="autocomplete" serviceFunction={self.getHouseService()} field="houseId" houseId="required">Class</FormField>
				</FormColumn>
			</Form>
		)
	}
});


module.exports = AddNewLeaner;
