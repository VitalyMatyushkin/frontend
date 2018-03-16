import {ServiceList} from "module/core/service_list/service_list";

export const SchoolUsersWidgetActions = {
	getDataForSchoolUsersWidget(schoolId: string) {
		const data = {dataItems: []};

		return this.getSchoolStudentsCount(schoolId)
			.then(countData => {
				data.dataItems.push(
					{name: 'School Admin staff', value: '0'},
					{name: 'School PE staff', value: '0'},
					{name: 'Parents', value: '0'},
					{name: 'Students', value: String(countData.count)}
				);

				return this.getSchoolRequestsCount(schoolId);
			})
			.then(countData => {
				data.dataItems.push(
					{name: 'Requests pending', value: String(countData.count)}
				);

				return data;
			})
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