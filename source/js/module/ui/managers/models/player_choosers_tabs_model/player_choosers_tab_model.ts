import * as RandomHelper from 'module/helpers/random_helper';
import { TabTypes } from "module/ui/managers/models/player_choosers_tabs_model/tab_types";

export interface PlayerChoosersTabModelOptions {
	text: string
	type: TabTypes
}

export class PlayerChoosersTabModel implements PlayerChoosersTabModelOptions {

	id: string;
	text: string;
	type: TabTypes;

	constructor(options: PlayerChoosersTabModelOptions) {
		this.id = RandomHelper.getRandomString();
		this.text = options.text;
		this.type = options.type;
	}
}