import * as React from 'react';
import * as Morearty from 'morearty';
import {TYPE_USER} from './register_user_type';
import {TYPE_REGISTER} from './register_type_step';
import {SUBSCRIPTION_OPTIONS} from './staff_register/member_school_step';

interface PostData {
	preset:     string
	schoolId:   string
	details?:    any
	comment?:    string
}

export const FinishPermissionsStep = (React as any).createClass({
	mixins: [Morearty.Mixin],

	renderStaffFields: function (): React.ReactNode {
		const   binding     = this.getDefaultBinding(),
				schoolName  = binding.toJS('school').name;
		return (
			<div className = "eTextWrapper">
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
			case SUBSCRIPTION_OPTIONS.TRIAL:
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
					<div className = "eTextKey">Registration type</div>
					<div className = "eTextValue">{TYPE_REGISTER[binding.toJS('registerType')].studentText}</div>
				</div>
				{ typeof binding.toJS('school') !== 'undefined' ?
					<div className = "eText">
						<div className = "eTextKey">School</div>
						<div className = "eTextValue">{binding.toJS('school').name}</div>
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
					<div className = "eTextKey">Registration type</div>
					<div className = "eTextValue">{TYPE_REGISTER[binding.toJS('registerType')].parentText}</div>
				</div>
				{ typeof binding.toJS('school') !== 'undefined' ?
					<div className = "eText">
						<div className = "eTextKey">School</div>
						<div className = "eTextValue">{binding.toJS('school').name}</div>
					</div> : null
				}
				<div className = "eText">
					<div className = "eTextKey">Child</div>
					<div className = "eTextValue">{`${binding.toJS('childFields').firstName} ${binding.toJS('childFields').lastName}`}</div>
				</div>
			</div>
		);
	},

	handleClickFinish: function (): void {
		const dataToPost = this.getPostData();
		(window as any).Server.profileRequests.post(dataToPost)
			.then(() => {
				//copy of old finish function
				(window as any).simpleAlert(
					'Welcome to Squad In Touch!\nThank you for registering your account with us!',
					'Ok',
					() => {
						let subdomains = document.location.host.split('.');
						subdomains[0] = subdomains[0] !== 'admin' ? 'app' : subdomains[0];
						const domain = subdomains.join(".");
						window.location.href = `//${domain}/#settings/general`;
					}
				)
			});
	},

	getPostData: function (): PostData {
		const   binding = this.getDefaultBinding(),
				dataToPost: PostData = {preset: '', schoolId: ''};

		dataToPost.preset = binding.toJS('role');
		dataToPost.schoolId =  binding.toJS('school').id;
		switch (binding.toJS('userType')) {
			case TYPE_USER.STAFF:
				if (binding.get('subscriptionOption') === SUBSCRIPTION_OPTIONS.TRIAL) {
					dataToPost.details = {trial: true};
				}
				if (binding.get('subscriptionOption') === SUBSCRIPTION_OPTIONS.FREE) {
					dataToPost.details = {solePeTeacher: true};
				}
				break;
			case TYPE_USER.PARENT:
				dataToPost.comment = `${binding.toJS('childFields').firstName} ${binding.toJS('childFields').lastName}`;
				break;

		}

		return dataToPost;
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
					<button className="bButton" onClick={() => this.handleClickFinish()}>Finish</button>
				</div>
			</div>
		);
	}
});