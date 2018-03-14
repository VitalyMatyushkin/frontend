/**
 * Created by Anatoly on 29.07.2016.
 */

import {BadgeModel} from './badge-model';
import {BadgeModelOptionsField} from "module/ui/grid/filter/model/badge-model"; // TODO: ???? why there
import {BadgeAreaModel} from "module/ui/grid/filter/model/badge-area-model";

export interface _Filter {
    type: 'string' | 'between-date' | 'between-date-time' | 'multi-select';
    id: any;
    typeOptions: any;
    field: BadgeModelOptionsField;
}

export interface Column {
    filter: _Filter
    cell: any
    text: string
}


export interface FilterFieldModelOptions {
    column: Column
    badgeArea: BadgeAreaModel;
}

export class FilterFieldModel {

    type: 'string' | 'between-date' | 'between-date-time' | 'multi-select';
    id: any;
    typeOptions: any;
    field: BadgeModelOptionsField;
    badgeArea: any;

    constructor(options: FilterFieldModelOptions){
        this.type = options.column.filter.type;
        this.id = options.column.filter.id;
        this.typeOptions = options.column.filter.typeOptions;
        this.field = {
            name:options.column.cell.dataField,
            text:options.column.text
        };
        this.badgeArea = options.badgeArea;
    }

    onChange(value){
        const badge = new BadgeModel(this);
        badge.values = this._setValue(value);
        this.badgeArea.changeBadge(badge);
    }

    getBadge(){
        return this.badgeArea.badges[this.field.name];
    }

    _setValue(value){
        switch (this.type){
            case 'string':
                return this._setStringValue(value);
            case 'between-date':
                return this._setBetweenDateValue(value);
            case 'between-date-time':
                return this._setBetweenDateValue(value);
            case 'multi-select':
                return this._setKeyValueArray(value);
        }
    }

    _setStringValue(value): [any] | null {
        return value ? [value] : null;
    }

    _setBetweenDateValue(value){
        return value && value.length === 2 && (value[0] || value[1]) ? value : null;
    }

    _setKeyValueArray(value){
        return value && value.length > 0 ? value : null;
    };
}
