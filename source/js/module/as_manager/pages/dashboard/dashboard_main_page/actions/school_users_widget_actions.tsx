import {ServiceList} from "module/core/service_list/service_list";
import * as RoleHelper from "module/helpers/role_helper";
import * as BPromise from "bluebird";

import {DataItem} from "module/ui/dashboard_components/dashboard_data_widget/dashboard_data_widget";
import {Permission} from "module/models/permission/permission";

export const SchoolUsersWidgetActions = {
	getDataForSchoolUsersWidget(schoolId: string): BPromise<{dataItems: DataItem[]}> {
		const data: {dataItems: DataItem[]} = {dataItems: []};

		return this.getSchoolPermissions(schoolId)
			.then(permissions => {
				data.dataItems.push(
					{
						name: 'School Admin staff',
						value: String(this.getAdminStaffCountByPermissions(permissions)),
						icon: {
							iconStyle: 'fa-eye',
							handleClick: () => {window.location.hash = 'school_console/users';}
						}
					},
					{
						name: 'School PE staff',
						value: String(this.getSchoolPEStaffCountByPermissions(permissions)),
						icon: {
							iconStyle: 'fa-eye',
							handleClick: () => {window.location.hash = 'school_console/users';}
						}
					},
					{
						name: 'Parents',
						value: String(this.getParentsCountByPermissions(permissions)),
						icon: {
							iconStyle: 'fa-eye',
							handleClick: () => {window.location.hash = 'school_console/users';}
						}
					}
				);

				return this.getSchoolStudentsCount(schoolId);
			})
			.then(countData => {
				data.dataItems.push({
					name: 'Students',
					value: String(countData.count),
					icon: {
						iconStyle: 'fa-eye',
						handleClick: () => {window.location.hash = 'school_console/users';}
					}
				});

				return this.getSchoolRequestsCount(schoolId);
			})
			.then(countData => {
				const item: DataItem = {
					name: 'Requests pending',
					value: String(countData.count),
					extraStyle: this.getExtraStyleForInviteInboxItem(countData.count)
				};
				if(countData.count > 0) {
					item.icon = {
						iconStyle: 'fa-pencil-square-o',
						handleClick: () => {window.location.hash = 'school_console/requests';}
					}
				} else {
					item.icon = {
						iconStyle: 'fa-eye',
						handleClick: () => {window.location.hash = 'school_console/requests';}
					}
				}

				data.dataItems.push(item);

				return data;
			})
	},
	getExtraStyleForInviteInboxItem(invitesCount: number): string {
		if(invitesCount === 0) {
			return '';
		} else {
			return 'mRedColor';
		}
	},
	getAdminStaffCountByPermissions(permissions): number {
		return permissions.filter(permission =>
			(
				permission.preset === RoleHelper.USER_ROLES.ADMIN ||
				permission.preset === RoleHelper.USER_ROLES.MANAGER
			) &&
			permission.status === 'ACTIVE'
		).length;
	},
	getSchoolPEStaffCountByPermissions(permissions): number {
		return permissions.filter(permission =>
			(
				permission.preset === RoleHelper.USER_ROLES.COACH ||
				permission.preset === RoleHelper.USER_ROLES.TEACHER
			) &&
			permission.status === 'ACTIVE'
		).length;
	},
	getParentsCountByPermissions(permissions): number {
		return permissions.filter(permission =>
			permission.preset === RoleHelper.USER_ROLES.PARENT &&
			permission.status === 'ACTIVE'
		).length;
	},
	getSchoolPermissions(schoolId: string): BPromise<Permission[]> {
		return (window.Server as ServiceList).schoolPermissions.get({schoolId});
	},
	getSchoolStudentsCount(schoolId: string): BPromise<{count: number}> {
		return (window.Server as ServiceList).schoolStudentsCount.get({schoolId});
	},
	getSchoolRequestsCount(schoolId: string): BPromise<{count: number}> {
		return (window.Server as ServiceList).permissionRequests.get(
			{schoolId},
			{filter: {limit: 1000, where:{status:"NEW"}}}
			)
			.then(permissions => {

				return {count: permissions.length}
			});
	}
};