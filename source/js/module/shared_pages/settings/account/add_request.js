/**
 * Created by Anatoly on 21.04.2016.
 */

const	React				= require('react'),
		Morearty			= require('morearty'),
		Immutable			= require('immutable');

const	Form				= require('module/ui/form/form'),
		FormField 			= require('module/ui/form/form_field'),
		{SchoolListItem}	= require('../../../ui/autocomplete2/custom_list_items/school_list_item/school_list_item'),
		roleList			= require('module/data/roles_data'),
		PostcodeSelector	= require('../../../ui/postcode_selector/postcode_selector'),
		GeoSearchHelper		= require('../../../helpers/geo_search_helper'),
		RoleHelper			= require('module/helpers/role_helper'),
		SportManager		= require('./helpers/sport-manager'),
		FormBlock			= require('module/ui/form/form_block/form_block'),
		{DateHelper}        = require('module/helpers/date_helper');

const ADDITIONAL_FIELD_CONDITION= {
	HIDDEN:     'HIDDEN',
	OPTIONAL:   'OPTIONAL',
	REQUIRED:   'REQUIRED'
};

const AddPermissionRequest = React.createClass({
	mixins:[Morearty.Mixin],
	propTypes: {
		onSuccess:		React.PropTypes.func,
		onCancel:		React.PropTypes.func,
		activeSchool:	React.PropTypes.object.isRequired
	},
	getDefaultState:function() {
		return Immutable.Map({
			preset:		'',
			schoolId:	'',
			comment:	'',
			form:		{},
			postcode:	undefined,
			rivals: []
		});
	},
	componentWillMount:function(){
		this.initCountSportFieldsBlocks();
	},
	componentWillUnmount:function(){
		this.getDefaultBinding().clear();
	},
	initCountSportFieldsBlocks: function() {
		const binding = this.getDefaultBinding();

		const countSportFields = binding.toJS('countSportFields');

		if(typeof countSportFields === 'undefined' || countSportFields < 0) {
			binding.set('countSportFields', 0);
		}
		binding.set('rivals', Immutable.fromJS([]));
	},
	continueButtonClick:function(model){
		const 	binding 		= this.getDefaultBinding(),
			selectedSchool  = this.getDefaultBinding().sub('form').meta('schoolId.fullValue').toJS();

		model.preset = model.preset.toUpperCase();

		if (model.preset === RoleHelper.USER_PERMISSIONS.PARENT) {
			if (this.showErrors(selectedSchool) === 0) {
				if (model.childDateOfBirth) {
					model.childDateOfBirth = DateHelper.getFormatDateTimeUTCString(model.childDateOfBirth);
				}
				model.comment = `Request to be parent of [${model.studentFirstName} ${model.studentLastName}] ${model.comment ? model.comment : ''}`;

				window.Server.profileRequests.post(model)
					.then(result => {
						return this.props.onSuccess && this.props.onSuccess(result);
					});
			}
		} else {
			if (model.preset === RoleHelper.USER_PERMISSIONS.TEACHER || model.preset === RoleHelper.USER_PERMISSIONS.COACH)
				model.sportIds = binding.toJS('rivals').map(r => r.id);

			window.Server.profileRequests.post(model)
				.then(result => {
					return this.props.onSuccess && this.props.onSuccess(result);
				});
		}
	},
	showErrors: function (school) {
		const   binding = this.getDefaultBinding().sub('form').meta();

		const fieldData = {
			active:	true,
			showError: true,
			value:	''
		};

		let countError = 0;
		if (school.additionalPermissionRequestFields.childDateOfBirth === ADDITIONAL_FIELD_CONDITION.REQUIRED &&
			(typeof binding.toJS(`childDateOfBirth`).value === 'undefined' || binding.toJS(`childGender`).value === ''))
		{
			binding.set(`childDateOfBirth`, Immutable.fromJS(fieldData));
			countError ++;
		}

		if (school.additionalPermissionRequestFields.childFirstName === ADDITIONAL_FIELD_CONDITION.REQUIRED &&
			(typeof binding.toJS(`studentFirstName`).value === 'undefined' || binding.toJS(`studentFirstName`).value === ''))
		{
			binding.set(`studentFirstName`, Immutable.fromJS(fieldData));
			countError ++;
		}

		if (school.additionalPermissionRequestFields.childLastName === ADDITIONAL_FIELD_CONDITION.REQUIRED &&
			(typeof binding.toJS(`studentLastName`).value === 'undefined' || binding.toJS(`studentLastName`).value === ''))
		{
			binding.set(`studentLastName`, Immutable.fromJS(fieldData));
			countError ++;
		}

		if (school.additionalPermissionRequestFields.childGender === ADDITIONAL_FIELD_CONDITION.REQUIRED &&
			(typeof binding.toJS(`childGender`).value === 'undefined' || binding.toJS(`childGender`).value === ''))
		{
			const genderField = binding.toJS(`childGender`);
			genderField.showError = true;
			binding.set(`childGender`, Immutable.fromJS(genderField));
			countError ++;
		}

		if (school.additionalPermissionRequestFields.childForm === ADDITIONAL_FIELD_CONDITION.REQUIRED &&
			(typeof binding.toJS(`childFormId`).value === 'undefined' || binding.toJS(`childFormId`).value === ''))
		{
			binding.set(`childFormId`, Immutable.fromJS(fieldData));
			countError ++;
		}

		if (school.additionalPermissionRequestFields.childHouse === ADDITIONAL_FIELD_CONDITION.REQUIRED &&
			(typeof binding.toJS(`childHouseId`).value === 'undefined' || binding.toJS(`childHouseId`).value === ''))
		{
			binding.set(`childHouseId`, Immutable.fromJS(fieldData));
			countError ++;
		}

		return countError;
	},
	isSchoolSelected: function() {
		const formBinding = this.getDefaultBinding().sub('form');

		return typeof formBinding.meta().toJS('schoolId.value') !== 'undefined' &&
			formBinding.meta().toJS('schoolId.value') !== '';
	},
	isRoleCoachOrTeacherSelected: function() {
		const 	formBinding 	= this.getDefaultBinding().sub('form'),
				selectedRole 	= formBinding.meta().toJS('preset.value');
		return selectedRole === RoleHelper.USER_PERMISSIONS.TEACHER.toLowerCase()
			|| selectedRole === RoleHelper.USER_PERMISSIONS.COACH.toLowerCase();
	},
	getSchoolSelectedId: function() {
		const formBinding = this.getDefaultBinding().sub('form');

		return formBinding.meta().toJS('schoolId.value');
	},
	getPlaceHolderForRoleSelect: function() {
		return this.isSchoolSelected() ? 'Please select role' : "";
	},
	isRoleSelectDisabled: function() {
		return !this.isSchoolSelected();
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

		return gendersArray;
	},

	getClassService: function () {
		const schoolId = this.getDefaultBinding().sub('form').meta('schoolId.value').toJS();
		return (txt) => {
			return window.Server.publicSchoolForms.get(
				{
					schoolId: schoolId,
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
		const schoolId = this.getDefaultBinding().sub('form').meta('schoolId.value').toJS();
		return (txt) => {
			return window.Server.publicSchoolHouses.get(
				{
					schoolId: schoolId,
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
	getRoles: function() {
		const	formBinding			= this.getDefaultBinding().sub('form'),
				fullSchoolData		= formBinding.meta('schoolId.fullValue').toJS(),
				availableRoles      = fullSchoolData ? fullSchoolData.allowedPermissionPresets : {},
				currentPermissions 	= this.getMoreartyContext().getBinding().toJS('userData.roleList.permissions');

		let currentRoles = [];

		const roleListForSchool = roleList.filter(role => availableRoles[role.id.toUpperCase()]);

		// user roles for active school
		if (Array.isArray(currentPermissions)) {
			currentRoles = currentPermissions
				.filter(p => p.schoolId === this.getSchoolSelectedId())
				.map(p => p.role.toLowerCase());
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
			return roleListForSchool.filter(role => !hasUserCurrentRole(role.id) && role.id === 'admin');
		}

		//if in school disabled registration student, we must cut role 'student' from role list
		return roleListForSchool.filter(role => {
			if (fullSchoolData && fullSchoolData.studentSelfRegistrationEnabled === false && role.id === 'student') {
				return false;
			} else {
				return !hasUserCurrentRole(role.id);
			}
		});
	},
	schoolService: function(schoolName) {
		const postcode = this.getDefaultBinding().toJS('postcode');

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
					availableForRegistration: { $ne: false },
					/*
						at least one role should be available
					 */
					$or: [
						{'allowedPermissionPresets.ADMIN':		{ $ne: false }},
						{'allowedPermissionPresets.MANAGER':	{ $ne: false }},
						{'allowedPermissionPresets.TEACHER':	{ $ne: false }},
						{'allowedPermissionPresets.COACH':		{ $ne: false }},
						{'allowedPermissionPresets.STUDENT':	{ $ne: false }},
						{'allowedPermissionPresets.PARENT':		{ $ne: false }}
					]
				},
				limit: 20
			}
		};

		if(typeof postcode !== 'undefined') {
			filter.filter.where['postcode.point'] = GeoSearchHelper.getUnlimitedGeoSchoolFilter(postcode.point);
		} else {
			filter.filter.order = "name ASC";
		}

		return window.Server.publicSchools.get(filter);
	},
	handleSelectPostcode: function(id, postcode) {
		this.getDefaultBinding().set('postcode', postcode);
	},
	handleEscapePostcode: function() {
		this.getDefaultBinding().set('postcode', undefined);
	},
	render: function() {
		const	binding		= this.getDefaultBinding(),
				formBinding	= binding.sub('form'),
				isParent	= 	formBinding.meta('preset.value').toJS() === 'parent'
					&& formBinding.meta('schoolId.value').toJS();

		const selectedSchool = this.getDefaultBinding().sub('form').meta('schoolId.fullValue').toJS();

		return (
			<div>
				<Form
					name			= "New Request"
					updateBinding	= { true }
					binding			= { binding.sub('form') }
					onSubmit		= { this.continueButtonClick }
					onCancel		= { this.props.onCancel }
					formStyleClass	= "bGrantContainer"
					defaultButton	= "Submit"
				>
					<div className="eForm_field">
						<div className="eForm_fieldName">
							Postcode
						</div>
						<PostcodeSelector
							currentPostcode			= {binding.toJS('postcode')}
							handleSelectPostcode	= {this.handleSelectPostcode}
							handleEscapePostcode	= {this.handleEscapePostcode}
							extraCssStyle 			= {'mInline mRightMargin mWidth250'}
						/>
					</div>
					<FormField
						type			= "autocomplete"
						field			= "schoolId"
						serviceFullData	= { this.schoolService }
						customListItem	= { SchoolListItem }
						placeholder 	= { 'Please select school' }
						validation		= "required"
					>
						School
					</FormField>
					< FormField
						type        = "select"
						field        = "preset"
						sourceArray    = {this.getRoles()}
						placeHolder    = {this.getPlaceHolderForRoleSelect()}
						isDisabled    = {this.isRoleSelectDisabled()}
						validation    = "required"
					>
						Role
					</FormField>
					{ this.isRoleCoachOrTeacherSelected() ?
						<div className="eForm_field">
							<div className="eForm_fieldName">
								Sports
							</div>
							<SportManager
								binding			= { binding }
								schoolId		= { this.getSchoolSelectedId() }
								serviceName 	= "publicSchoolSports"
								extraCssStyle	= "mInline mRightMargin mWidth250"
							/>
						</div>
						:
						<div></div>
					}
					<FormBlock
						isVisible			= { isParent }
						isShowCloseButton	= { false }
					>
						<FormField
							type		= "text"
							field		= "studentFirstName"
							isVisible	= { isParent }
						>
							Student first name
						</FormField>
						<FormField
							type		= "text"
							field		= "studentLastName"
							isVisible	= { isParent }
						>
							Student last name
						</FormField>
						<FormField
							type		    = "select"
							field			= {`childGender`}
							sourceArray	    = { this.getGender() }
							isVisible       = { isParent && selectedSchool && selectedSchool.additionalPermissionRequestFields.childGender !== ADDITIONAL_FIELD_CONDITION.HIDDEN }
						>
							Gender
						</FormField>
						<FormField
							type		= 'date'
							field		= {`childDateOfBirth`}
							validation	= {`birthday`}
							isVisible   = { isParent && selectedSchool && selectedSchool.additionalPermissionRequestFields.childDateOfBirth !== ADDITIONAL_FIELD_CONDITION.HIDDEN }
						>
							Date of birth
						</FormField>
						<FormField
							type			= 'autocomplete'
							serviceFullData	= { this.getClassService() }
							field			= {`childFormId`}
							isVisible       = { isParent && selectedSchool && selectedSchool.additionalPermissionRequestFields.childForm !== ADDITIONAL_FIELD_CONDITION.HIDDEN }
						>
							Form
						</FormField>
						<FormField
							type			= 'autocomplete'
							serviceFullData	= { this.getHouseService() }
							field			= {`childHouseId`}
							isVisible       = { isParent && selectedSchool && selectedSchool.additionalPermissionRequestFields.childHouse !== ADDITIONAL_FIELD_CONDITION.HIDDEN }
						>
							House
						</FormField>
					</FormBlock>
					<FormField
						type	= "textarea"
						field	= "comment"
					>
						Comment
					</FormField>
				</Form>
			</div>
		);
	}
});

module.exports = AddPermissionRequest;