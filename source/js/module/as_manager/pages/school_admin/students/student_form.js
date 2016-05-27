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
		const self = this,
			binding = self.getDefaultBinding();

		return (
			<div className="editStudentForm">
				<Form name={self.props.title} onSubmit={self.props.onFormSubmit} binding={binding} >
					<FormColumn type="column">
						<FormField type="text" field="firstName" validation="required">Name</FormField>
						<FormField type="text" field="lastName" validation="required">Surname</FormField>
						<FormField type="radio" field="gender"  sourcePromise={self.getGender} validation="required">Gender</FormField>
						<FormField type="date" field="birthday" validation="date">Birthday</FormField>
						<FormField type="autocomplete" serviceFullData={self.getClassService()} field="formId" defaultItem={self.props.initialForm} validation="required">Form</FormField>
						<FormField type="autocomplete" serviceFullData={self.getHouseService()} field="houseId" defaultItem={self.props.initialHouse} validation="required">House</FormField>
					</FormColumn>
					<FormColumn type="column">
						<FormField type="textarea" field="medicalInfo">Medical Information</FormField>
					</FormColumn>
					<FormColumn type="column">
						<FormField type="text" field="nok_relationship" validation="required" >Relationship</FormField>
						<FormField type="text" field="nok_firstName" validation="required" >Name</FormField>
						<FormField type="text" field="nok_lastName" validation="required" >Surname</FormField>
						<FormField type="phone" field="nok_phone" validation="phone required" >Phone</FormField>
						<FormField type="text" field="nok_email" validation="required email" >Email</FormField>
					</FormColumn>
				</Form>
			</div>
		)
	}
});


module.exports = StudentForm;
