/**
 * ReCreated by wert on 18.11.2017.
 */

export interface ActionPanelModelOptions {
	title: string
	btnAdd?: any
    btnCSVExport?: any
    showStrip: boolean
    showSearch?: boolean
    showBtnPrint?: boolean
    showBtnLoad?: boolean
    hideBtnFilter?: boolean
    isFilterActive?: boolean
}

export class ActionPanelModel implements ActionPanelModelOptions {

    title: string;
    btnAdd?: any;
    btnCSVExport?: any;
    showStrip: boolean;
    showSearch?: boolean;
    showBtnPrint?: boolean;
    showBtnLoad?: boolean;
    hideBtnFilter?: boolean;
    isFilterActive?: boolean;
    onChange?: () => any;

	constructor(options: ActionPanelModelOptions) {
	    Object.assign(this, options);
	}

    toggleFilters() {
        this.isFilterActive = !this.isFilterActive;
        this.onChange && this.onChange();
    };

}