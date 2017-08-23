/**
 * Created by vitaly on 22.08.17.
 */
const   React           	= require('react'),
		Immutable      	 	= require('immutable'),
		Morearty        	= require('morearty'),
		Form 		    	= require('module/ui/form/form'),
		FormField 	    	= require('module/ui/form/form_field'),
		RoleList			= require('module/data/roles_data'),
		SchoolUnionRoleList	= require('module/data/school_union_role_list'),
		RoleHelper			= require('module/helpers/role_helper'),
		SportManager		= require('module/shared_pages/settings/account/helpers/sport-manager');

const AddRole = React.createClass({
	mixins:[Morearty.Mixin],
	propTypes: {
		onCancel: React.PropTypes.func.isRequired
	},
	componentWillMount: function(){
		this.initCountSportFieldsBlocks();
		this.selectedSchool = undefined;
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
				});
		}
	},
	getStudents:function(filter){
		const   formBinding = this.getDefaultBinding().sub('formAddRole'),
				schoolId    = formBinding.meta('schoolId.value').toJS();

		return window.Server.schoolStudents.filter(schoolId, filter);
	},
	getRoleList: function() {
		switch (true) {
			case typeof this.selectedSchool === 'undefined':
				return [];
			case this.selectedSchool.kind === "School":
				return RoleList;
			case this.selectedSchool.kind === "SchoolUnion":
				return SchoolUnionRoleList;
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
		const 	binding 	= this.getDefaultBinding(),
				formBinding = binding.sub('formAddRole'),
				isParent	= Boolean(formBinding.meta('preset.value').toJS() === 'parent' && formBinding.meta('schoolId.value').toJS());
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
						type		= "select"
						isDisabled	= { typeof this.selectedSchool === 'undefined' }
						field		= "preset"
						sourceArray	= { this.getRoleList() }
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