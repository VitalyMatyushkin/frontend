var Form = require('module/ui/form/form'),
	FormField = require('module/ui/form/form_field'),
	FormColumn = require('module/ui/form/form_column'),
	Promise = require('bluebird'),
	React = require('react'),
	StudentForm;

StudentForm = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		schoolId: React.PropTypes.string.isRequired,
		title: React.PropTypes.string.isRequired,
		onFormSubmit: React.PropTypes.func
	},
	getClassService: function() {
		var self = this;
		return function() {
			return window.Server.forms.get(self.props.schoolId);
		}
	},
	getHouseService: function() {
		var self = this;

		return function() {
			return window.Server.houses.get(self.props.schoolId);
		}
	},
	getGender: function() {
		var self = this,
			gendersArray = [
				{
					value: 'boy',
					id: 'male'
				},
				{
					value: 'girl',
					id: 'female'
				}
			];

		return Promise.resolve(gendersArray);
	},
	render: function() {
		var self = this;

		return (
			<Form name={self.props.title} onSubmit={self.props.onFormSubmit} binding={self.getDefaultBinding()} >
				<FormColumn type="column">
					<FormField type="text" field="firstName" validation="required">First name</FormField>
					<FormField type="text" field="lastName" validation="required">Last name</FormField>
					<FormField type="radio" field="gender" sourcePromise={self.getGender} validation="required">Gender</FormField>
				</FormColumn>

				<FormColumn type="column">
					<FormField type="date" field="birthday" validation="required">Birthday</FormField>
					<FormField type="autocomplete" serviceFullData={self.getClassService()} field="formId" validation="required">Form</FormField>
					<FormField type="autocomplete" serviceFullData={self.getHouseService()} field="houseId" validation="required">House</FormField>
				</FormColumn>
			</Form>
		)
	}
});


module.exports = StudentForm;
