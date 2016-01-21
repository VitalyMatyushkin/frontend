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

		return (
			<Form name={self.props.title} onSubmit={self.props.onFormSubmit} binding={self.getDefaultBinding()} >
				<FormColumn type="column">
					<FormField type="text" field="firstName" validation="required">First name</FormField>
					<FormField type="text" field="lastName" validation="required">Last name</FormField>
					<FormField type="radio" field="gender"  sourcePromise={self.getGender} validation="required">Gender</FormField>
				</FormColumn>

				<FormColumn type="column">
					<FormField type="date" field="birthday" validation="date">Birthday</FormField>
					<FormField type="autocomplete" serviceFullData={self.getClassService()} field="formId" validation="required">Form</FormField>
					<FormField type="autocomplete" serviceFullData={self.getHouseService()} field="houseId" validation="required">House</FormField>
				</FormColumn>
				<FormColumn type="column">
					<FormField type="text" field="name">Next of Kin: First name</FormField>
					<FormField type="text" field="surname">Next of Kin: Surname</FormField>
					<FormField type="phone" field="phone" validation="phone">Phone:</FormField>
					<FormField type="text" field="role">Relationship:</FormField>
				</FormColumn>
				<FormColumn type="column">
					<FormField type="text" field="allergy">Allergy</FormField>
					<FormField type="text" field="injures">Injury</FormField>
					<FormField type="text" field="other">Other:</FormField>
				</FormColumn>
			</Form>
		)
	}
});


module.exports = StudentForm;
