import {ServiceList} from "module/core/service_list/service_list";

export const SchoolDataWidgetActions = {
	getDataForSchoolDataWidget(schoolId: string) {
		const data = {dataItems: []};

		return this.getSchoolStudentsCount(schoolId)
			.then((countData) => {
				data.dataItems.push(
					{
						name: 'Students',
						value: String(countData.count),
						button: {
							text: 'Edit',
							handleClick: () => {window.location.hash = 'school_admin/students';},
							extraStyle: 'mSm'
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
						button: {
							text: 'Edit',
							handleClick: () => {window.location.hash = 'school_admin/forms';},
							extraStyle: 'mSm'
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
						button: {
							text: 'Edit',
							handleClick: () => {window.location.hash = 'school_admin/houses';},
							extraStyle: 'mSm'
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
						button: {
							text: 'Edit',
							handleClick: () => {window.location.hash = 'school_admin/teams';},
							extraStyle: 'mSm'
						}
					}
				);

				return data;
			});
	},
	getSchoolStudentsCount(schoolId: string) {
		return (window.Server as ServiceList).schoolStudentsCount.get({schoolId});
	},
	getSchoolFormsCount(schoolId: string) {
		return (window.Server as ServiceList).schoolForms.get({schoolId}, {filter: {limit: 1000}})
			.then(forms => {
				return {count: forms.length};
			});
	},
	getSchoolHousesCount(schoolId: string) {
		return (window.Server as ServiceList).schoolHouses.get({schoolId}, {filter: {limit: 1000}})
			.then(houses => {
				return {count: houses.length};
			});
	},
	getSchoolTeamsCount(schoolId: string) {
		return (window.Server as ServiceList).teams.get(
			{schoolId},
			{filter: {where: {removed:false}, limit: 1000}}
			)
			.then(teams => {
				return {count: teams.length};
			});
	}
};