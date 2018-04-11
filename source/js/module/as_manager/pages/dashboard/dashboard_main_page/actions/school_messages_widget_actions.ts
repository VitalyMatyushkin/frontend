import {ServiceList} from "module/core/service_list/service_list"
import {DataItem} from "module/ui/dashboard_components/dashboard_data_widget/dashboard_data_widget";
import * as BPromise from "bluebird";

export const SchoolMessagesWidgetActions = {
	getDataForSchoolMessagesWidget(schoolId: string): BPromise<{dataItems: DataItem[]}> {
		const data = {dataItems: []};

		return this.getSchoolMessagesInboxCount(schoolId)
			.then(countData => {
				const item: DataItem = {
					name: 'Messages(new)',
					value: String(countData.count),
					extraStyle: this.getExtraStyleForMessagesInboxItem(countData.count)
				};
				if(countData.count > 0) {
					item.icon = {
						handleClick: () => {window.location.hash = 'messages/inbox';},
						iconStyle: 'fa-pencil-square-o'
					}
				} else {
					item.icon = {
						handleClick: () => {window.location.hash = 'messages/inbox';},
						iconStyle: 'fa-eye'
					}
				} 

				data.dataItems.push(item);

				return this.getSchoolMessagesOutboxCount(schoolId);
			})
			.then((countData) => {
				data.dataItems.push({
					name: 'Outbox(pending)',
					value: String(countData.count),
					icon: {
						handleClick: () => {window.location.hash = 'messages/outbox';},
						iconStyle: 'fa-pencil-square-o'
					}
				});

				return this.getSchoolMessagesArchiveCount(schoolId);
			})
			.then((countData) => {
				data.dataItems.push({
					name: 'Archive',
					value: String(countData.count),
					icon: {
						handleClick: () => {window.location.hash = 'messages/archive';},
						iconStyle: 'fa-pencil-square-o'
					}
				});

				return data;
			})
	},
	getExtraStyleForMessagesInboxItem(invitesCount: number): string {
		if(invitesCount === 0) {
			return '';
		} else {
			return 'mRedColor';
		}
	},
	getSchoolMessagesInboxCount(schoolId: string): BPromise<{count: number}> {
		return (window.Server as ServiceList).schoolEventsMessagesInboxCount.get({schoolId});
	},
	getSchoolMessagesOutboxCount(schoolId: string): BPromise<{count: number}> {
		return (window.Server as ServiceList).schoolEventsMessagesOutbox.get({schoolId}).then(messages => {
			return {
				count: messages.length
			}
		});
	},
	getSchoolMessagesArchiveCount(schoolId: string): BPromise<{count: number}> {
		return (window.Server as ServiceList).schoolEventsMessagesArchive.get({schoolId}).then(messages => {
			return {
				count: messages.length
			}
		});
	}
};