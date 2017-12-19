import { PlayerChoosersTabModel } from "module/ui/managers/models/player_choosers_tabs_model/player_choosers_tab_model";

export interface PlayerChoosersTabsModelOptions {
	tabs:       PlayerChoosersTabModel[]
	isShowTabs: boolean
}

export class PlayerChoosersTabsModel implements PlayerChoosersTabsModelOptions {

	tabs:       PlayerChoosersTabModel[];
	isShowTabs: boolean;

	constructor(options) {
		this.tabs = options.tabs;
		this.isShowTabs = options.isShowTabs;
	}
}