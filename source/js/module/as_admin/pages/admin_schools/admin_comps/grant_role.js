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
		SchoolUnionRoleList	= require('module/data/school_union_role_list'),
		SportManager		= require('module/shared_pages/settings/account/helpers/sport-manager');

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
		this.initCountSportFieldsBlocks();
		if(!ids)
			console.error('Error! "userIdsBinding" is not set.');
	},
	componentWillUnmount:function(){
		this.getDefaultBinding().clear();
	},
	getStudents:function(filter){
		const   self        = this,
			binding     = self.getDefaultBinding().sub('formGrantRole'),
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
				window.Server.userPermissions.post(currentId, body)
					.then(result => this.props.onSuccess && this.props.onSuccess(result));
			}
		});
	},
	handleSelectSchool: function(schoolId, schoolData) {
		this.selectedSchool = schoolData;
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
							isDisabled	= { typeof this.selectedSchool === 'undefined' }
							field		= "preset"
							sourceArray	= { this.getRoleList() }
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