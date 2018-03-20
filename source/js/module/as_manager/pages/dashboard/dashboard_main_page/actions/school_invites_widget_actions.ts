import {ServiceList} from "module/core/service_list/service_list"

export const SchoolInvitesWidgetActions = {
	getDataForSchoolInvitesWidget(schoolId: string) {
		const data = {dataItems: []};

		return this.getSchoolInvitesInboxCount(schoolId)
			.then((countData) => {
				data.dataItems.push(
					{
						name: 'Invites(new)',
						value: String(countData.count),
						extraStyle: this.getExtraStyleForInviteInboxItem(countData.count),
						button: {
							text: 'Accept',
							handleClick: () => {window.location.hash = 'invites/inbox';},
							extraStyle: 'mDanger mSm'
						}
					}
				);

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
	getExtraStyleForInviteInboxItem(invitesCount: number) {
		if(invitesCount === 0) {
			return '';
		} else {
			return 'mRedColor';
		}
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