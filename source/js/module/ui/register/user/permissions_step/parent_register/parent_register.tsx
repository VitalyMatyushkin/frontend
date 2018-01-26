import * as React from 'react';
import * as Morearty from 'morearty';
import * as Immutable from 'immutable';
import {RegisterTypeStep} from '../register_type_step';
import {TYPE_REGISTER} from '../register_type_step';
import {SchoolStep} from '../school_step';
import {SportsStarsTeamStep} from '../sports_stars_team_step';
import {FinishPermissionsStep} from '../finish_permissions_step';
import {School} from 'module/ui/autocomplete2/custom_list_items/school_list_item/school_list_item.tsx';


interface SchoolData {
	schoolId: string
	ownerId: string
}

const STEP_PARENT = {
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
	},
	FINISH: {
		key: 'FINISH',
		title: 'Selecting permissions is complete'
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
		if (type !== '') {
			const binding = this.getDefaultBinding();

			this.addToHistory();
			binding.set('registerType', type);
			if (type === TYPE_REGISTER.INDIVIDUAL.type) {
				binding.set('registerStep', STEP_PARENT.SPORTS_STARS_TEAM);
				binding.set('school', undefined);
			} else {
				binding.set('registerStep', STEP_PARENT.SCHOOL);
				binding.set('sportsStarsTeam', undefined);
			}
		}
	},

	handleChangeSchool: function (data: SchoolData, school: School): void {
		const   binding	 = this.getDefaultBinding();

		binding.sub('schoolField').set(Immutable.fromJS(data));
		if (typeof school !== "undefined") {
			binding.set('school', school);
		}
		this.addToHistory();
		binding.set('registerStep', STEP_PARENT.FINISH);
	},

	renderTitle: function (): React.ReactNode {
		const   binding	 = this.getDefaultBinding(),
				currentStep = binding.get('registerStep');

		return <div className="bRegistrationTitlePermissionsStep">{currentStep.title}</div>
	},

	setSportsStarsTeam: function (): void {
		const binding = this.getDefaultBinding();
		binding.set('sportsStarsTeam', 'test');
		this.addToHistory();
		binding.set('registerStep', STEP_PARENT.FINISH);
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
			case STEP_PARENT.FINISH.key:
				currentView = (
					<FinishPermissionsStep
						binding             = {binding}
						handleClickBack     = {this.handleClickBack}
						handleClickContinue = {this.props.goToFinishStep}
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