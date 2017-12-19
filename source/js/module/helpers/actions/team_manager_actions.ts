import { TabTypes } from 'module/ui/managers/models/player_choosers_tabs_model/tab_types';
import { PlayerChoosersTabModel } from "module/ui/managers/models/player_choosers_tabs_model/player_choosers_tab_model";

interface TeamManagerActionsOptions {
	clubId?: string
}

export class TeamManagerActions implements TeamManagerActionsOptions {

	clubId?: string;

	constructor(options: TeamManagerActionsOptions) {
		this.clubId = options.clubId
	}

	getCurrentTabType(selectedTabId: string, tabs: PlayerChoosersTabModel[]) {
		const selectedTab = tabs.find(tab => tab.id === selectedTabId);

		return typeof selectedTab !== 'undefined' ? selectedTab.type : TabTypes.DefaultTab;
	}

	getSearchService(selectedTabId: string, tabs: PlayerChoosersTabModel[]) {
		return this.getSearchServiceByTabType(
			this.getCurrentTabType(selectedTabId, tabs)
		);
	}

	getSearchServiceByTabType(tabType: TabTypes) {
		let service;

		switch (tabType) {
			case TabTypes.DefaultTab:
				service =  (window as any).Server.schoolStudents;
				break;
			case TabTypes.ChildrenBookingAllChildrenTab:
				service =  (window as any).Server.schoolStudents;
				break;
			case TabTypes.ChildrenBookingBookedChildrenTab:
				service =  (window as any).Server.schoolClubAcceptableUsers;
				break;
		}

		return service;
	}

	search(selectedTabId: string, tabs: PlayerChoosersTabModel[], schoolId: string, requestFilter: any) {
		// TODO refactoring
		if(this.getCurrentTabType(selectedTabId, tabs) === TabTypes.ChildrenBookingBookedChildrenTab) {
			delete requestFilter.filter.where.formId;
			delete requestFilter.filter.where.houseId;
			delete requestFilter.filter.where.gender;
		}

		return this.getSearchService(selectedTabId, tabs).get(
			{
				schoolId:	schoolId,
				clubId:		this.clubId
			},
			requestFilter
		);
	}
}