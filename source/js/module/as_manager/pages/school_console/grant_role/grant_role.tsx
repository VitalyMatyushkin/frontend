import * as React 		from 'react'
import * as Morearty 	from 'morearty'
import * as Immutable 	from 'immutable'

import * as Form            from 'module/ui/form/form'
import * as FormField       from 'module/ui/form/form_field'
import * as roleList        from 'module/data/roles_data'
import * as ErrorAddRole    from 'module/data/text_add_role_error'
import * as SportManager    from 'module/shared_pages/settings/account/helpers/sport-manager'
import {ServiceList} from "module/core/service_list/service_list";

export const GrantRole = (React as any).createClass({
	mixins:[Morearty.Mixin],
	componentWillMount() {
		const ids = this.props.userIdsBinding.toJS();

		this.initCountSportFieldsBlocks();
		this.getDefaultBinding().set('errorAddChild', false);
		if(!ids) {
			console.error('Error! "userIdsBinding" is not set.');
		}
	},
	componentWillUnmount() {
		this.getDefaultBinding().sub('formGrantRole').clear();
	},
	getStudents(name) {
		const 	rootBinding 	= this.getMoreartyContext().getBinding(),
				formId			= this.getDefaultBinding().sub('formGrantRole').meta('formId.value').toJS(),
				houseId			= this.getDefaultBinding().sub('formGrantRole').meta('houseId.value').toJS(),
				activeSchoolId 	= rootBinding.get('userRules.activeSchoolId'),
				filter = {
					limit: 100,
					where: {
						formId: {
							$in: formId
						},
						houseId: undefined,
						$or: [
							{
								firstName: {
									like: name,
									options: 'i'
								}
							},
							{
								lastName: {
									like: name,
									options: 'i'
								}
							}
						]
					}
				};
		if (typeof houseId !== 'undefined') {
			filter.where.houseId = {
				$in: houseId
			};
		}
		// return window.Server.schoolStudents.filter(activeSchoolId, filter);
		return window.Server.schoolStudents.get(
				{ schoolId: activeSchoolId},
				{ filter: filter }
			).then( students => {
				students.forEach(student => {
					student.fullName = student.firstName + " " + student.lastName;
				});

				return students;
			});
	},
	continueButtonClick(model) {
		const 	rootBinding 	= this.getMoreartyContext().getBinding(),
				activeSchoolId 	= rootBinding.get('userRules.activeSchoolId'),
				studentId 		= this.getDefaultBinding().sub('formGrantRole').meta('studentId.value').toJS(),
				sports			= this.getDefaultBinding().toJS('rivals');

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
							schoolId: 	activeSchoolId,
							studentId: 	studentId
						};
						break;
					case 'coach':
					case 'teacher':
						body = {
							preset:     model.preset.toUpperCase(),
							schoolId:   activeSchoolId,
							sportIds:	sports.map(r => r.id)
						};
						break;
					default:
						body = {
							//without uppercase don't work
							preset: 	model.preset.toUpperCase(),
							schoolId: 	activeSchoolId
						};
						break;
				}

				if((model.preset === 'parent' && typeof studentId !== 'undefined') || model.preset !== 'parent') {
					(window.Server as ServiceList).schoolUserPermissions
						.post(
							{schoolId:activeSchoolId, userId:currentId},
							body
						)
						.then(result => {
							console.log(result);

							this.props.onSuccess && this.props.onSuccess(result);
						})
						.catch((e) => {
							if (e.xhr.status === 404) {
								this.getDefaultBinding().set('errorAddChild', true);
							}
						});
				}
			}


		});
	},
	getFormFieldClasses(isParent) {
		if (isParent ) {
			return (
				<FormField
					type			= "autocomplete"
					field			= "formId"
					serviceFullData	= { this.getForms }
				>
					Form
				</FormField>
			)
		} else {
			return (
				<div></div>
			)
		}
	},
	getFormFieldHouses(isParent) {
		if (isParent ) {
			return (
				<FormField
					type			= "autocomplete"
					field			= "houseId"
					serviceFullData	= { this.getHouses }
				>
					House
				</FormField>
			)
		} else {
			return (
				<div></div>
			)
		}
	},
	getFormFieldStudent(isParent, currentForm) {
		if (isParent && typeof currentForm !== 'undefined') {
			return (
				<FormField
					type			= "autocomplete"
					field			= "studentId"
					serverField		= "fullName"
					serviceFullData	= { this.getStudents }
				>
					Student
				</FormField>
			)
		} else {
			return (
				<div></div>
			)
		}
	},
	getForms(formName) {
		const 	schoolId 	= this.getMoreartyContext().getBinding().toJS('userRules.activeSchoolId');

		return window.Server.schoolForms.get(schoolId, {
			filter: {
				where: {
					name: {
						like: formName,
						options:'i'
					}
				}
			}
		});
	},
	getHouses(houseName) {
		const 	schoolId 	= this.getMoreartyContext().getBinding().toJS('userRules.activeSchoolId');

		return window.Server.schoolHouses.get(schoolId, {
			filter: {
				where: {
					name: {
						like: houseName,
						options:'i'
					}
				}
			}
		});
	},
	getRoles() {
		const	activeSchoolId		= this.getMoreartyContext().getBinding().toJS('userRules.activeSchoolId'),
				fullSchoolData		= this.props.activeSchoolInfo,
				availableRoles		= fullSchoolData.allowedPermissionPresets,
				currentPermissions 	= this.props.userPermissionsBinding.toJS();

		let currentRoles = [];

		const roleListForSchool = roleList.filter(role => availableRoles[role.id.toUpperCase()]);

		// user roles for active school
		if (Array.isArray(currentPermissions)) {
			currentRoles = currentPermissions
				.filter(p => p.schoolId === activeSchoolId && p.status === 'ACTIVE')
				.map(p => p.preset.toLowerCase());
		}

		// if user also have role in this school, we must cut this role from role list
		// but this restriction don't act on parent
		const hasUserCurrentRole = currentRole => {
			if (currentRole !== 'parent') {
				return currentRoles.find(role => role === currentRole);
			}
		};

		//if in school disabled registration student, we must cut role 'student' from role list
		return roleListForSchool.filter(role => {
			if (fullSchoolData && fullSchoolData.studentSelfRegistrationEnabled === false && role.id === 'student') {
				return false;
			} else {
				return !hasUserCurrentRole(role.id);
			}
		});
	},
	initCountSportFieldsBlocks() {
		const binding = this.getDefaultBinding();

		const countSportFields = binding.toJS('countSportFields');

		if(typeof countSportFields === 'undefined' || countSportFields < 0) {
			binding.set('countSportFields', 0);
		}
		binding.set('rivals', Immutable.fromJS([]));
	},
	renderAddChildError() {
		// IMPORTANT! Form component must not be a null
		let addChildError = <span/>;

		const binding = this.getDefaultBinding();
		const errorAddChild = binding.get('errorAddChild');

		if(errorAddChild) {
			addChildError = <span className="verify_error">{ ErrorAddRole.addChild }</span>;
		}

		return addChildError;
	},
	renderSportField() {
		// IMPORTANT! Form component must not be a null
		let sportField = <div/>;

		const binding = this.getDefaultBinding();
		const bindingForm = this.getDefaultBinding().sub('formGrantRole');
		const isCoachOrTeacher = bindingForm.meta('preset.value').toJS() === 'coach' ||
			bindingForm.meta('preset.value').toJS() === 'teacher';

		if(isCoachOrTeacher) {
			 sportField = (
				 <div className="eForm_field">
					 <div className="eForm_fieldName">Sports</div>
					 <SportManager
						 binding={binding}
						 schoolId={this.getMoreartyContext().getBinding().get('userRules.activeSchoolId')}
						 serviceName="sports"
						 extraCssStyle="mInline mRightMargin mWidth250"
					 />
				 </div>
			 );
		}

		return sportField;
	},
	render() {
		const 	bindingForm = this.getDefaultBinding().sub('formGrantRole'),
				isParent    = bindingForm.meta('preset.value').toJS() === 'parent',
				currentForm = bindingForm.meta('formId.value').toJS();

		return (
			<Form
				name			= "New Permission"
				updateBinding	= { true }
				onCancel 		= { this.props.handleClickCancel }
				binding			= { bindingForm }
				onSubmit		= { this.continueButtonClick }
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
				{ this.renderSportField() }
				{ this.getFormFieldClasses(isParent) }
				{ this.getFormFieldHouses(isParent) }
				{ this.renderAddChildError() }
				{ this.getFormFieldStudent(isParent, currentForm) }
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