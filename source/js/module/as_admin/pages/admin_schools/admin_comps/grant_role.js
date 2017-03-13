/**
 * Created by Anatoly on 09.03.2016.
 */

const	Form				= require('../../../../ui/form/form'),
		FormField			= require('../../../../ui/form/form_field'),
		React				= require('react'),
		Morearty			= require('morearty'),
		Immutable			= require('immutable'),
		classNames			= require('classnames'),
		RoleList			= require('module/data/roles_data'),
		SchoolUnionRoleList	= require('module/data/school_union_role_list');

const GrantRole = React.createClass({
	mixins:[Morearty.Mixin],
	propTypes: {
		userIdsBinding		: React.PropTypes.object,
		onSuccess			: React.PropTypes.func,
		handleClickCancel	: React.PropTypes.func
	},
	componentWillMount:function(){
		const   self    = this,
				ids     = self.props.userIdsBinding.toJS();

		this.selectedSchool = undefined;

		if(!ids)
			console.error('Error! "userIdsBinding" is not set.');
	},
	componentWillUnmount:function(){
		this.getDefaultBinding().clear();
	},
	getStudents:function(filter){
		const   self        = this,
			binding     = self.getDefaultBinding(),
			schoolId    = binding.meta('schoolId.value').toJS();

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
	continueButtonClick:function(model){
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
				default:
					body = {
						preset:     model.preset.toUpperCase(),
						schoolId:   model.schoolId
					};
					break;
			}

			if((model.preset === 'parent' && typeof model.studentId !== 'undefined') || model.preset !== 'parent') {
				window.Server.userPermissions.post(currentId, body)
					.then(result => this.props.onSuccess && this.props.onSuccess(result));
			}
		});
	},
	handleSelectSchool: function(schoolId, schoolData) {
		this.selectedSchool = schoolData;
	},
	render:function() {
		const	self		= this,
				binding		= self.getDefaultBinding(),
				isParent	= Boolean(binding.meta('preset.value').toJS() === 'parent' && binding.meta('schoolId.value').toJS());

		return (
			<Form	name				= "New Permission"
					updateBinding		= { true }
					binding				= { binding }
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
							isDisabled	= { typeof this.selectedSchool === 'undefined' }
							field		= "preset"
							sourceArray	= { this.getRoleList() }
				>
					Role
				</FormField>
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