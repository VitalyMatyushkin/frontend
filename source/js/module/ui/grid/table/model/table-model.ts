/**
 * Created by Anatoly on 18.07.2016.
 */

import {ColumnModel, ColumnModelOptions} from './column-model';
import {SortModel} from './sort-model';

/**
 * TableModel
 *
 * @param {object} options
 * {
 * 		data:[],
 * 		columns:[],
 * 		sort:{}
 * }
 *
 * */

export interface TableModelOptions {
    data?: any[];
    onSort: any;
    columns: ColumnModelOptions[];
}

export class TableModel {

    data: any[];
    sort: SortModel;
    columns: ColumnModel[];

    constructor(options: TableModelOptions){
	    this.data = options.data || [];
        this.sort = new SortModel(options.onSort);
        this.columns = options.columns ? options.columns.filter(c => !c.hidden).map(c => {
            c.sort = this.sort;
            return new ColumnModel(c);
        }) : [];
    }
}