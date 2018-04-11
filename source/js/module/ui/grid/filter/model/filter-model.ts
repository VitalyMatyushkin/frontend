/**
 * Created by Anatoly on 22.07.2016.
 */

import * as EventProperty from 'module/core/event-property';
import * as DateTime from 'module/ui/form/types/datetime';
import {DateHelper} from "module/helpers/date_helper";

/**the number of lines on the page by default, if you do not explicitly set a different value.*/
const DEFAULT_PAGE_LIMIT = 20;

export interface FilterModelOptions {
    where?: any
    limit?: number
    skip?: number
    order?: any
    onChange?: any
    onPageLoaded?: any
}

export class FilterModel {

    where?: any;
    limit?: number;
    skip?: number;
    order?: any;
    onChange?: any;
    onPageLoaded?: any;

    isChangePage: any;

    constructor(options?: FilterModelOptions) {
	    this.where = options && options.where;
        this.limit = options && options.limit || DEFAULT_PAGE_LIMIT;
        this.skip = 0;
        this.order = options && options.order;
        this.isChangePage = false;

        this.onChange = new EventProperty();
        options && this.onChange.on(options.onChange);
        this.onPageLoaded = new EventProperty();
        options && this.onPageLoaded.on(options.onPageLoaded);
    }

    getFilters() {
        const   result = { filter:{} },
                filter: any = result.filter;

        if (this.where) {
            filter.where = this.where;
        }
        if (this.limit) {
            filter.limit = this.limit;
        }
        if (this.skip) {
            filter.skip = this.skip;
        }
        if (this.order) {
            filter.order = this.order;
        }

        return result;
    }

    setPageNumber(pageNumber: number): void {
        this.skip = (pageNumber - 1) * this.limit;
        this._onChangePage();
    }

    setNumberOfLoadedRows(count: number): void {
        this.onPageLoaded.trigger(count);
        this.skip = 0;
        this.isChangePage = false;
    }

    setOrder(field: string, value): void {
        this.order = field + ' ' + value;
        this._onChange();
    }

    addLike(field: string, value): void {
        if (!this.where) {
            this.where = {};
        }

        this.where[field] = {};
        this.where[field].like = value;
        this.where[field].options = 'i';

        this._onChange();
    }

    addBetween(field: string, values): void {
        if (!this.where) {
            this.where = {};
        }
        if (!this.where[field]) {
            this.where[field] = {};
        }

        if (values[0]){
            this.where[field].$gte = DateHelper.getFormatDateTimeUTCStringByRegion(values[0], 'GB');
        } else if(this.where[field].$gte){
            delete this.where[field].$gte;
        }
        if (values[1]){
            this.where[field].$lte = DateHelper.getFormatDateTimeUTCStringByRegion(values[1], 'GB');
        } else if(this.where[field].$lte){
            delete this.where[field].$lte;
        }

        this._onChange();
    }

    addIn(field: string, values): void {
        if (!this.where) {
            this.where = {};
        }
        if (!this.where[field]) {
            this.where[field] = {};
        }

        if (values && values.length > 0){
            this.where[field].$in = values;
        } else if(this.where[field].$in ){
            delete this.where[field].$in;
        }

        this._onChange();
    }

    deleteField(field: string): void {
        if (this.where && this.where[field]) {
            delete this.where[field];
        }
        if (this.where && Object.keys(this.where).length === 0) {
            delete this.where;
        }

        this._onChange();
    }

    _onChange(){
        this.onChange.trigger(this.getFilters());
    }

    _onChangePage(){
        this.isChangePage = true;
        this._onChange();
    }

}
