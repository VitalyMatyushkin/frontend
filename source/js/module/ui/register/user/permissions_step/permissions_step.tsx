import * as React from 'react';
import * as Morearty from 'morearty';
import {RegisterUserType} from './register_user_type';
import {StaffRegister} from './staff_register/staff_register';
import {ParentRegister} from './parent_register/parent_register';
import {StudentRegister} from './student_register/student_register';
import {TYPE_USER} from './register_user_type';
import 'styles/pages/register/b_register_permission_step.scss';

export const PermissionsStep = (React as any).createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function () {
		this.setRegion();
	},
	setRegion: function () {
		const   loginSessions = this.props.loginSessions,
				binding = this.getDefaultBinding();

		const phone = loginSessions.phone;
		let region = undefined;

		if (phone.indexOf('+44') === 0) {
			region = 'GB';
		} else {
			if (phone.indexOf('+1') === 0) {
				region = 'US';
			}
		}

		binding.sub('staffRegister.schoolField').set('region', region);
		binding.sub('parentRegister.schoolField').set('region', region);
		binding.sub('studentRegister.schoolField').set('region', region);
	},
	setRegisterType: function(type: string): void {
		const binding = this.getDefaultBinding();
		binding.set('userType', type);
		binding.sub('staffRegister').set('userType', type);
		binding.sub('parentRegister').set('userType', type);
		binding.sub('studentRegister').set('userType', type);
	},

	backToUserType: function () {
		this.getDefaultBinding().set('userType', '');
		this.getDefaultBinding().clear();
	},

	render: function()  {
		const	binding		= this.getDefaultBinding(),
				userType	= binding.get('userType');

		let currentView = null;

		switch (userType) {
			case TYPE_USER.STAFF:
				currentView = (
					<StaffRegister
						backToUserType  = {this.backToUserType}
						binding         = {binding.sub('staffRegister')}
					/>
				);
				break;
			case TYPE_USER.PARENT:
				currentView = (
					<ParentRegister
						backToUserType  = {this.backToUserType}
						binding         = {binding.sub('parentRegister')}/>
				);
				break;
			case TYPE_USER.STUDENT:
				currentView = (
					<StudentRegister
						backToUserType  = {this.backToUserType}
						binding         = {binding.sub('studentRegister')}/>
				);
				break;
			default:
				currentView = <RegisterUserType setRegisterType = {this.setRegisterType}/>;
				break;
		}

		return (
			<div>
				{currentView}
			</div>
		);
	}
});