/**
 * Created by Anatoly on 21.04.2016.
 */

const	React		= require('react'),
		Morearty	= require('morearty'),
		Immutable	= require('immutable'),

		Form		= require('module/ui/form/form'),
		FormField 	= require('module/ui/form/form_field'),
		classNames	= require('classnames'),
		roleList	= require('module/data/roles_data');

const AddPermissionRequest = React.createClass({
	mixins:[Morearty.Mixin],
	propTypes: {
		onSuccess:	React.PropTypes.func,
		onCancel: 	React.PropTypes.func
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
		// user roles for active school
		const currentRoles = this.getMoreartyContext().getBinding().toJS('userData.roleList.permissions')
			.filter(p => p.schoolId === this.getSchoolSelectedId())
			.map(p => p.role.toLowerCase());
		// if user also have role in this school, we must cut this role from role list
		// but this restriction don't act on parent
		const hasUserCurrentRole = function(currentRole) {
			if (currentRole !== 'parent') {
				return currentRoles.find(role => role === currentRole);
			} else {
				return undefined;
			}
		};

		return roleList.filter(role => !hasUserCurrentRole(role.id));
	},
	render: function() {
		const 	binding		= this.getDefaultBinding(),
				getSchools	= window.Server.publicSchools.filter,
				isParent	= binding.meta('preset.value').toJS() === 'parent' && binding.meta('schoolId.value').toJS();

		return (
			<Form   name			= "New Request"
					updateBinding	= { true }
					binding			= { binding }
					onSubmit		= { this.continueButtonClick }
					onCancel		= { this.props.onCancel }
					formStyleClass	= "bGrantContainer"
					defaultButton	= "Submit"
			>
				<FormField type				= "autocomplete"
						field				= "schoolId"
						serviceFullData		= {getSchools}
						placeholder 		= {'Please select school'}
						validation			= "required"
				>
					School
				</FormField>

				<FormField type			= "select"
						   field		= "preset"
						   sourceArray	= {this.getRoles()}
						   placeHolder	= {this.getPlaceHolderForRoleSelect()}
						   isDisabled	= {this.isRoleSelectDisabled()}
				>
					Role
				</FormField>
				<FormField type				= "text"
						   field			= "studentName"
						   fieldClassName	= {classNames({mHidden:!isParent})}
				>
					Student
				</FormField>
				<FormField type		= "textarea"
						   field	= "comment"
				>
					Comment
				</FormField>
			</Form>
		);
	}
});

module.exports = AddPermissionRequest;