import {ServiceList} from "module/core/service_list/service_list";
import {DataItem} from "module/ui/dashboard_components/dashboard_data_widget/dashboard_data_widget";
import * as BPromise from "bluebird";

export const SchoolDataWidgetActions = {
	getDataForSchoolDataWidget(schoolId: string): BPromise<{dataItems: DataItem[]}> {
		const data = {dataItems: []};

		return this.getSchoolStudentsCount(schoolId)
			.then((countData) => {
				data.dataItems.push(
					{
						name: 'Students',
						value: String(countData.count),
						icon: {
							handleClick: () => {window.location.hash = 'school_admin/students';},
							iconStyle: 'fa-pencil-square-o'
						}
					}
				);

				return this.getSchoolFormsCount(schoolId);
			})
			.then((countData) => {
				data.dataItems.push(
					{
						name: 'Forms',
						value: String(countData.count),
						icon: {
							handleClick: () => {window.location.hash = 'school_admin/forms';},
							iconStyle: 'fa-pencil-square-o'
						}
					}
				);

				return this.getSchoolHousesCount(schoolId);
			})
			.then((countData) => {
				data.dataItems.push(
					{
						name: 'Houses',
						value: String(countData.count),
						icon: {
							handleClick: () => {window.location.hash = 'school_admin/houses';},
							iconStyle: 'fa-pencil-square-o'
						}
					}
				);

				return this.getSchoolTeamsCount(schoolId);
			})
			.then((countData) => {
				data.dataItems.push(
					{
						name: 'Teams',
						value: String(countData.count),
						icon: {
							handleClick: () => {window.location.hash = 'school_admin/teams';},
							iconStyle: 'fa-pencil-square-o'
						}
					}
				);

				return data;
			});
	},
	getSchoolStudentsCount(schoolId: string): BPromise<{count: number}> {
		return (window.Server as ServiceList).schoolStudentsCount.get({schoolId});
	},
	getSchoolFormsCount(schoolId: string) {
		return (window.Server as ServiceList).schoolForms.get({schoolId}, {filter: {limit: 1000}})
			.then(forms => {
				return {count: forms.length};
			});
	},
	getSchoolHousesCount(schoolId: string): BPromise<{count: number}> {
		return (window.Server as ServiceList).schoolHouses.get({schoolId}, {filter: {limit: 1000}})
			.then(houses => {
				return {count: houses.length};
			});
	},
	getSchoolTeamsCount(schoolId: string): BPromise<{count: number}> {
		return (window.Server as ServiceList).teams.get(
			{schoolId},
			{filter: {where: {removed:false}, limit: 1000}}
			)
			.then(teams => {
				return {count: teams.length};
			});
	}
};