import {ServiceList} from "module/core/service_list/service_list";

export const SchoolInvitesWidgetActions = {
	getDataForSchoolInvitesWidget(schoolId: string) {
		const data = {dataItems: []};

		return this.getSchoolInvitesInboxCount(schoolId)
			.then((countData) => {
				data.dataItems.push({name: 'Invites(new)', value: String(countData.count)});

				return this.getSchoolInvitesOutboxCount(schoolId);
			})
			.then((countData) => {
				data.dataItems.push({name: 'Outbox(pending)', value: String(countData.count)});

				return this.getSchoolInvitesArchiveCount(schoolId);
			})
			.then((countData) => {
				data.dataItems.push({name: 'Archive', value: String(countData.count)});

				return data;
			})
	},
	getSchoolInvitesInboxCount(schoolId: string) {
		return (window.Server as ServiceList).inviteInboxCount.get({schoolId});
	},
	getSchoolInvitesOutboxCount(schoolId: string) {
		return (window.Server as ServiceList).inviteOutboxCount.get({schoolId});
	},
	getSchoolInvitesArchiveCount(schoolId: string) {
		return (window.Server as ServiceList).inviteArchiveCount.get({schoolId});
	}
};