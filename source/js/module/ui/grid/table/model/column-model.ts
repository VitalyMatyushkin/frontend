/**
 * Created by Anatoly on 19.07.2016.
 */

import {CellModel, CellModelOptions} from "./cell-model";


/**
 * ColumnModel
 *
 * @param {object} options
 * 	{
 *		text:'',
 *		isSorted:false,
 *		hidden:false,
 *		onSort:null,
 *		width:null,
 *		cell:{
 *			type:'',
 *			typeOptions:{},
 *			dataField:''
 *		}
 *		filter:{
 *			type:'',
 *			typeOptions:{},
 *		}
 *	}
 *
 *
 *
 * */

export interface FilterTypeOptionsItem {
    key:    string
    value:  string
}

export interface ColumnModelOptions {
    text:       string
    isSorted:   boolean
    hidden:     boolean
    width:      any
    cell:       CellModelOptions
    filter:     {
        type: string,
        typeOptions: {
            items:          FilterTypeOptionsItem[],
            hideFilter:     boolean,
            hideButtons:    boolean
        },
        id: string
    }
    sort:       any
}

export class ColumnModel {

    text:       string;
    isSorted:   boolean;
    hidden:     boolean;
    width:      any;
    cell:       CellModel;
    filter:     any;
    sort:       any;

    constructor(options){
        this.text       = options.text;
        this.isSorted   = !!options.isSorted;
        this.hidden     = !!options.hidden;
        this.width      = options.width;
        this.cell       = new CellModel(options.cell);
        this.filter     = options.filter;

        this.sort = options.sort;
    }
}




