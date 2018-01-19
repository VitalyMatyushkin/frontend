import * as React from 'react';
import * as Morearty from 'morearty';
import * as Immutable from 'immutable';
import {StaffSchoolStep} from './staff_school_step';
import {MemberSchoolStep} from './member_school_step';
import {VerificationStep} from '../verification_step';
import {TermsAndConditionsStep} from './terms_and_conditions_step';
import {FinishStep} from '../finish_step';
import {AccountForm} from '../account_step';
import {School} from 'module/ui/autocomplete2/custom_list_items/school_list_item/school_list_item.tsx';

interface SchoolAndRoleData {
	schoolId:   string
	preset:     string
	ownerId:    string
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
		title: 'Choose a school. Choose a role'
	},
	ACCOUNT: {
		key: 'ACCOUNT',
		title: 'Input personal details and the password'
	},
	VERIFICATION: {
		key: 'VERIFICATION',
		title: 'Confirm email and phone codes'
	},
	MEMBER_OF_SCHOOL: {
		key: 'MEMBER_OF_SCHOOL',
		title: 'The first member of school PE staff'
	},
	TERMS_AND_CONDITIONS: {
		key: 'TERMS_AND_CONDITIONS',
		title: 'Terms and conditions'
	},
	FINISH: {
		key: 'FINISH',
		title: 'Finish'
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

	handleChangeSchoolAndRole: function (data: SchoolAndRoleData, school: School): void {
		const   binding     = this.getDefaultBinding();

		binding.sub('schoolFields').set(Immutable.fromJS(data));
		binding.set('school', school);
		this.addToHistory();
		binding.set('registerStep', STEP_STAFF.ACCOUNT);

	},

	setAccountData: function (data: AccountData): void {
		const   binding     = this.getDefaultBinding();

		this.addToHistory();
		binding.sub('accountFields').set(Immutable.fromJS(data));
		binding.set('registerStep', STEP_STAFF.VERIFICATION);
	},

	renderTitle: function (): React.ReactNode {
		const   binding     = this.getDefaultBinding(),
				currentStep = binding.get('registerStep');

		return <div className="bRegistrationTitleNew">{currentStep.title}</div>
	},

	checkMemberAndSetNextStep: function(): void{
		const   binding = this.getDefaultBinding(),
				school  = binding.toJS('school');

		this.addToHistory();
		if (school.name === 'Great Walstead School') { //The first member of school PE staff? check from server
			binding.set('registerStep', STEP_STAFF.MEMBER_OF_SCHOOL);
		} else {
			binding.set('registerStep', STEP_STAFF.FINISH);
		}
	},

	setSubscriptionOption: function (type: string): void {
		const   binding     = this.getDefaultBinding();

		this.addToHistory();
		binding.set('subscriptionOption', type);
		binding.set('registerStep', STEP_STAFF.TERMS_AND_CONDITIONS);
	},

	handleTermsAndConditions: function (): void {
		const   binding     = this.getDefaultBinding();

		this.addToHistory();
		binding.set('registerStep', STEP_STAFF.FINISH);
	},

	addToHistory: function (): void {
		const   binding     = this.getDefaultBinding(),
				currentStep = binding.get('registerStep'),
				historyStep = binding.toJS('historyStep');

		historyStep.push(currentStep);
		console.log(binding.toJS());
		binding.set('historyStep', historyStep);
	},

	handleClickBack: function (): void {
		const   binding     = this.getDefaultBinding(),
				historyStep = binding.toJS('historyStep');

		if (historyStep.length === 0) {
			window.location.reload();
		} else {
			console.log(binding.toJS());
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
					<StaffSchoolStep
						binding                     = {binding.sub('schoolFields')}
						defaultSchool               = {binding.toJS('school')}
						handleChangeSchoolAndRole   = {this.handleChangeSchoolAndRole}
						handleClickBack             = {this.handleClickBack}
					/>
				);
				break;
			case STEP_STAFF.ACCOUNT.key:
				currentView = (
					<AccountForm
					    binding         = {binding.sub('accountFields')}
					    onSubmit        = {this.setAccountData}
					    handleClickBack = {this.handleClickBack}
					/>
				);
				break;
			case STEP_STAFF.VERIFICATION.key:
				currentView = (
					<VerificationStep
						binding         = {binding.sub('verification')}
						setStep         = {this.checkMemberAndSetNextStep}
						handleClickBack = {this.handleClickBack}
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
			case STEP_STAFF.FINISH.key:
				currentView = (
					<FinishStep/>
				);
				break;
		}

		return (
			<div className="bRegistration bRegistrationNew">
				{this.renderTitle()}
				{currentView}
			</div>
		);
	}
});