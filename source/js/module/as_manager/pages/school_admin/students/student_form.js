const 	Form		= require('module/ui/form/form'),
		FormField 	= require('module/ui/form/form_field'),
		FormColumn 	= require('module/ui/form/form_column'),
		Promise 	= require('bluebird'),
		React 		= require('react');

/** Tiny student-related Form wrapper */
const StudentForm = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		schoolId: 			React.PropTypes.string.isRequired,
		title: 				React.PropTypes.string.isRequired,
		onFormSubmit: 		React.PropTypes.func,
		initialForm:		React.PropTypes.object,
		initialHouse:		React.PropTypes.object,
		binding: 			React.PropTypes.any
	},
	getClassService: function(){
		const self = this;
		return function(txt){
			return window.Server.schoolForms.get(
				{
					schoolId:self.props.schoolId,
					filter:{
						where:{
							name:{
								like : txt
							}
						}
					}
				});
		}
	},
	getHouseService: function() {
		const self = this;
		return function(txt) {
			return window.Server.schoolHouses.get(
				{
					schoolId:self.props.schoolId,
					filter:{
						where:{
							name:{
								like: txt
							}
						}
					}
				});
		}
	},
	getGender: function() {
		const gendersArray = [
			{
				value: 'boy',
				id: 'MALE'
			},
			{
				value: 'girl',
				id: 'FEMALE'
			}
		];

		return Promise.resolve(gendersArray);
	},
	render: function() {
		const self = this;

		return ( <div className="editStudentForm">
			<Form name={self.props.title} onSubmit={self.props.onFormSubmit} binding={self.getDefaultBinding()} >
				<FormColumn type="column">
					<FormField type="text" field="firstName" promptOnBlank="true" validation="required">First name</FormField>
					<FormField type="text" field="lastName" promptOnBlank="true" validation="required">Last name</FormField>
					<FormField type="radio" field="gender"  sourcePromise={self.getGender} validation="required">Gender</FormField>
					<FormField type="date" field="birthday" validation="date">Birthday</FormField>
					<FormField type="autocomplete" serviceFullData={self.getClassService()} field="formId" defaultItem={self.props.initialForm} validation="required">Form</FormField>
					<FormField type="autocomplete" serviceFullData={self.getHouseService()} field="houseId" defaultItem={self.props.initialHouse} validation="required">House</FormField>
				</FormColumn>
				<FormColumn type="column">
					<FormField type="textarea" field="nextOfKin">Next of Kin:</FormField>
				</FormColumn>
				<FormColumn type="column">
					<FormField type="textarea" field="medicalInfo">Medical Information</FormField>
				</FormColumn>
			</Form></div>
		)
	}
});


module.exports = StudentForm;
