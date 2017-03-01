/**
 * Created by Anatoly on 21.04.2016.
 */

const	React		= require('react'),
		Morearty	= require('morearty'),
		Immutable	= require('immutable');

const	Form			= require('module/ui/form/form'),
		FormField 		= require('module/ui/form/form_field'),
		classNames		= require('classnames'),
		If				= require('module/ui/if/if'),
		SchoolListItem	= require('../../../ui/autocomplete2/custom_list_items/school_list_item/school_list_item'),
		roleList		= require('module/data/roles_data');

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
			comment:	''
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
		const binding = this.getDefaultBinding();

		return binding.meta().toJS('schoolId.value') !== '';
	},
	getSchoolSelectedId: function() {
		const binding = this.getDefaultBinding();

		return binding.meta().toJS('schoolId.value');
	},
	getPlaceHolderForRoleSelect: function() {
		return this.isSchoolSelected() ? 'Please select role' : "";
	},
	isRoleSelectDisabled: function() {
		return !this.isSchoolSelected();
	},
	getRoles: function() {
		const 	binding = this.getDefaultBinding(),
				fullSchoolData = binding.meta('schoolId.fullValue').toJS();
		
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
		
		// we filter array of roles, leaving unique to this school (but this restriction don't act on parent)
		roleList.filter(role => {
			return !hasUserCurrentRole(role.id);
		});
		
		//if in school disabled registration student, we must cut role 'student' from role list
		return roleList.filter(role => {
			if (fullSchoolData && fullSchoolData.studentSelfRegistrationEnabled === false && role.id === 'student') {
				return false;
			} else {
				return true;
			}
		});
	},
	getSchoolService: function() {
		const postcode = this.props.activeSchool.postcode;
		
		if(typeof postcode !== 'undefined') {
			return (schoolName) => {
				const point = postcode.point;

				const filter = {
					filter: {
						where: {
							name: {
								like: schoolName,
								options: 'i'
							},
							'postcode.point': {
								$nearSphere: {
									$geometry: {
										type: 'Point',
										coordinates: [point.lng, point.lat] // [longitude, latitude]
									}
								}
							}
						},
						limit: 20
					}
				};

				return window.Server.publicSchools.get(filter);
			};
		} else {
			return (schoolName) => {
				const filter = {
					filter: {
						where: {
							name: {
								like: schoolName,
								options: 'i'
							}
						},
						order:"name ASC",
						limit: 20
					}
				};

				return window.Server.publicSchools.get(filter);
			};
		}
	},
	render: function() {
		const	binding		= this.getDefaultBinding(),
				isParent	= binding.meta('preset.value').toJS() === 'parent' && binding.meta('schoolId.value').toJS();

		return (
			<Form
				name			= "New Request"
				updateBinding	= { true }
				binding			= { binding }
				onSubmit		= { this.continueButtonClick }
				onCancel		= { this.props.onCancel }
				formStyleClass	= "bGrantContainer"
				defaultButton	= "Submit"
			>
				<FormField
					type				= "autocomplete"
					field				= "schoolId"
					serviceFullData		= {this.getSchoolService()}
					customListItem		= {SchoolListItem}
					placeholder 		= {'Please select school'}
					validation			= "required"
				>
					School
				</FormField>

				<FormField
					type		= "select"
					field		= "preset"
					sourceArray	= {this.getRoles()}
					placeHolder	= {this.getPlaceHolderForRoleSelect()}
					isDisabled	= {this.isRoleSelectDisabled()}
				>
					Role
				</FormField>
				<FormField
					type			= "text"
					field			= "studentName"
					fieldClassName	= {classNames({mHidden:!isParent})}
				>
					<If condition={Boolean(isParent)}>
						<span>Student</span>
					</If>
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