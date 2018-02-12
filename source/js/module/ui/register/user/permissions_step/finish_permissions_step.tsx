import * as React from 'react';
import * as Morearty from 'morearty';
import {TYPE_USER} from './register_user_type';
import {TYPE_REGISTER} from './register_type_step';
import {SUBSCRIPTION_OPTIONS} from './staff_register/member_school_step';
import {ConfirmPopup} from 'module/ui/confirm_popup';
import * as Loader from 'module/ui/loader';
import * as propz from 'propz';

interface PostData {
	preset:		string
	schoolId:	string
	details?:	any
	comment?:	string
}

export const FinishPermissionsStep = (React as any).createClass({
	mixins: [Morearty.Mixin],

	componentWillMount: function () {
		this.getDefaultBinding().set('isSyncFinish', true);
	},

	renderStaffFields: function (): React.ReactNode {
		const	binding		= this.getDefaultBinding(),
				schoolName	= binding.toJS('school').name;
		return (
			<div className = "eTextWrapper">
				<div className = "eText">
					<div className = "eTextKey">School</div>
					<div className = "eTextValue">{schoolName}</div>
				</div>
				{ typeof binding.toJS('role') !== 'undefined' && !this.isSchoolWithoutUsers(binding.toJS('school')) ?
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

	isSchoolWithoutUsers: function (school): boolean {
		const rolesExistence = propz.get(school, ['stats', 'rolesExistence', 'staff'], true);
		return !rolesExistence;
	},

	getSubscriptionText: function (option: string, schoolName: string): string {
		let subscriptionText;
		switch (option) {
			case SUBSCRIPTION_OPTIONS.FULL:
				subscriptionText = `I’m a school official for ${schoolName} and I would like to sign my school up to the full subscription`;
				break;
			case SUBSCRIPTION_OPTIONS.TRIAL:
				subscriptionText = `I’m a school official for ${schoolName} and I would like to sign up for the 30 days free trial`;
				break;
			case SUBSCRIPTION_OPTIONS.FREE:
				subscriptionText = `I’m a PE teacher for ${schoolName} and I would like to sign up as a sole PE teacher for free`;
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

	handleClickOk: function (): void {
		const dataToPost = this.getPostData();
		this.getDefaultBinding().set('isSyncFinish', false);
		(window as any).Server.profileRequests.post(dataToPost)
			.then(() => {
				this.getDefaultBinding().set('isSyncFinish', true);
				//copy of old finish function
				let subdomains = document.location.host.split('.');
				subdomains[0] = subdomains[0] !== 'admin' ? 'app' : subdomains[0];
				const domain = subdomains.join(".");
				window.location.href = `//${domain}/#settings/general`;
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
		const	binding		= this.getDefaultBinding(),
				userType	= binding.toJS('userType'),
				isSync      = binding.get('isSyncFinish');

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
			<ConfirmPopup
				okButtonText="Finish"
				cancelButtonText="Back"
				handleClickOkButton={() => this.handleClickOk()}
				handleClickCancelButton={() => this.props.handleClickBack()}
				customStyle='ePopup'
				isShowButtons={isSync}
			>
				{isSync ?
					<div>
						<div className="bFinishSubtitle">
							You see the data that you selected in the previous steps.<br/>
							You can go <span>Back</span> and change them.
							If all is correct, click <span>Finish</span>.
						</div>
						{result}
					</div>
					:
					<Loader/>
				}
			</ConfirmPopup>
		);
	}
});