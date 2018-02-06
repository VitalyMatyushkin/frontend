import * as React from 'react';
import * as Morearty from 'morearty';
import * as Immutable from 'immutable';
import {RegisterTypeStep} from '../register_type_step';
import {TYPE_REGISTER} from '../register_type_step';
import {SchoolStep} from '../school_step';
import {FinishPermissionsStep} from '../finish_permissions_step';
import {School} from 'module/ui/autocomplete2/custom_list_items/school_list_item/school_list_item';
import * as Loader from 'module/ui/loader';

const STEP_STUDENT = {
	SCHOOL: {
		key: 'SCHOOL',
		title: 'Choose a school'
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

	componentWillMount: function () {
		const binding = this.getDefaultBinding();
		binding.set('isSync', true);
		binding.set('role', 'STUDENT');
		binding.set('isFinish', false);
	},

	setRegisterType: function (type: string): void {
		if (type !== '') {
			const binding = this.getDefaultBinding();

			binding.set('registerType', type);
			if (type === TYPE_REGISTER.INDIVIDUAL.type) {
				this.getSSTSchool();
				binding.set('isFinish', true);
			} else {
				this.addToHistory();
				binding.set('registerStep', STEP_STUDENT.SCHOOL);
			}
			binding.set('school', undefined);
		}
	},

	getSSTSchool: function() {
		const   binding		= this.getDefaultBinding(),
				schoolName	= 'Squad In Touch Sports Stars Team';
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

	handleChangeSchool: function (data: SchoolData, school: School): void {
		const binding = this.getDefaultBinding();

		if (typeof school !== "undefined") {
			binding.set('school', school);
			binding.sub('schoolField').set('schoolId', data.schoolId);
		}
		binding.set('isFinish', true);
	},

	renderTitle: function (): React.ReactNode {
		const	binding		= this.getDefaultBinding(),
				currentStep = binding.get('registerStep');

		return <div className="bRegistrationTitlePermissionsStep">{currentStep.title}</div>
	},

	addToHistory: function (): void {
		const	binding		= this.getDefaultBinding(),
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
		const	binding		= this.getDefaultBinding(),
				currentStep = binding.get('registerStep');

		let currentView = null;

		switch (currentStep.key) {
			case STEP_STUDENT.REGISTER_TYPE.key:
				currentView = (
					<RegisterTypeStep
						defaultType		= {binding.get('registerType')}
						mode			= {binding.toJS('userType')}
						setRegisterType	= {this.setRegisterType}
						handleClickBack	= {this.handleClickBack}
					/>
				);
				break;
			case STEP_STUDENT.SCHOOL.key:
				currentView = (
					<SchoolStep
						mode				= {binding.toJS('userType')}
						binding				= {binding.sub('schoolField')}
						defaultSchool		= {binding.toJS('school')}
						handleChangeSchool	= {this.handleChangeSchool}
						handleClickBack		= {this.handleClickBack}
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