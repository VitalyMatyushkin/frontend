import * as React from 'react';
import * as Morearty from 'morearty';
import * as Immutable from 'immutable';
import {RegisterTypeStep} from '../register_type_step';
import {TYPE_REGISTER} from '../register_type_step';
import {SchoolStep} from '../school_step';
import {SportsStarsTeamStep} from '../sports_stars_team_step';
import {School} from 'module/ui/autocomplete2/custom_list_items/school_list_item/school_list_item';

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

const STEP_STUDENT = {
	SCHOOL: {
		key: 'SCHOOL',
		title: 'Choose a school'
	},
	SPORTS_STARS_TEAM: {
		key: 'SPORTS_STARS_TEAM',
		title: 'Assign a school with SIT Sports Stars Team'
	},
	REGISTER_TYPE: {
		key: 'REGISTER_TYPE',
		title: 'Choose register type'
	}
};

interface SchoolData {
	schoolId: string
	ownerId: string
}

export const StudentRegister = (React as any).createClass({
	mixins: [Morearty.Mixin],
	getDefaultState: function () {
		return Immutable.Map({
			registerStep: STEP_STUDENT.REGISTER_TYPE,
			historyStep: []
		});
	},

	setRegisterType: function (type: string): void {
		if (type !== '') {
			const binding = this.getDefaultBinding();

			this.addToHistory();
			binding.set('registerType', type);
			if (type === TYPE_REGISTER.INDIVIDUAL.type) {
				binding.set('registerStep', STEP_STUDENT.SPORTS_STARS_TEAM);
			} else {
				binding.set('registerStep', STEP_STUDENT.SCHOOL);
			}
		}
	},

	handleChangeSchool: function (data: SchoolData, school: School): void {
		const   binding     = this.getDefaultBinding();

		binding.sub('schoolField').set(Immutable.fromJS(data));
		binding.set('school', school);
		this.addToHistory();
		this.props.goToFinishStep();
	},

	renderTitle: function (): React.ReactNode {
		const   binding     = this.getDefaultBinding(),
				currentStep = binding.get('registerStep');

		return <div className="bRegistrationTitlePermissionsStep">{currentStep.title}</div>
	},

	setSportsStarsTeam: function (): void {
		this.addToHistory();
		this.props.goToFinishStep()
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
			case STEP_STUDENT.REGISTER_TYPE.key:
				currentView = (
					<RegisterTypeStep
						defaultType     = {binding.get('registerType')}
						mode            = "student"
						setRegisterType = {this.setRegisterType}
						handleClickBack = {this.handleClickBack}
					/>
				);
				break;
			case STEP_STUDENT.SCHOOL.key:
				currentView = (
					<SchoolStep
						binding             = {binding.sub('schoolField')}
						defaultSchool       = {binding.toJS('school')}
						handleChangeSchool  = {this.handleChangeSchool}
						handleClickBack     = {this.handleClickBack}
					/>
				);
				break;
			case STEP_STUDENT.SPORTS_STARS_TEAM.key:
				currentView = <SportsStarsTeamStep setSportsStarsTeam={this.setSportsStarsTeam} handleClickBack = {this.handleClickBack}/>;
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