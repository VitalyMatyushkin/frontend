import * as React from 'react';
import * as Morearty from 'morearty';
import {TYPE_USER} from './register_user_type';
import {TYPE_REGISTER} from './register_type_step';
import {SUBSCRIPTION_OPTIONS} from './staff_register/member_school_step';

export const FinishPermissionsStep = (React as any).createClass({
	mixins: [Morearty.Mixin],

	renderStaffFields: function (): React.ReactNode {
		const   binding     = this.getDefaultBinding(),
				schoolName  = binding.toJS('school').name;
		return (
			<div className = "eTextWrapper">
				<div className = "eText">
					<div className = "eTextKey">User type</div>
					<div className = "eTextValue">{binding.toJS('userType')}</div>
				</div>
				<div className = "eText">
					<div className = "eTextKey">School</div>
					<div className = "eTextValue">{schoolName}</div>
				</div>
				{ typeof binding.toJS('role') !== 'undefined' ?
					<div className = "eText">
						<div className = "eTextKey">Role</div>
						<div className = "eTextValue">{binding.toJS('role')}</div>
					</div> : null
				}
				{ typeof binding.toJS('subscriptionOption') !== 'undefined' ?
					<div className = "eText">
						<div className = "eTextKey">Subscription</div>
						<div className = "eTextValue">{this.getSubscriptionText(binding.toJS('subscriptionOption'), schoolName)}</div>
					</div> : null
				}
			</div>
		);
	},

	getSubscriptionText: function (option: string, schoolName: string): string {
		let subscriptionText;
		switch (option) {
			case SUBSCRIPTION_OPTIONS.FULL:
				subscriptionText = `I'm  ${schoolName} official and I would like to sign up my school for full subscription`;
				break;
			case SUBSCRIPTION_OPTIONS.MONTH:
				subscriptionText = `I'm  ${schoolName}  official and I would like to sign up my school for 30 days trial subscription for free`;
				break;
			case SUBSCRIPTION_OPTIONS.FREE:
				subscriptionText = `I'm  ${schoolName} and I would like to sign up with Squad In Touch as a sole PE teacher for free`;
				break;
		}

		return subscriptionText;
	},

	renderStudentFields: function (): React.ReactNode {
		const binding = this.getDefaultBinding();
		return (
			<div className = "eTextWrapper">
				<div className = "eText">
					<div className = "eTextKey">User type</div>
					<div className = "eTextValue">{binding.toJS('userType')}</div>
				</div>
				<div className = "eText">
					<div className = "eTextKey">Registration type</div>
					<div className = "eTextValue">{TYPE_REGISTER[binding.toJS('registerType')].studentText}</div>
				</div>
				{ typeof binding.toJS('school') !== 'undefined' ?
					<div className = "eText">
						<div className = "eTextKey">School</div>
						<div className = "eTextValue">{binding.toJS('school').name}</div>
					</div> : null
				}
				{ typeof binding.toJS('sportsStarsTeam') !== 'undefined' ?
					<div className = "eText">
						<div className = "eTextKey">SIT Sports Stars Team</div>
						<div className = "eTextValue">{binding.toJS('sportsStarsTeam')}</div>
					</div> : null
				}
			</div>
		);
	},

	renderParentFields: function (): React.ReactNode {
		const binding = this.getDefaultBinding();
		return (
			<div className = "eTextWrapper">
				<div className = "eText">
					<div className = "eTextKey">User type</div>
					<div className = "eTextValue">{binding.toJS('userType')}</div>
				</div>
				<div className = "eText">
					<div className = "eTextKey">Registration type</div>
					<div className = "eTextValue">{TYPE_REGISTER[binding.toJS('registerType')].parentText}</div>
				</div>
				{ typeof binding.toJS('school') !== 'undefined' ?
					<div className = "eText">
						<div className = "eTextKey">School</div>
						<div className = "eTextValue">{binding.toJS('school').name}</div>
					</div> : null
				}
				{ typeof binding.toJS('sportsStarsTeam') !== 'undefined' ?
					<div className = "eText">
						<div className = "eTextKey">SIT Sports Stars Team</div>
						<div className = "eTextValue">{binding.toJS('sportsStarsTeam')}</div>
					</div> : null
				}
			</div>
		);
	},

	render: function() {
		const   binding     = this.getDefaultBinding(),
				userType    = binding.toJS('userType');

		let result;
		switch (userType) {
			case TYPE_USER.STAFF:
				result = this.renderStaffFields();
				break;
			case TYPE_USER.STUDENT:
				result = this.renderStudentFields();
				break;
			case TYPE_USER.PARENT:
				result = this.renderParentFields();
				break;
		}

		return (
			<div className="bRegistrationMain">
				<div className="bFinishSubtitle">
					You see the data that you selected in the previous steps.
					You can go <span>back</span> and change them.
					If all is correct, click <span>continue</span>.
				</div>
				{result}
				<div className="bRegistrationControlButtons">
					<button className="bButton mCancel" onClick={() => this.props.handleClickBack()}>Back</button>
					<button className="bButton" onClick={() => this.props.handleClickContinue()}>Continue</button>
				</div>
			</div>
		);
	}
});