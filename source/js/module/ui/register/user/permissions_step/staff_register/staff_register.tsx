import * as React from 'react';
import * as Morearty from 'morearty';
import * as Immutable from 'immutable';
import {SchoolStep} from '../school_step';
import {StaffRoleStep} from './staff_role_step';
import {STAFF_ROLES} from './staff_role_step';
import {MemberSchoolStep} from './member_school_step';
import {TermsAndConditionsStep} from './terms_and_conditions_step';
import {FinishPermissionsStep} from '../finish_permissions_step';
import {School} from 'module/ui/autocomplete2/custom_list_items/school_list_item/school_list_item.tsx';
import * as propz from 'propz';

interface SchoolData {
	schoolId: string
	ownerId: string
}

const STEP_STAFF = {
	SCHOOL: {
		key: 'SCHOOL',
		title: 'Choose a school.'
	},
	MEMBER_OF_SCHOOL: {
		key: 'MEMBER_OF_SCHOOL',
		title: ''
	},
	TERMS_AND_CONDITIONS: {
		key: 'TERMS_AND_CONDITIONS',
		title: 'Terms and conditions'
	},
	STAFF_ROLE_STEP: {
		key: 'STAFF_ROLE_STEP',
		title: ''
	}
};

const SCHOOL_UNION_AVAILABLE_ROLES = {
	ADMIN:      true,
	MANAGER:    false,
	TEACHER:    false,
	COACH:      false,
	STUDENT:    false,
	PARENT:	    false
};

export const StaffRegister = (React as any).createClass({
	mixins: [Morearty.Mixin],
	getDefaultState: function () {
		return Immutable.Map({
			registerStep: STEP_STAFF.SCHOOL,
			historyStep: []
		});
	},

	componentWillMount: function () {
		this.getDefaultBinding().set('isFinish', false)
	},

	handleChangeSchool: function (data: SchoolData, school: School): void {
		const binding = this.getDefaultBinding();

		if (typeof school !== "undefined") {
			binding.set('school', school);
			binding.sub('schoolField').set('schoolId', data.schoolId);
		}

		if (this.isSchoolWithoutUsers(binding.toJS('school'))) { //The first member of school PE staff? check from server
			this.addToHistory();
			binding.set('registerStep', STEP_STAFF.MEMBER_OF_SCHOOL);
			binding.set('role', undefined);
		} else {
			if (binding.toJS('school').kind === 'SchoolUnion') {
				binding.set('role', STAFF_ROLES.ADMIN.value);
				binding.set('isFinish', true);
			} else {
				this.addToHistory();
				binding.set('registerStep', STEP_STAFF.STAFF_ROLE_STEP);
			}
			binding.set('subscriptionOption', undefined);
		}
	},

	isSchoolWithoutUsers: function (school): boolean {
		const rolesExistence = propz.get(school, ['stats', 'rolesExistence', 'staff'], true);
		return !rolesExistence;
	},

	renderTitle: function (): React.ReactNode {
		const   binding     = this.getDefaultBinding(),
				currentStep = binding.get('registerStep');

		return currentStep.title !== '' ? <div className="bRegistrationTitlePermissionsStep">{currentStep.title}</div> : null;
	},

	setRole: function (role: string): void {
		if (role !== '') {
			const binding = this.getDefaultBinding();
			binding.set('role', role);
			binding.set('isFinish', true);
		}
	},

	setSubscriptionOption: function (type: string): void {
		if (type !== '') {
			const binding = this.getDefaultBinding();

			// this.addToHistory();
			binding.set('role', 'ADMIN');
			binding.set('subscriptionOption', type);
			// binding.set('registerStep', STEP_STAFF.TERMS_AND_CONDITIONS); //until we add conditions
			binding.set('isFinish', true);
		}
	},

	handleTermsAndConditions: function (): void {
		this.getDefaultBinding().set('isFinish', true);
	},

	addToHistory: function (): void {
		const   binding     = this.getDefaultBinding(),
				currentStep = binding.get('registerStep'),
				historyStep = binding.toJS('historyStep');

		historyStep.push(currentStep);
		binding.set('historyStep', historyStep);
	},

	handleClickBack: function (): void {
		const   binding     = this.getDefaultBinding(),
				historyStep = binding.toJS('historyStep');

		if (historyStep.length === 0) {
			this.props.backToUserType();
		} else {
			const currentStep = historyStep.pop();
			binding.set('historyStep', historyStep);
			binding.set('registerStep', currentStep);
		}
	},

	render: function ()  {
		const   binding     = this.getDefaultBinding(),
				currentStep = binding.get('registerStep');

		let currentView = null;

		switch (currentStep.key) {
			case STEP_STAFF.SCHOOL.key:
				currentView = (
					<SchoolStep
						binding             = {binding.sub('schoolField')}
						mode                = {binding.toJS('userType')}
						defaultSchool       = {binding.toJS('school')}
						handleChangeSchool  = {this.handleChangeSchool}
						handleClickBack     = {this.handleClickBack}
					/>
				);
				break;
			case STEP_STAFF.MEMBER_OF_SCHOOL.key:
				currentView = (
					<MemberSchoolStep
						schoolName      = {binding.toJS('school').name}
						defaultOption   = {binding.get('subscriptionOption')}
						setOptions      = {this.setSubscriptionOption}
						handleClickBack = {this.handleClickBack}
					/>
				);
				break;
			case STEP_STAFF.TERMS_AND_CONDITIONS.key:
				currentView = (
					<TermsAndConditionsStep
						handleTermsAndConditions= {this.handleTermsAndConditions}
						handleClickBack         = {this.handleClickBack}
					/>
				);
				break;
			case STEP_STAFF.STAFF_ROLE_STEP.key:
				const allowedPermissionPresets = binding.toJS('school').kind === 'SchoolUnion' ? SCHOOL_UNION_AVAILABLE_ROLES
					: binding.toJS('school').allowedPermissionPresets;
				currentView = (
					<StaffRoleStep
						defaultRole      = {binding.toJS('role')}
						availableRoles   = {allowedPermissionPresets}
						schoolName       = {binding.toJS('school').name}
						handleClickBack  = {this.handleClickBack}
						setRole          = {this.setRole}
					/>
				);
				break;
		}

		return (
			<div className="bRegistrationPermissionsStep">
				{this.renderTitle()}
				{currentView}
				{
					binding.get('isFinish') ?
						<FinishPermissionsStep
							binding             = {binding}
							handleClickBack     = {() => {binding.set('isFinish', false)}}
						/>
						:
						null
				}
			</div>
		);
	}
});