import * as React from "react";
import * as Morearty from 'morearty';
import * as BPromise from 'bluebird';

import * as Lazy from 'lazy.js';

import * as PermissionRequestList from 'module/shared_pages/permission_requests/request-list';
import {ConfirmMessage} from "module/as_admin/pages/admin_schools/new_user_requests/confirm_message";

export const NewUserRequests = (React as any).createClass({
	mixins: [Morearty.Mixin],

	getCurrentPermission(id, permissions) {
		return Lazy(permissions).find(permission => permission.id && permission.id === id);
	},
	handleAction(itemId, action): BPromise<any> {
		const self = this;

		return new BPromise(resolve => {
			const 	prId 		= itemId,
					binding 	= self.getDefaultBinding().sub('data'),
					currentPr 	= self.getCurrentPermission(prId, binding.toJS()),
					schoolId 	= currentPr ? currentPr.requestedPermission.schoolId : '',
					email 		= currentPr.requester.email,
					phone 		= currentPr.requester.phone;

			switch (action){
				case 'Accept':
					window.confirmAlert(
						<ConfirmMessage email = {email} phone = {phone}/>,
						"Ok",
						"Cancel",
						() => {
							if (currentPr.requestedPermission.preset === "PARENT") {
								document.location.hash = `${document.location.hash}/accept?prId=${prId}&schoolId=${schoolId}`
							} else if(currentPr.requestedPermission.preset === "STUDENT") {
								document.location.hash = `${document.location.hash}/accept-student?prId=${prId}&schoolId=${schoolId}`
							} else {
								// This component used on manager side and on admin side.
								// For manager and for admin we have different service lists, with different routes, but with same route names.
								// For admin we have statusPermissionRequest route with url - /superadmin/users/permissions/requests/{prId}/status
								// For manager we have statusPermissionRequest route with url - /i/schools/{schoolId}/permissions/requests/{prId}/status
								// So, for manager schoolId is required, for admin isn't required.
								window.Server.statusPermissionRequest.put(
									{schoolId: schoolId, prId: prId},
									{status: 'ACCEPTED'}
									)
									.then(() => resolve(true));
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
	},
	render() {
		return (
			<PermissionRequestList
				binding = {this.getDefaultBinding()}
				handleAction = {(itemId, action) => this.handleAction(itemId, action)}
			/>
		);
	}
});