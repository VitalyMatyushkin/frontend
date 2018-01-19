import * as React from 'react';
import * as Morearty from 'morearty';
import {RegisterUserType} from './register_user_type';
import {StaffRegister} from './staff_register/staff_register';
import {ParentRegister} from './parent_register/parent_register';
import {StudentRegister} from './student_register/student_register';
import {TYPE_USER} from './register_user_type';

export const RegisterComponent = (React as any).createClass({
	mixins: [Morearty.Mixin],
	setRegisterType: function(type: string): void {
		this.getDefaultBinding().set('userType', type);
	},

	render: function()  {
		const   binding     = this.getDefaultBinding(),
				userType    = binding.get('userType');

		let currentView = null;

		switch (userType) {
			case TYPE_USER.STAFF:
				currentView = <StaffRegister binding={binding.sub('staffRegister')}/>;
				break;
			case TYPE_USER.PARENT:
				currentView = <ParentRegister binding={binding.sub('parentRegister')}/>;
				break;
			case TYPE_USER.STUDENT:
				currentView = <StudentRegister binding={binding.sub('studentRegister')}/>;
				break;
			default:
				currentView = <RegisterUserType setRegisterType = {this.setRegisterType}/>;
				break;
		}

		return (
			<div className="bRegistration">
				{currentView}
			</div>
		);
	}
});