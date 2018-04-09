import {ServiceList} from "module/core/service_list/service_list"
import {DataItem} from "module/ui/dashboard_components/dashboard_data_widget/dashboard_data_widget";
import * as BPromise from "bluebird";

export const SchoolInvitesWidgetActions = {
	getDataForSchoolInvitesWidget(schoolId: string): BPromise<{dataItems: DataItem[]}> {
		const data = {dataItems: []};

		return this.getSchoolInvitesInboxCount(schoolId)
			.then(countData => {
				const item: DataItem = {
					name: 'Invites(new)',
					value: String(countData.count),
					extraStyle: this.getExtraStyleForInviteInboxItem(countData.count)
				};
				if(countData.count > 0) {
					item.icon = {
						handleClick: () => {window.location.hash = 'invites/inbox';},
						iconStyle: 'fa-pencil-square-o'
					}
				} else {
					item.icon = {
						handleClick: () => {window.location.hash = 'invites/inbox';},
						iconStyle: 'fa-eye'
					}
				}

				data.dataItems.push(item);

				return this.getSchoolInvitesOutboxCount(schoolId);
			})
			.then((countData) => {
				data.dataItems.push({
					name: 'Outbox(pending)',
					value: String(countData.count),
					icon: {
						handleClick: () => {window.location.hash = 'invites/outbox';},
						iconStyle: 'fa-eye'
					}
				});

				return this.getSchoolInvitesArchiveCount(schoolId);
			})
			.then((countData) => {
				data.dataItems.push({
					name: 'Archive',
					value: String(countData.count),
					icon: {
						handleClick: () => {window.location.hash = 'invites/archive';},
						iconStyle: 'fa-eye'
					}
				});

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
	getSchoolInvitesInboxCount(schoolId: string): BPromise<{count: number}> {
		return (window.Server as ServiceList).inviteInboxCount.get({schoolId});
	},
	getSchoolInvitesOutboxCount(schoolId: string): BPromise<{count: number}> {
		return (window.Server as ServiceList).inviteOutboxCount.get({schoolId});
	},
	getSchoolInvitesArchiveCount(schoolId: string): BPromise<{count: number}> {
		return (window.Server as ServiceList).inviteArchiveCount.get({schoolId});
	}
};