/**
 * ReCreated by wert on 19.11.2017.
 */
import {FilterModel} from "./filter-model";


export class BadgeAreaModel {
    filter: FilterModel;
    onChange: any;
    badges: any;

    constructor(filter: FilterModel, badge) {
        this.filter = filter;
        this.initBadges(badge);

        this.onChange = null;
    }

    initBadges(badge): void {
        if(typeof badge === 'undefined') {
            this.badges = {};
        } else {
            this.badges = this.connectBadgesToCurrentBadgeArea(badge.badges);
        }
    }

    /**
     * BadgeAreaModel constructor has arg badge it's badge from old BadgeArea.
     * Badge has reference to badge area.
     * Function update reference to BadgeAreaModel.
     * Change it from old BadgeAreaModel to current.
     * @param badges
     * @returns {*}
     */
    connectBadgesToCurrentBadgeArea(badges) {
        for(let fieldName in badges) {
            badges[fieldName].badgeArea = this;
        }

        return badges;
    }

    changeBadge(badge) {
        if (badge.values){
            this.badges[badge.field.name] = badge;	// set badge
            this.setFilter(badge);
        }
        else {
            delete this.badges[badge.field.name];	// delete badge
            this.deleteFilter(badge);
        }

        this.onChange && this.onChange();
    }

    setFilter(badge) {
        switch (badge.type){
            case 'string':
                this.filter.addLike(badge.field.name, badge.values[0]);
                break;
            case 'between-date':
                this.filter.addBetween(badge.field.name, badge.values);
                break;
            case 'between-date-time':
                this.filter.addBetween(badge.field.name, badge.values);
                break;
            case 'multi-select':
                this.filter.addIn(badge.field.name, badge.values.map(item => item.key));
                break;
        }
    }

    deleteFilter(badge) {
        this.filter.deleteField(badge.field.name);
    }
}