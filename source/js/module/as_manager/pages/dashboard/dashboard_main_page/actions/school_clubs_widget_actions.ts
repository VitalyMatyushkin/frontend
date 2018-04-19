import * as BPromise from "bluebird";

import {ServiceList} from "module/core/service_list/service_list"
import {DataItem} from "module/ui/dashboard_components/dashboard_data_widget/dashboard_data_widget";

export const SchoolClubsWidgetActions = {
	getDataForClubMessagesWidget(schoolId: string): BPromise<{dataItems: DataItem[]}> {
		const data = {dataItems: []};

		return this.getSchoolActiveClubsCount(schoolId)
			.then(countData => {
				const item: DataItem = {
					name: 'Active clubs',
					value: String(countData.count),
					icon: {
						handleClick: () => {window.location.hash = 'clubs/clubList';},
						iconStyle: 'fa-eye'
					}
				};

				data.dataItems.push(item);

				return this.getSchoolDraftClubsCount(schoolId);
			})
			.then((countData) => {
				data.dataItems.push({
					name: 'Drafts',
					value: String(countData.count),
					icon: {
						handleClick: () => {window.location.hash = 'clubs/clubList';},
						iconStyle: 'fa-eye'
					}
				});

				return data;
			});
	},
	getSchoolActiveClubsCount(schoolId: string): BPromise<{count: number}> {
		return (window.Server as ServiceList).schoolClubs.get(
			{schoolId},
			{ filter: { where: { status: 'ACTIVE' } } }
			)
			.then(clubs => {
				return {count: clubs.length}
			});
	},
	getSchoolDraftClubsCount(schoolId: string): BPromise<{count: number}> {
		return (window.Server as ServiceList).schoolClubs.get(
			{schoolId},
			{ filter: { where: { status: 'DRAFT' } } }
			)
			.then(messages => {
				return {count: messages.length}
			});
	}
};