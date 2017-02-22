const 	Form		= require('module/ui/form/form'),
		FormField 	= require('module/ui/form/form_field'),
		FormColumn 	= require('module/ui/form/form_column'),
		Promise 	= require('bluebird'),
		Morearty	= require('morearty'),
		React 		= require('react');

/** Tiny student-related Form wrapper */
const StudentForm = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		schoolId: 		React.PropTypes.string.isRequired,
		title: 			React.PropTypes.string.isRequired,
		onFormSubmit: 	React.PropTypes.func,
		initialForm: 	React.PropTypes.object,
		initialHouse: 	React.PropTypes.object,
		binding: 		React.PropTypes.any
	},
	getClassService: function () {
		const self = this;
		return function (txt) {
			return window.Server.schoolForms.get(
				{
					schoolId: self.props.schoolId,
					filter: {
						where: {
							name: {
								like: txt
							}
						},
						limit: 100
					}
				});
		}
	},
	getHouseService: function () {
		const self = this;
		return function (txt) {
			return window.Server.schoolHouses.get(
				{
					schoolId: self.props.schoolId,
					filter: {
						where: {
							name: {
								like: txt
							}
						},
						limit: 100
					}
				});
		}
	},
	getGender: function () {
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
	render: function () {
		const self = this,
			binding = self.getDefaultBinding();

		return (
			<div className="eStudentForm container">
				<Form formStyleClass="row" onSubmit={self.props.onFormSubmit} binding={binding} submitOnEnter={false}>
					<FormColumn customStyle="col-md-5 col-md-offset-1">
						<h3>SUMMARY</h3>
						<FormField labelText="+" type="imageFile" field="avatar"/>
						<FormField type="text" field="firstName" validation="required">Name</FormField>
						<FormField type="text" field="lastName" validation="required">Surname</FormField>
						<FormField type="radio" field="gender" sourcePromise={self.getGender} validation="required">Gender</FormField>
						<FormField type="date" field="birthday" validation="birthday">Date of birth</FormField>
						<FormField type="autocomplete" serviceFullData={self.getClassService()} field="formId"
								   defaultItem={self.props.initialForm} >Form</FormField>
						<FormField type="autocomplete" serviceFullData={self.getHouseService()} field="houseId"
								   defaultItem={self.props.initialHouse} >House</FormField>
						<FormField classNames="mSingleLine" type="checkbox" field="unwell" >Injured/Unwell</FormField>
						<FormField type="textarea" field="medicalInfo">Medical Information</FormField>
					</FormColumn>
					<FormColumn customStyle="col-md-5">
						<h3>NEXT OF KIN</h3>
						<FormField type="text" field="nok_relationship">Relationship</FormField>
						<FormField type="text" field="nok_firstName">Name</FormField>
						<FormField type="text" field="nok_lastName">Surname</FormField>
						<FormField type="phone" field="nok_phone" validation="phone">Phone</FormField>
						<FormField type="text" field="nok_email" validation="email">Email</FormField>
					</FormColumn>
				</Form>
			</div>
		)
	}
});


module.exports = StudentForm;
