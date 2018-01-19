import * as React from 'react';
import * as Morearty from 'morearty';
import * as Immutable from 'immutable';
import {RegisterTypeStep} from '../register_type_step';
import {TYPE_REGISTER} from '../register_type_step';
import {SchoolStep} from '../school_step';
import {SocialNetworkStep} from '../social_network_step';
import {SOCIAL_NETWORK_TYPE} from '../social_network_step';
import {VerificationStep} from '../verification_step';
import {FinishStep} from '../finish_step';
import {SportsStarsTeamStep} from '../sports_stars_team_step';
import {AccountForm} from '../account_step';
import {School} from 'module/ui/autocomplete2/custom_list_items/school_list_item/school_list_item.tsx';

interface AccountData {
	createdAt:		  string
	email:			  string
	firstName:		  string
	id:				 string
	lastName:		   string
	notification:	   any
	phone:			  string
	status:			 string
	updatedAt:		  string
	verification:	   any
	webIntroEnabled:	boolean
}

interface SchoolData {
	schoolId: string
}

const STEP_PARENT = {
	SCHOOL: {
		key: 'SCHOOL',
		title: 'Choose a school'
	},
	ACCOUNT: {
		key: 'ACCOUNT',
		title: 'Input personal details and the password'
	},
	VERIFICATION: {
		key: 'VERIFICATION',
		title: 'Confirm email and phone codes'
	},
	SPORTS_STARS_TEAM: {
		key: 'SPORTS_STARS_TEAM',
		title: 'Assign a school with SIT Sports Stars Team'
	},
	SOCIAL: {
		key: 'SOCIAL',
		title: 'Choose the registration option'
	},
	REGISTER_TYPE: {
		key: 'REGISTER_TYPE',
		title: 'Choose register type'
	},
	FINISH: {
		key: 'FINISH',
		title: 'Finish'
	}
};

export const ParentRegister = (React as any).createClass({
	mixins: [Morearty.Mixin],
	getDefaultState: function () {
		return Immutable.Map({
			registerStep: STEP_PARENT.REGISTER_TYPE,
			historyStep: []
		});
	},

	setRegisterType: function (type: string): void {
		const   binding	 = this.getDefaultBinding();

		this.addToHistory();
		binding.set('registerType', type);
		if (type === TYPE_REGISTER.INDIVIDUAL.type) {
			binding.set('registerStep', STEP_PARENT.SPORTS_STARS_TEAM);
		} else {
			binding.set('registerStep', STEP_PARENT.SCHOOL);
		}
	},

	handleChangeSchool: function (data: SchoolData, school: School): void {
		const   binding	 = this.getDefaultBinding();

		binding.sub('schoolField').set(Immutable.fromJS(data));
		binding.set('school', school);
		this.addToHistory();
		if (school.name === 'Great Walstead School') { //if school allows registration via social networks (no field yet)
			binding.set('registerStep', STEP_PARENT.SOCIAL);
		} else {
			binding.set('registerStep', STEP_PARENT.ACCOUNT);
		}
	},

	setAccountData: function (data: AccountData): void {
		this.addToHistory();
		this.getDefaultBinding().sub('accountFields').set(Immutable.fromJS(data));
		this.getDefaultBinding().set('registerStep', STEP_PARENT.VERIFICATION);
	},

	handleClickSocialButton: function (type: string): void {
		this.addToHistory();
		switch (type) {
			case SOCIAL_NETWORK_TYPE.SQUADINTOUCH:
				this.getDefaultBinding().set('registerStep', STEP_PARENT.ACCOUNT);
				break;
			case SOCIAL_NETWORK_TYPE.FACEBOOK:
				this.getDefaultBinding().set('registerStep', STEP_PARENT.FINISH);
				break;
			case SOCIAL_NETWORK_TYPE.GOOGLE:
				this.getDefaultBinding().set('registerStep', STEP_PARENT.FINISH);
				break;
		}
	},

	renderTitle: function (): React.ReactNode {
		const   binding	 = this.getDefaultBinding(),
				currentStep = binding.get('registerStep');

		return <div className="bRegistrationTitleNew">{currentStep.title}</div>
	},

	setSportsStarsTeam: function (): void {
		this.addToHistory();
		this.getDefaultBinding().set('registerStep',  STEP_PARENT.SOCIAL);
	},

	setFinishRegisterStep: function (): void {
		this.addToHistory();
		this.getDefaultBinding().set('registerStep',  STEP_PARENT.FINISH);
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

	render: function()  {
		const   binding	 = this.getDefaultBinding(),
				currentStep = binding.get('registerStep');

		let currentView = null;

		switch (currentStep.key) {
			case STEP_PARENT.REGISTER_TYPE.key:
				currentView = (
					<RegisterTypeStep
						defaultType     = {binding.get('registerType')}
						mode            = "parent"
						setRegisterType = {this.setRegisterType}
						handleClickBack = {this.handleClickBack}
					/>
				);
				break;
			case STEP_PARENT.SCHOOL.key:
				currentView = (
					<SchoolStep
						binding             = {binding.sub('schoolField')}
						defaultSchool       = {binding.toJS('school')}
						handleChangeSchool  = {this.handleChangeSchool}
						handleClickBack     = {this.handleClickBack}
					/>
				);
				break;
			case STEP_PARENT.SPORTS_STARS_TEAM.key:
				currentView = (
					<SportsStarsTeamStep setSportsStarsTeam={this.setSportsStarsTeam} handleClickBack = {this.handleClickBack}/>
				);
				break;
			case STEP_PARENT.SOCIAL.key:
				currentView = (
					<SocialNetworkStep handleClickSocialButton={this.handleClickSocialButton} handleClickBack = {this.handleClickBack}/>
				);
				break;
			case STEP_PARENT.ACCOUNT.key:
				currentView = (
					<AccountForm
						binding	        = {binding.sub('accountFields')}
						onSubmit	    = {this.setAccountData}
						handleClickBack = {this.handleClickBack}
					/>
				);
				break;
			case  STEP_PARENT.VERIFICATION.key:
				currentView = (
					<VerificationStep binding={binding} setStep={this.setFinishRegisterStep} handleClickBack = {this.handleClickBack}/>
				);
				break;
			case STEP_PARENT.FINISH.key:
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