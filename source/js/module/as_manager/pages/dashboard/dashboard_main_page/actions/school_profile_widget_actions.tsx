import {ServiceList} from "module/core/service_list/service_list";

export const SchoolProfileWidgetActions = {
	getDataForSchoolUsersWidget(schoolId: string) {
		return this.getSchoolData(schoolId);
	},
	getSchoolData(schoolId: string) {
		return (window.Server as ServiceList).publicSchool.get({schoolId});
	}
};