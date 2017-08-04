/**
 * Created by Woland on 01.08.2017.
 */
const 	React 			= require('react'),
		Morearty		= require('morearty');

const 	roleList 			= require('module/data/roles_data'),
		Form				= require('module/ui/form/form'),
		FormField 			= require('module/ui/form/form_field'),
		SchoolListItem		= require('module/ui/autocomplete2/custom_list_items/school_list_item/school_list_item');

const AddInvite = React.createClass({
	mixins: [Morearty.Mixin],
	schoolService: function(schoolName) {
		const filter = {
			filter: {
				where: {
					name: {
						like: schoolName,
						options: 'i'
					},
					kind: {
						$in: ['School', 'SchoolUnion']
					},
					/* this param was added later, so it is undefined on some schools. Default value is true.
					 * undefined considered as 'true'. So, just checking if it is not explicitly set to false
					 */
					availableForRegistration: { $ne: false }
				},
				limit: 20,
				order: "name ASC"
			}
		};
		
		return window.Server.publicSchools.get(filter);
	},
	studentService: function(name){
		const 	formBinding 	= this.getDefaultBinding().sub('form'),
				schoolId 		= formBinding.meta().toJS('schoolId.value');
		
		let		filter;
		
		if (name === '') {
			filter = {
				limit: 100
			}
		} else {
			filter = {
				limit: 100,
				$or: [
					{
						firstName: {
							like: name,
							options: 'i'
						}
					},
					{
						lastName: {
							like: name,
							options: 'i'
						}
					}
				]
			}
		}
		
		return window.Server.schoolStudents.get(
			{ schoolId },
			{ filter }
		)
		.then(students => {
				students.forEach(student => {
					student.name = student.firstName + " " + student.lastName;
				});
				return students;
			},
			error => {
				console.error(error);
			});
	},
	onSuccess: function(data){
		const domain = document.location.host.replace('admin', 'app');
		window.simpleAlert(
			`Invite link: ${domain}/${data.inviteKey}`,
			'Ok',
			() => {
				document.location.hash = 'school-invite/list-invite';
			}
		);
	},
	onSubmit: function(data){
		const {email, phone, firstName, lastName, preset, schoolId, comment, id} = data;
		const dataToPost = Object.assign({}, {
			email,
			phone,
			firstName,
			lastName,
			permission: {
				preset: preset.toUpperCase(),
				schoolId,
				comment,
				studentId: id
			}
		});
		//delete undefined fields
		for(let key in dataToPost){
			if (typeof key === 'undefined') {
				delete dataToPost[key];
			}
		}

		return window.Server.invite.post(dataToPost).then(response => {
			this.onSuccess(response);
		});
	},
	isSchoolSelected: function() {
		const formBinding = this.getDefaultBinding().sub('form');

		return typeof formBinding.meta().toJS('schoolId.value') !== 'undefined' &&
			formBinding.meta().toJS('schoolId.value') !== '';
	},
	isParent: function(){
		const formBinding = this.getDefaultBinding().sub('form');

		return typeof formBinding.meta('preset.value').toJS() !== 'undefined'
				&& formBinding.meta('preset.value').toJS().toLowerCase() === 'parent';
	},
	isRoleSelected: function(){
		const formBinding = this.getDefaultBinding().sub('form');

		return typeof formBinding.meta().toJS('preset.value') !== 'undefined' &&
			formBinding.meta().toJS('preset.value') !== '';
	},
	isRoleSelectDisabled: function(){
		return !this.isSchoolSelected();
	},
	getPlaceHolderForRoleSelect: function() {
		return this.isSchoolSelected() ? 'Please select role' : "";
	},
	getSchoolSelectedId: function() {
		const formBinding = this.getDefaultBinding().sub('form');
		
		return formBinding.meta().toJS('schoolId.value');
	},
	render: function(){
		const	binding		= this.getDefaultBinding(),
				formBinding	= binding.sub('form');

		return (
			<Form
					name 			= "Create New User Invite"
					updateBinding	= { true }
					binding			= { formBinding }
					onSubmit 		= { this.onSubmit }
			>
				<FormField
					type 		= "text"
					field 		= "firstName"
					validation 	= "alphanumeric"
				>
					First name
				</FormField>
				<FormField
					type 		= "text"
					field 		= "lastName"
					validation 	= "alphanumeric"
				>
					Last name
				</FormField>
				<FormField
					type 		= "text"
					field 		= "email"
					validation 	= "alphanumeric required"
				>
					Email
				</FormField>
				<FormField
					type 		= "phone"
					field 		= "phone"
					validation 	= "phone"
				>
					Phone
				</FormField>
				<FormField
					type			= "autocomplete"
					field			= "schoolId"
					serviceFullData	= { this.schoolService }
					customListItem	= { SchoolListItem }
					placeholder 	= { 'Please select school' }
					validation 		= "required"
				>
					School
				</FormField>
				<FormField
					type		= "select"
					field		= "preset"
					sourceArray	= { roleList }
					isDisabled	= { this.isRoleSelectDisabled() }
					placeHolder	= { this.getPlaceHolderForRoleSelect() }
					validation 	= "required"
				>
					Role
				</FormField>
				<FormField
					type			= "autocomplete"
					field			= "id"
					serverField		= "name"
					serviceFilter	= { this.studentService }
					isDisabled		= { !(this.isRoleSelected() && this.isParent()) }
					placeholder 	= { 'Please select student' }
				>
					Student
				</FormField>
				<FormField
					type 		="textarea"
					field 		="comment"
				>
					Comment
				</FormField>
			</Form>
		);
	}
});

module.exports = AddInvite;