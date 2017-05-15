/**
 * Created by Anatoly on 21.04.2016.
 */

const	React				= require('react'),
		Morearty			= require('morearty'),
		Immutable			= require('immutable');

const	Form				= require('module/ui/form/form'),
		FormField 			= require('module/ui/form/form_field'),
		SchoolListItem		= require('../../../ui/autocomplete2/custom_list_items/school_list_item/school_list_item'),
		roleList			= require('module/data/roles_data'),
		PostcodeSelector	= require('../../../ui/postcode_selector/postcode_selector'),
		GeoSearchHelper		= require('../../../helpers/geo_search_helper');

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
			postcode:	undefined
		});
	},
	componentWillUnmount:function(){
		this.getDefaultBinding().clear();
	},
	continueButtonClick:function(model){
		model.preset = model.preset.toUpperCase();
		if(model.studentName)
			model.comment = `Request to be parent of [ ${model.studentName} ] \r\n` + model.comment;

		window.Server.profileRequests.post(model)
			.then(result => {
				return this.props.onSuccess && this.props.onSuccess(result);
			});
	},
	isSchoolSelected: function() {
		const formBinding = this.getDefaultBinding().sub('form');

		return typeof formBinding.meta().toJS('schoolId.value') !== 'undefined' &&
			formBinding.meta().toJS('schoolId.value') !== '';
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
	getRoles: function() {
		const	formBinding		= this.getDefaultBinding().sub('form'),
				fullSchoolData	= formBinding.meta('schoolId.fullValue').toJS();
		
		// user roles for active school
		const currentRoles = this.getMoreartyContext().getBinding().toJS('userData.roleList.permissions')
			.filter(p => p.schoolId === this.getSchoolSelectedId())
			.map(p => p.role.toLowerCase());
		
		// if user also have role in this school, we must cut this role from role list
		// but this restriction don't act on parent
		const hasUserCurrentRole = currentRole => {
			if (currentRole !== 'parent') {
				return currentRoles.find(role => role === currentRole);
			}
		};
		// for school union we leave only admin role
		if (fullSchoolData && fullSchoolData.kind === 'SchoolUnion') {
			return roleList.filter(role => !hasUserCurrentRole(role.id) && role.id === 'admin');
		}
		
		//if in school disabled registration student, we must cut role 'student' from role list
		return roleList.filter(role => {
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
					availableForRegistration: { $ne: false }
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
				isParent	= formBinding.meta('preset.value').toJS() === 'parent' && formBinding.meta('schoolId.value').toJS();

		return (
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
					<PostcodeSelector	currentPostcode			= {binding.toJS('postcode')}
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
				<FormField
					type		= "select"
					field		= "preset"
					sourceArray	= { this.getRoles() }
					placeHolder	= { this.getPlaceHolderForRoleSelect() }
					isDisabled	= { this.isRoleSelectDisabled() }
				>
					Role
				</FormField>
				<FormField
					type		= "text"
					field		= "studentName"
					isDisabled	= { !isParent }
				>
					Student
				</FormField>
				<FormField
					type	= "textarea"
					field	= "comment"
				>
					Comment
				</FormField>
			</Form>
		);
	}
});

module.exports = AddPermissionRequest;