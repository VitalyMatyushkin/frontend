import * as React from 'react';
import * as Morearty from 'morearty';
import * as Immutable from 'immutable';
import {RegisterTypeStep} from '../register_type_step';
import {TYPE_REGISTER} from '../register_type_step';
import {SchoolStep} from '../school_step';
import {ChildStep} from '../child_step';
import {FinishPermissionsStep} from '../finish_permissions_step';
import {School} from 'module/ui/autocomplete2/custom_list_items/school_list_item/school_list_item.tsx';
import * as Loader from 'module/ui/loader';

interface SchoolData {
	schoolId: string
	ownerId: string
}

const STEP_PARENT = {
	SCHOOL: {
		key: 'SCHOOL',
		title: 'Choose a school'
	},
	CHILD_STEP: {
		key: 'CHILD_STEP',
		title: 'Enter the child\'s name'
	},
	REGISTER_TYPE: {
		key: 'REGISTER_TYPE',
		title: 'Choose register type'
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

	componentWillMount: function () {
		const binding = this.getDefaultBinding();
		binding.set('isSync', true);
		binding.set('role', 'PARENT');
		binding.set('isFinish', false);
	},

	setRegisterType: function (type: string): void {
		if (type !== '') {
			const binding = this.getDefaultBinding();

			this.addToHistory();
			binding.set('registerType', type);
			if (type === TYPE_REGISTER.INDIVIDUAL.type) {
				this.getSSTSchool();
				binding.set('registerStep', STEP_PARENT.CHILD_STEP);
			} else {
				binding.set('registerStep', STEP_PARENT.SCHOOL);
			}
			binding.set('school', undefined);
		}
	},

	handleChangeSchool: function (data: SchoolData, school: School): void {
		const binding = this.getDefaultBinding();

		binding.sub('schoolField').set(Immutable.fromJS(data));
		if (typeof school !== "undefined") {
			binding.set('school', school);
		}
		this.addToHistory();
		binding.set('registerStep', STEP_PARENT.CHILD_STEP);
	},

	getSSTSchool: function() {
		const   binding     = this.getDefaultBinding(),
				schoolName  = 'Squad In Touch Sports Stars Team';
		binding.set('isSync', false);
		(window as any).Server.publicSchools.get(
			{
				filter: {
					where: {
						name: {
							like: schoolName,
							options: 'i'
						}
					},
					limit: 1
				}
			}
		).then(schools => {
			binding.set('school', schools[0]);
			binding.set('isSync', true);
		})
	},

	renderTitle: function (): React.ReactNode {
		const   binding	 = this.getDefaultBinding(),
				currentStep = binding.get('registerStep');

		return <div className="bRegistrationTitlePermissionsStep">{currentStep.title}</div>
	},

	setChild: function (data): void {
		const binding = this.getDefaultBinding();
		binding.sub('childFields').set(Immutable.fromJS(data));
		binding.set('isFinish', true);
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
						mode                = {binding.toJS('userType')}
						defaultSchool       = {binding.toJS('school')}
						handleChangeSchool  = {this.handleChangeSchool}
						handleClickBack     = {this.handleClickBack}
					/>
				);
				break;
			case STEP_PARENT.CHILD_STEP.key:
				currentView = (
					<ChildStep
						binding         = {binding.sub('childFields')}
						setChild        = {this.setChild}
						handleClickBack = {this.handleClickBack}
					/>
				);
				break;
		}

		if (binding.get('isSync')) {
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
		} else {
			return (
				<div className="bRegistrationPermissionsStep">
					<Loader/>
				</div>
			);
		}
	}
});