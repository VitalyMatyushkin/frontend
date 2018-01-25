import * as React from 'react';
import * as Morearty from 'morearty';
import * as Immutable from 'immutable';
import {SchoolStep} from '../school_step';
import {StaffRoleStep} from './staff_role_step';
import {MemberSchoolStep} from './member_school_step';
import {TermsAndConditionsStep} from './terms_and_conditions_step';
import {School} from 'module/ui/autocomplete2/custom_list_items/school_list_item/school_list_item.tsx';

interface SchoolData {
	schoolId: string
	ownerId: string
}

interface AccountData {
	createdAt:          string
	email:              string
	firstName:          string
	id:                 string
	lastName:           string
	notification:       any
	phone:              string
	status:             string
	updatedAt:          string
	verification:       any
	webIntroEnabled:    boolean
}

const STEP_STAFF = {
	SCHOOL: {
		key: 'SCHOOL',
		title: 'Choose a school.'
	},
	MEMBER_OF_SCHOOL: {
		key: 'MEMBER_OF_SCHOOL',
		title: 'The first member of school PE staff'
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

export const StaffRegister = (React as any).createClass({
	mixins: [Morearty.Mixin],
	getDefaultState: function () {
		return Immutable.Map({
			registerStep: STEP_STAFF.SCHOOL,
			historyStep: []
		});
	},

	handleChangeSchool: function (data: SchoolData, school: School): void {
		const   binding     = this.getDefaultBinding();

		binding.sub('schoolFields').set(Immutable.fromJS(data));
		binding.set('school', school);
		this.addToHistory();
		if (school.name === 'Great Walstead School') { //The first member of school PE staff? check from server
			binding.set('registerStep', STEP_STAFF.MEMBER_OF_SCHOOL);
		} else {
			binding.set('registerStep', STEP_STAFF.STAFF_ROLE_STEP);
		}
	},

	renderTitle: function (): React.ReactNode {
		const   binding     = this.getDefaultBinding(),
				currentStep = binding.get('registerStep');

		return currentStep.title !== '' ? <div className="bRegistrationTitlePermissionsStep">{currentStep.title}</div> : null;
	},

	setRole: function (role: string): void {
		if (role !== '') {
			const binding = this.getDefaultBinding();
			this.addToHistory();
			binding.set('role', role);
			this.props.goToFinishStep();
		}
	},

	setSubscriptionOption: function (type: string): void {
		if (type !== '') {
			const binding = this.getDefaultBinding();

			this.addToHistory();
			binding.set('subscriptionOption', type);
			binding.set('registerStep', STEP_STAFF.TERMS_AND_CONDITIONS);
		}
	},

	handleTermsAndConditions: function (): void {
		this.addToHistory();
		this.props.goToFinishStep();
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
				currentView = (
					<StaffRoleStep
						defaultRole     = {binding.toJS('role')}
						schoolName      = {binding.toJS('school').name}
						handleClickBack = {this.handleClickBack}
						setRole         = {this.setRole}
					/>
				);
				break;
		}

		return (
			<div className="bRegistrationPermissionsStep">
				{this.renderTitle()}
				{currentView}
			</div>
		);
	}
});