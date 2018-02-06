import * as React from "react";
import * as Immutable from 'immutable';
import * as Morearty from 'morearty';
import * as BPromise from 'bluebird';
import * as propz from 'propz';

import * as PermissionRequestList from 'module/shared_pages/permission_requests/request-list';
import {ConfirmMessage} from "module/as_admin/pages/admin_schools/new_user_requests/confirm_message";
import {SchoolLimitsPopup} from "module/as_admin/pages/admin_schools/new_user_requests/school_limits_popup";
import {AdminServiceList} from "module/core/service_list/admin_service_list";

export const NewUserRequests = (React as any).createClass({
	mixins: [Morearty.Mixin],
	resolveFuncForHandleActionPromise: undefined,
	componentWillMount() {
		this.initSchoolLimitsPopupData();
	},
	initSchoolLimitsPopupData() {
		this.getDefaultBinding().set('isShowSchoolLimitsPopup', false);
		this.getDefaultBinding().set('schoolLimitsPopup', Immutable.fromJS(
			{
				isSync: false,
				schoolLimitsForm: {}
			}
		));
	},
	getPermissionById(id, permissions) {
		return permissions.find(permission => permission.id === id);
	},
	handleAction(itemId, action): BPromise<any> {
		const self = this;

		return new BPromise(resolve => {
			const prId = itemId;
			const binding = self.getDefaultBinding().sub('data');
			const currentPr = self.getPermissionById(prId, binding.toJS());

			const schoolId = currentPr.requestedPermission.schoolId;
			const email = currentPr.requester.email;
			const phone = currentPr.requester.phone;

			const isSolePETeacher = propz.get(currentPr, ['requestedPermission', 'details',' solePeTeacher'], undefined);

			(window.Server as AdminServiceList).publicSchool.get({schoolId: schoolId}).then(schoolData => {
				const isThereAnyAdminsInSchool = propz.get(schoolData, ['stats', 'rolesExistence', 'staff'], undefined);

				switch (action){
					case 'Accept':
						window.confirmAlert(
							<ConfirmMessage email = {email} phone = {phone}/>,
							"Ok",
							"Cancel",
							() => {
								switch (true) {
									case currentPr.requestedPermission.preset === "PARENT": {
										document.location.hash = `${document.location.hash}/accept?prId=${prId}&schoolId=${schoolId}`;
										break;
									}
									case currentPr.requestedPermission.preset === "STUDENT": {
										document.location.hash = `${document.location.hash}/accept-student?prId=${prId}&schoolId=${schoolId}`;
										break;
									}
									case currentPr.requestedPermission.preset === "ADMIN" && (
										!isThereAnyAdminsInSchool ||
										isSolePETeacher
									) : {
										window.Server.statusPermissionRequest.put(
											{schoolId: schoolId, prId: prId},
											{status: 'ACCEPTED'}
											)
											.then(() => {
												this.getDefaultBinding().set('schoolLimitsPopup.schoolId', schoolId);
												this.getDefaultBinding().set('isShowSchoolLimitsPopup', true);

												this.resolveFuncForHandleActionPromise = resolve;
											});
										break;
									}
									default: {
										window.Server.statusPermissionRequest.put(
											{schoolId: schoolId, prId: prId},
											{status: 'ACCEPTED'}
											)
											.then(() => resolve(true));
										break;
									}
								}
							},
							() => {}
						);
						break;
					case 'Decline':
						window.confirmAlert(
							"Are you sure you want to decline?",
							"Ok",
							"Cancel",
							() => {
								// Pls look up at previous comment
								window.Server.statusPermissionRequest.put(
									{schoolId:schoolId, prId:prId},{status:'REJECTED'}
									)
									.then(() => resolve(true));
							},
							() => {}
						);
						break;
					case 'Accept and merge':
						document.location.hash = `${document.location.hash}/merge-student?permissionId=${prId}&schoolId=${schoolId}`;
						resolve(true);
						break;
					default :
						resolve(true);
						break;
				}
			});
		});
	},
	handleSchoolLimitsSuccessSubmit() {
		if(typeof this.resolveFuncForHandleActionPromise !== 'undefined') {
			this.resolveFuncForHandleActionPromise(true);
			this.resolveFuncForHandleActionPromise = undefined;

			this.initSchoolLimitsPopupData();
		}
	},
	renderSchoolLimitsPopup() {
		if(this.getDefaultBinding().toJS('isShowSchoolLimitsPopup')) {
			return (
				<SchoolLimitsPopup
					binding = {this.getDefaultBinding().sub('schoolLimitsPopup')}
					schoolId = {this.getDefaultBinding().toJS('schoolLimitsPopup.schoolId')}
					handleSuccessSubmit = {() => this.handleSchoolLimitsSuccessSubmit()}
				/>
			)
		} else {
			return true;
		}
	},
	render() {
		return (
			<div>
				<PermissionRequestList
					binding = {this.getDefaultBinding()}
					handleAction = {(itemId, action) => this.handleAction(itemId, action)}
				/>
				{this.renderSchoolLimitsPopup()}
			</div>
		);
	}
});