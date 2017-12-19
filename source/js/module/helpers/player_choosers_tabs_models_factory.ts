import { ManagerTypes } from "module/ui/managers/helpers/manager_types";
import { PlayerChoosersTabsModel } from "module/ui/managers/models/player_choosers_tabs_model/player_choosers_tabs_model";
import { PlayerChoosersTabModel } from "module/ui/managers/models/player_choosers_tabs_model/player_choosers_tab_model";
import { TabTypes } from "module/ui/managers/models/player_choosers_tabs_model/tab_types";

export const PlayerChoosersTabsModelFactory = {
	createTabsModelByManagerType(managerType: ManagerTypes) {
		let tabsModel;

		switch (managerType) {
			case ManagerTypes.Default: {
				const tabs = [
					new PlayerChoosersTabModel( { type: TabTypes.DefaultTab, text: '' } )
				];

				tabsModel = new PlayerChoosersTabsModel( { tabs: tabs, isShowTabs: false } );
				break;
			}
			case ManagerTypes.ChildrenBooking: {
				const tabs = [
					new PlayerChoosersTabModel({
						type: TabTypes.ChildrenBookingAllChildrenTab,
						text: 'All Children'
					}),
					new PlayerChoosersTabModel({
						type: TabTypes.ChildrenBookingBookedChildrenTab,
						text: 'Children Booking'
					}),
				];

				tabsModel = new PlayerChoosersTabsModel( { tabs: tabs, isShowTabs: true } );

				break;
			}
		}

		return tabsModel;
	}
};