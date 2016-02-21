const 	Form		= require('module/ui/form/form'),
		FormField 	= require('module/ui/form/form_field'),
		FormColumn 	= require('module/ui/form/form_column'),
		Promise 	= require('bluebird'),
		React 		= require('react');

const StudentForm = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		schoolId: React.PropTypes.string.isRequired,
		title: React.PropTypes.string.isRequired,
		onFormSubmit: React.PropTypes.func
	},
	getClassService: function() {
		const self = this;
		return function() {
			return window.Server.forms.get(self.props.schoolId);
		}
	},
	getHouseService: function() {
		const self = this;

		return function() {
			return window.Server.houses.get(self.props.schoolId);
		}
	},
	getGender: function() {
		const 	self = this,
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

		return ( <div className="editStudentForm">
			<Form name={self.props.title} onSubmit={self.props.onFormSubmit} binding={self.getDefaultBinding()} >
				<FormColumn type="column">
					<FormField type="text" field="firstName" promptOnBlank="true" validation="required">First name</FormField>
					<FormField type="text" field="lastName" promptOnBlank="true" validation="required">Last name</FormField>
					<FormField type="radio" field="gender"  sourcePromise={self.getGender} validation="required">Gender</FormField>
					<FormField type="date" field="birthday" validation="date">Birthday</FormField>
					<FormField type="autocomplete" serviceFullData={self.getClassService()} field="formId" validation="required">Form</FormField>
					<FormField type="autocomplete" serviceFullData={self.getHouseService()} field="houseId" validation="required">House</FormField>
				</FormColumn>
				<FormColumn type="column">
					<FormField type="textarea" field="name">Next of Kin:</FormField>
				</FormColumn>
				<FormColumn type="column">
					<FormField type="textarea" field="allergy">Medical Information</FormField>
				</FormColumn>
			</Form></div>
		)
	}
});


module.exports = StudentForm;
