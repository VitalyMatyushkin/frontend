/**
 * Created by vitaly on 22.08.17.
 */
const   React           	= require('react'),
		Immutable      	 	= require('immutable'),
		Morearty        	= require('morearty'),
		Form 		    	= require('module/ui/form/form'),
		FormField 	    	= require('module/ui/form/form_field'),
		RoleList			= require('module/data/roles_data'),
		{RoleListWithoutSchool}	= require('module/data/roles_data_without_school'),
		ErrorAddRole		= require('module/data/text_add_role_error'),
		RoleHelper			= require('module/helpers/role_helper'),
		SportManager		= require('module/shared_pages/settings/account/helpers/sport-manager');

const FilteringServices = require('module/core/services/FilteringServices');

const NO_ROLES_DATA = [{id:'empty_role',  value:'No available roles'}];

const AddRole = React.createClass({
	mixins:[Morearty.Mixin],
	propTypes: {
		onCancel: React.PropTypes.func.isRequired
	},
	componentWillMount: function(){
		this.initCountSportFieldsBlocks();
		this.selectedSchool = undefined;
		this.getDefaultBinding().set('errorAddChild', false);
	},
	componentWillUnmount: function(){
		this.getDefaultBinding().clear();
	},
	onSubmitRole: function (model) {
		const   binding = this.getDefaultBinding(),
				sports		= binding.toJS('rivals'),
				userId = binding.get('userWithPermissionDetail.id');
		let body;

		switch(model.preset) {
			case 'parent':
				body = {
					preset:     model.preset.toUpperCase(),
					schoolId:   model.schoolId,
					studentId:  model.studentId
				};
				break;
			case 'coach':
			case 'teacher':
				body = {
					preset:     model.preset.toUpperCase(),
					schoolId:   model.schoolId,
					sportIds:	sports.map(r => r.id),
					studentId:  model.studentId
				};
				break;
			case 'public_blogger':
				body = {
					preset:     model.preset.toUpperCase()
				};
				break;
			default:
				body = {
					preset:     model.preset.toUpperCase(),
					schoolId:   model.schoolId
				};
				break;
		}

		if((model.preset === 'parent' && typeof model.studentId !== 'undefined') || model.preset !== 'parent') {
			window.Server.userPermissions.post(userId, body)
				.then(result => {
					binding.set('addRole',false);
					return this.props.onSuccess && this.props.onSuccess(result)
				})
				.catch((e) => {
					if (e.xhr.status === 404) {
						binding.set('errorAddChild', true);
					}
				});
		}
	},
	getStudents:function(filter){
		const formBinding = this.getDefaultBinding().sub('formAddRole');
		const schoolId = formBinding.meta('schoolId.value').toJS();

		return FilteringServices.studentsFilteringByLastName(schoolId, filter);
	},
	getRoleList: function() {
		if (typeof this.selectedSchool !== 'undefined') {
			const   fullSchoolData = this.selectedSchool,
					currentPermissions = this.getDefaultBinding().toJS('userWithPermissionDetail.permissions');

			let currentRoles = [];

			// user roles for active school
			if (Array.isArray(currentPermissions)) {
				currentRoles = currentPermissions
					.filter(p => p.schoolId === fullSchoolData.id && p.status === 'ACTIVE')
					.map(p => p.preset.toLowerCase());
			}
			// if user also have role in this school, we must cut this role from role list
			// but this restriction don't act on parent
			const hasUserCurrentRole = currentRole => {
				if (currentRole !== 'parent') {
					return currentRoles.find(role => role === currentRole);
				}
			};
			// for school union we leave only admin role
			if (fullSchoolData && fullSchoolData.kind === 'SchoolUnion') {
				return RoleList.filter(role => !hasUserCurrentRole(role.id) && role.id === 'admin');
			}

			//if in school disabled registration student, we must cut role 'student' from role list
			return RoleList.filter(role => {
				if (fullSchoolData && fullSchoolData.studentSelfRegistrationEnabled === false && role.id === 'student') {
					return false;
				} else {
					return !hasUserCurrentRole(role.id);
				}
			});
		} else {
			//Do not show the role of the blogger, if it already exists
			if (!this.getDefaultBinding().toJS('userWithPermissionDetail.permissions')
					.find(role => role.preset === RoleHelper.USER_PERMISSIONS_WITHOUT_SCHOOL.PUBLIC_BLOGGER && role.status !== "REMOVED")) {
				return RoleListWithoutSchool;
			} else {
				return NO_ROLES_DATA;
			}
		}
	},
	onSelectRole : function (data) {
		if (data !== NO_ROLES_DATA[0].id) {
			return data;
		}
	},
	getSchoolService: function() {
		return (schoolName) => {
			return window.Server.schools.get(
				{
					filter: {
						where: {
							name: {
								like: schoolName,
								options: 'i'
							},
							kind: {
								$in: ['School', 'SchoolUnion']
							}
						},
						order:"name ASC",
						limit: 400
					}
				});
		};
	},
	handleSelectSchool: function(schoolId, schoolData) {
		this.selectedSchool = schoolData;
		this.getDefaultBinding().sub('formAddRole').meta().remove('preset');
	},
	getSchoolSelectedId: function() {
		const formBinding = this.getDefaultBinding().sub('formAddRole');
		return formBinding.meta().toJS('schoolId.value');
	},
	isRoleCoachOrTeacherSelected: function() {
		const 	formBinding 	= this.getDefaultBinding().sub('formAddRole'),
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
	render: function() {
		const 	binding 		= this.getDefaultBinding(),
				formBinding 	= binding.sub('formAddRole'),
				errorAddChild 	= binding.get('errorAddChild'),
				schoolId    	= formBinding.meta('schoolId.value').toJS(),
				isParent		= Boolean(formBinding.meta('preset.value').toJS() === 'parent' && formBinding.meta('schoolId.value').toJS());
		return (
			<div className="bPopupEdit_container">
				<Form
					formStyleClass  = "mNarrow"
					name            = "Add role"
					binding         = {formBinding}
					onSubmit        = {this.onSubmitRole}
					defaultButton   = "Save"
					onCancel        = {this.props.onCancel}
				>
					<FormField	
						type			= "autocomplete"
						field			= "schoolId"
						onSelect		= { this.handleSelectSchool }
						serviceFullData	= { this.getSchoolService() }
					>
						School
					</FormField>
					<FormField
						type        = "select"
						key         = { typeof this.selectedSchool === 'undefined' ? 'withoutSchool' : this.selectedSchool.id }
						field       = "preset"
						sourceArray = { this.getRoleList() }
						onSelect    = { this.onSelectRole }
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
								extraCssStyle	= "mInline mRightMargin mWidth250"
							/>
						</div>
						:
						<div></div>
					}
					{
						errorAddChild ?
							<span className="verify_error">{ ErrorAddRole.addChild }</span>
							:
							<span></span>
					}
					<FormField	
						type			= "autocomplete"
						field			= "studentId"
						serverField		= "fullName"
						serviceFullData	= { this.getStudents }
						isDisabled		= { !isParent }
					>
						Student
					</FormField>
					<FormField	
						type		= "textarea"
						field		= "comment"
						validation	= "alphanumeric"
					>
						Comment
					</FormField>
				</Form>
			</div>
		);
	}
});
module.exports = AddRole;