import {ServiceList} from "module/core/service_list/service_list";
import * as RoleHelper from "module/helpers/role_helper";

export const SchoolUsersWidgetActions = {
	getDataForSchoolUsersWidget(schoolId: string) {
		const data = {dataItems: []};

		return this.getSchoolPermissions(schoolId)
			.then(permissions => {
				data.dataItems.push(
					{name: 'School Admin staff', value: String(this.getAdminStaffCountByPermissions(permissions))},
					{name: 'School PE staff', value: String(this.getSchoolPEStaffCountByPermissions(permissions))},
					{name: 'Parents', value: String(this.getParentsCountByPermissions(permissions))}
				);

				return this.getSchoolStudentsCount(schoolId);
			})
			.then(countData => {
				data.dataItems.push({name: 'Students', value: String(countData.count)});

				return this.getSchoolRequestsCount(schoolId);
			})
			.then(countData => {
				data.dataItems.push({name: 'Requests pending', value: String(countData.count)});

				return data;
			})
	},
	getAdminStaffCountByPermissions(permissions) {
		return permissions.filter(permission =>
			(
				permission.preset === RoleHelper.USER_ROLES.ADMIN ||
				permission.preset === RoleHelper.USER_ROLES.MANAGER
			) &&
			permission.status === 'ACTIVE'
		).length;
	},
	getSchoolPEStaffCountByPermissions(permissions) {
		return permissions.filter(permission =>
			(
				permission.preset === RoleHelper.USER_ROLES.COACH ||
				permission.preset === RoleHelper.USER_ROLES.TEACHER
			) &&
			permission.status === 'ACTIVE'
		).length;
	},
	getParentsCountByPermissions(permissions) {
		return permissions.filter(permission =>
			permission.preset === RoleHelper.USER_ROLES.PARENT &&
			permission.status === 'ACTIVE'
		).length;
	},
	getSchoolPermissions(schoolId: string) {
		return (window.Server as ServiceList).schoolPermissions.get({schoolId});
	},
	getSchoolStudentsCount(schoolId: string) {
		return (window.Server as ServiceList).schoolStudentsCount.get({schoolId});
	},
	getSchoolRequestsCount(schoolId: string) {
		return (window.Server as ServiceList).permissionRequestsCount.get(
			{schoolId},
			{filter: {limit: 1000, where:{status:"NEW"}}}
			);
	}
};