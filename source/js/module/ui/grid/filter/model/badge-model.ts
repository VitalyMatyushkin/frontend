/**
 * Created by Anatoly on 29.07.2016.
 */

export interface BadgeModelOptionsField {
    name: string
    text: string
}

export interface BadgeModelOptions {
    field: BadgeModelOptionsField
    type: 'between-date' | 'between-date-time' | 'multi-select' | 'string';
    badgeArea: any      // TODO

}

export class BadgeModel {

    field: BadgeModelOptionsField;
    type: 'between-date' | 'between-date-time' | 'multi-select' | 'string';
    badgeArea: any;
    values: any;

    constructor(options: BadgeModelOptions) {
        this.field = {
            name: options.field.name,
            text: options.field.text
        };
        this.type = options.type;
        this.badgeArea = options.badgeArea;
        this.values = null; //an array of key-value pairs.
    }

    onDelete(){
        this.values = null;
        this.badgeArea.changeBadge(this);
    };
}