/**
 * Created by Anatoly on 09.03.2016.
 */

const 	Form 		= require('module/ui/form/form'),
		FormField 	= require('module/ui/form/form_field'),
		React 		= require('react'),
		classNames 	= require('classnames'),
		Morearty	= require('morearty'),
		roleList 	= require('module/data/roles_data');

const GrantRole = React.createClass({
	mixins:[Morearty.Mixin],
	propTypes: {
		userIdsBinding: 	React.PropTypes.object,
		onSuccess: 			React.PropTypes.func,
		handleClickCancel: 	React.PropTypes.func
	},
	componentWillMount:function(){
		const 	self 	= this,
				ids 	= self.props.userIdsBinding.toJS();

		if(!ids)
			console.error('Error! "userIdsBinding" is not set.');
	},
	componentWillUnmount:function(){
		this.getDefaultBinding().clear();
	},
	getStudents:function(filter){
		const 	self 			= this,
				rootBinding 	= self.getMoreartyContext().getBinding(),
				activeSchoolId 	= rootBinding.get('userRules.activeSchoolId');

		return window.Server.schoolStudents.filter(activeSchoolId, filter);
	},
	continueButtonClick:function(model){
		const 	rootBinding 	= this.getMoreartyContext().getBinding(),
				activeSchoolId 	= rootBinding.get('userRules.activeSchoolId');

		let ids = this.props.userIdsBinding.toJS();
		ids = ids && typeof ids === 'string' ? [ids] : ids;

		ids.forEach(currentId => {
			if (typeof model.preset !== 'undefined') {
				let body;
				switch(model.preset) {
					case 'parent':
						body = {
							//without uppercase don't work
							preset: 	model.preset.toUpperCase(),
							schoolId: 	model.schoolId,
							studentId: 	model.studentId
						};
						break;
					default:
						body = {
							//without uppercase don't work
							preset: 	model.preset.toUpperCase(),
							schoolId: 	model.schoolId
						};
						break;
				}

				if((model.preset === 'parent' && typeof model.studentId !== 'undefined') || model.preset !== 'parent') {
					window.Server.schoolUserPermissions.post({schoolId:activeSchoolId, userId:currentId}, body)
					.then(result => this.props.onSuccess && this.props.onSuccess(result));
				}
			}


		});
	},
	getFormFieldStudent(isParent){
		if (isParent === true) {
			return (
				<FormField
					type			= "autocomplete"
					field			= "studentId"
					serverField		= "fullName"
					serviceFullData	= { this.getStudents }
					placeholder 	= "required"
				>
					Student
				</FormField>
			)
		} else {
			return (
				<FormField
					type			= "autocomplete"
					field			= "studentId"
					serverField		= "fullName"
					serviceFullData	= { this.getStudents }
					isDisabled		= { true }
					placeholder 	= "available only for parent role"
				>
					Student
				</FormField>
			)
		}
	},
	getRoles: function() {
		const	activeSchoolId		= this.getMoreartyContext().getBinding().toJS('userRules.activeSchoolId'),
				currentPermissions 	= this.getMoreartyContext().getBinding().toJS('userData.roleList.permissions');

		let currentRoles = [];

		// user roles for active school
		if (Array.isArray(currentPermissions)) {
			currentRoles = currentPermissions
				.filter(p => p.schoolId === activeSchoolId)
				.map(p => p.role.toLowerCase());
		}

		// if user also have role in this school, we must cut this role from role list
		// but this restriction don't act on parent
		const hasUserCurrentRole = currentRole => {
			if (currentRole !== 'parent') {
				return currentRoles.find(role => role === currentRole);
			}
		};

		//if in school disabled registration student, we must cut role 'student' from role list
		return roleList.filter(role => {
			if (role.id === 'student') {
				return false;
			} else {
				return !hasUserCurrentRole(role.id);
			}
		});
	},
	render:function(){
		const 	self 		= this,
				binding 	= self.getDefaultBinding(),
				isParent 	= binding.meta('preset.value').toJS() === 'parent';

		return (
			<Form
				name			= "New Permission"
				updateBinding	= { true }
				onCancel 		= { this.props.handleClickCancel }
				binding			= { binding }
				onSubmit		= { self.continueButtonClick }
				formStyleClass	= "bGrantContainer"
				defaultButton	= "Submit"
			>
				<FormField
					type		= "select"
					field		= "preset"
					sourceArray	= { this.getRoles() }
					validation 	= "required"
				>
					Role
				</FormField>
				{this.getFormFieldStudent(isParent)}
				<FormField
					type		= "textarea"
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