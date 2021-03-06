/**
 * Created by Anatoly on 09.03.2016.
 */

const	Form				= require('../../../../ui/form/form'),
		FormField			= require('../../../../ui/form/form_field'),
		React				= require('react'),
		Morearty			= require('morearty'),
		Immutable			= require('immutable'),
		RoleList			= require('module/data/roles_data'),
		ErrorAddRole		= require('module/data/text_add_role_error'),
		{RoleListWithoutSchool}	= require('module/data/roles_data_without_school'),
		RoleHelper			= require('module/helpers/role_helper'),
		SportManager		= require('module/shared_pages/settings/account/helpers/sport-manager');

const FilteringServices = require('module/core/services/FilteringServices');

const NO_ROLES_DATA = [{id:'empty_role',  value:'No available roles'}];

const GrantRole = React.createClass({
	mixins:[Morearty.Mixin],
	propTypes: {
		userIdsBinding		: React.PropTypes.object,
		userPermissionsBinding	: React.PropTypes.object,
		onSuccess			: React.PropTypes.func,
		handleClickCancel	: React.PropTypes.func
	},
	componentWillMount:function(){
		const   self    = this,
				ids     = self.props.userIdsBinding.toJS();

		this.getDefaultBinding().set('errorAddChild', false);
		this.selectedSchool = undefined;
		this.initCountSportFieldsBlocks();
		if(!ids)
			console.error('Error! "userIdsBinding" is not set.');
	},
	componentWillUnmount:function(){
		this.getDefaultBinding().clear();
	},
	getStudents:function(filter){
		const self = this;
		const binding = self.getDefaultBinding().sub('formGrantRole');
		const schoolId = binding.meta('schoolId.value').toJS();

		return FilteringServices.studentsFilteringByLastName(schoolId, filter);
	},
	getRoleList: function() {
		if (typeof this.selectedSchool !== 'undefined') {
			const 	fullSchoolData = this.selectedSchool,
					currentPermissions = this.props.userPermissionsBinding.toJS();

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
		} else  {
			//Do not show the role of the blogger, if it already exists
			if (!this.props.userPermissionsBinding.toJS()
					.find(role => role.preset === RoleHelper.USER_PERMISSIONS_WITHOUT_SCHOOL.PUBLIC_BLOGGER)) {
				return RoleListWithoutSchool;
			}  else {
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
	continueButtonClick:function(model){
		const   binding = this.getDefaultBinding(),
				sports		= binding.toJS('rivals');
		let ids = this.props.userIdsBinding.toJS();
		ids = ids && typeof ids === 'string' ? [ids] : ids;

		ids.forEach(currentId => {
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
						sportIds:	sports.map(r => r.id)
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
				window.Server.userPermissions.post(currentId, body)
					.then(result => {this.props.onSuccess && this.props.onSuccess(result)})
					.catch((e) => {
						if (e.xhr.status === 404) {
							binding.set('errorAddChild', true);
						}
					});
			}
		});
	},
	handleSelectSchool: function(schoolId, schoolData) {
		this.selectedSchool = schoolData;
		this.getDefaultBinding().sub('formGrantRole').meta().remove('preset');
	},
	getSchoolSelectedId: function() {
		const binding = this.getDefaultBinding().sub('formGrantRole');
		return binding.meta().toJS('schoolId.value');
	},
	initCountSportFieldsBlocks: function() {
		const binding = this.getDefaultBinding();

		const countSportFields = binding.toJS('countSportFields');

		if(typeof countSportFields === 'undefined' || countSportFields < 0) {
			binding.set('countSportFields', 0);
		}
		binding.set('rivals', Immutable.fromJS([]));
	},
	render:function() {
		const	self				= this,
				binding				= self.getDefaultBinding(),
				bindingForm			= self.getDefaultBinding().sub('formGrantRole'),
				errorAddChild 		= binding.get('errorAddChild'),
				isParent			= Boolean(bindingForm.meta('preset.value').toJS() === 'parent' && bindingForm.meta('schoolId.value').toJS()),
				isCoachOrTeacher 	= Boolean((bindingForm.meta('preset.value').toJS() === 'coach' || bindingForm.meta('preset.value').toJS() === 'teacher')
					&& bindingForm.meta('schoolId.value').toJS());

		return (
			<Form	name				= "New Permission"
					updateBinding		= { true }
					binding				= { bindingForm }
					onSubmit			= { self.continueButtonClick }
					onCancel			= { this.props.handleClickCancel }
					hideCancelButton	= { false}
					formStyleClass		= "mZeroPadding"
					defaultButton		= "Submit"
			>
				<FormField	type			= "autocomplete"
							field			= "schoolId"
							onSelect		= { this.handleSelectSchool }
							serviceFullData	= { this.getSchoolService() }
				>
					School
				</FormField>
				<FormField	type		= "select"
				            key         = { typeof this.selectedSchool === 'undefined' ? 'withoutSchool' : this.selectedSchool.id }
							field		= "preset"
							sourceArray	= { this.getRoleList() }
						    onSelect    = { this.onSelectRole }
				>
					Role
				</FormField>
				{ isCoachOrTeacher ?
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
				<FormField	type			= "autocomplete"
							field			= "studentId"
							serverField		= "fullName"
							serviceFullData	= { self.getStudents }
							isDisabled		= { !isParent }
				>
					Student
				</FormField>
				<FormField	type		= "textarea"
							field		= "comment"
							validation	= "alphanumeric"
				>
					Comment
				</FormField>
			</Form>
		);
	}
});

module.exports = GrantRole;