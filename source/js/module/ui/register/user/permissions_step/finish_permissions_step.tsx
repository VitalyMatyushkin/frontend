import * as React from 'react';
import * as Morearty from 'morearty';
import {TYPE_USER} from './register_user_type';
import {SUBSCRIPTION_OPTIONS} from './staff_register/member_school_step';
import {ConfirmPopup} from 'module/ui/confirm_popup';
import * as Loader from 'module/ui/loader';
import * as Promise from 'bluebird';
import {DateHelper} from 'module/helpers/date_helper';

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

	handleClickOk: function (): void {
		this.getDefaultBinding().set('isSyncFinish', false);

		if (this.getDefaultBinding().toJS('userType') === TYPE_USER.PARENT) {
			const childFields = this.getDefaultBinding().toJS('childFields');
			Promise.all(childFields.map( child => {
				return (window as any).Server.profileRequests.post( {
					preset: 			'PARENT',
					schoolId: 			this.getDefaultBinding().toJS('school').id,
					childFormId: 		child.formId,
					childHouseId: 		child.houseId,
					childGender: 		child.gender,
					childDateOfBirth: 	typeof child.birthday !== 'undefined' ?
						DateHelper.getFormatDateUTCStringByRegion(child.birthday, this.getDefaultBinding().get('region')) : undefined,
					comment:            `${typeof child.firstName !== 'undefined' ? child.firstName : ''} ${typeof child.lastName !== 'undefined' ? child.lastName : ''}`
				});
			})).then(() => {
				this.setSyncAndGoToProfile();
			});
		} else {
			const dataToPost = this.getPostData();
			(window as any).Server.profileRequests.post(dataToPost)
				.then(() => {
					this.setSyncAndGoToProfile();
				});
		}
	},

	setSyncAndGoToProfile: function () {
		this.getDefaultBinding().set('isSyncFinish', true);
		//copy of old finish function
		let subdomains = document.location.host.split('.');
		subdomains[0] = subdomains[0] !== 'admin' ? 'app' : subdomains[0];
		const domain = subdomains.join(".");
		window.location.href = `//${domain}/#settings/general`;
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
		}

		return dataToPost;
	},

	render: function() {
		const	binding		= this.getDefaultBinding(),
			userType	= binding.toJS('userType'),
			isSync      = binding.get('isSyncFinish');

		return (
			<ConfirmPopup
				okButtonText="Send"
				cancelButtonText="Back"
				handleClickOkButton={() => this.handleClickOk()}
				handleClickCancelButton={() => this.props.handleClickBack()}
				customStyle='ePopup'
				isShowButtons={isSync}
			>
				{isSync ?
					<div>
						<div className="bFinishSubtitle">
							Role request confirmation
						</div>
						<div className="bFinishBody">
							You are going to send a role request to join {binding.toJS('school').name}<br/>
							Are you sure?
						</div>
					</div>
					:
					<Loader/>
				}
			</ConfirmPopup>
		);
	}
});