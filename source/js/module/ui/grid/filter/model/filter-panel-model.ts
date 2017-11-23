/**
 * ReCreated by wert on 19.11.2017.
 */

import {FilterFieldModel} from './filter-field-model';
import {BadgeAreaModel} from "./badge-area-model";
import {FilterModel} from "./filter-model";


export interface FilterPanelModelOptions {
    filter: FilterModel
    badges: any
    columns: any[]
}

export class FilterPanelModel {

    badgeArea: BadgeAreaModel;
    filterFields: FilterFieldModel[];

    constructor(options: FilterPanelModelOptions) {
        this.badgeArea = new BadgeAreaModel(options.filter, options.badges);
        this.filterFields = options.columns.filter(c => !!c.filter).map(column => {
            return new FilterFieldModel({
                column:column,
                badgeArea:this.badgeArea
            });
        });
    }
}

