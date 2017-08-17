/**
 * Created by Woland on 01.08.2017.
 */
const 	React 			= require('react'),
		Immutable		= require('immutable'),
		Morearty		= require('morearty'),
		propz 			= require('propz');

const 	roleList 			= require('module/data/roles_data'),
		Form				= require('module/ui/form/form'),
		FormField 			= require('module/ui/form/form_field'),
		Popup 				= require('module/ui/new_popup'),
		SchoolListItem		= require('module/ui/autocomplete2/custom_list_items/school_list_item/school_list_item'),
    	RoleHelper			= require('module/helpers/role_helper'),
		SportManager		= require('module/shared_pages/settings/account/helpers/sport-manager');

const AddInviteStyles = require('styles/pages/admin_add_invite/b_add_invite_link.scss');

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
    componentWillMount:function(){
        this.initCountSportFieldsBlocks();
    },
    componentWillUnmount:function(){
        this.getDefaultBinding().clear();
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
		const 	inviteKey 	= propz.get(data, ['inviteKey']),
				binding 	= this.getDefaultBinding();

				binding.atomically()
					.set('isPopupOpen', true)
					.set('inviteKey', inviteKey)
					.commit();
	},
	onSubmit: function(data){
        const	binding		= this.getDefaultBinding(),
				sports		= binding.toJS('rivals'),
				{email, phone, firstName, lastName, preset, schoolId, comment, id} = data;

        const sportIds = this.isRoleCoachOrTeacherSelected() && sports.length>0 ? sports.map(r => r.id) : undefined;
		const dataToPost = Object.assign({}, {
			email,
			phone,
			firstName,
			lastName,
			permission: {
				preset: preset.toUpperCase(),
				schoolId,
                sportIds,
				comment,
				studentId: id
			}
		});
		//delete undefined fields
		for(let key in dataToPost){
			if (typeof dataToPost[key] === 'undefined') {
				delete dataToPost[key];
			}
		}

		return window.Server.invites.post(dataToPost).then(response => {
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
	onClickOkPopup: function(){
		const binding = this.getDefaultBinding();

		binding.set('isPopupOpen', false);
		document.location.hash = 'school-invite/list-invite';
	},
    isRoleCoachOrTeacherSelected: function() {
        const 	formBinding 	= this.getDefaultBinding().sub('form'),
            	selectedRole 	= formBinding.meta().toJS('preset.value');
        return selectedRole === RoleHelper.USER_PERMISSIONS.TEACHER.toLowerCase()
            || selectedRole === RoleHelper.USER_PERMISSIONS.COACH.toLowerCase();
    },
    initCountSportFieldsBlocks: function() {
        const binding = this.getDefaultBinding();

        const countSportFields = binding.toJS('countSportFields');

        if(typeof countSportFields === 'undefined' || countSportFields < 0) {
            binding.set('countSportFields', 0);
        }
        binding.set('rivals', Immutable.fromJS([]));
    },
	render: function(){
		const 	binding 	= this.getDefaultBinding(),
				isPopupOpen = Boolean(binding.toJS('isPopupOpen')),
				inviteKey 	= binding.toJS('inviteKey'),
				domain 		= document.location.host.replace('admin', 'invite'),
				protocol 	= document.location.href.split('/')[0],
				formBinding = binding.sub('form');

		return (
			<div className="bAddInviteLink">
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
						type 			= "phone"
						field 			= "phone"
						validation 		= "server phone"
						fieldClassName 	= "eAddInviteLinkFormField"
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
                    { this.isRoleCoachOrTeacherSelected() ?
						<div className="eForm_field">
							<div className="eForm_fieldName">
								Sports
							</div>
							<SportManager
								binding		= { binding }
								schoolId	= { this.getSchoolSelectedId() }
								serviceName = "sports"
								extraCssStyle	= "mInline mRightMargin mWidth308"
							/>
						</div>
                        :
						<div></div>
                    }
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
				<Popup
					isOpened 				= { isPopupOpen }
					handleClickCloseButton 	= { this.onClickOkPopup }
					isShowCloseButton 		= { true }
				>
					<span className="eInviteLinkPopup">{`Invite link: ${protocol}//${domain}/#${inviteKey}`}</span>
				</Popup>
			</div>
		);
	}
});

module.exports = AddInvite;