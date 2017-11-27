/**
 * Created by Anatoly on 19.07.2016.
 */

import * as propz from 'propz';

export interface CellModelOptions {
    type:           string
    typeOptions:    any
    dataField:      string
    onEmpty:        any
}

export class CellModel implements CellModelOptions {

    type:           string;
    typeOptions:    any;
    dataField:      string;
    onEmpty:        any;

    constructor(options: CellModelOptions) {
        this.type = options.type || 'general';
        this.typeOptions = options.typeOptions;
        this.dataField 	= options.dataField;
        this.onEmpty 	= options.onEmpty || '';
    }

    getValue(dataItem){
        const 	fieldParts	= this.dataField.split('.'),
                result		= propz.get(dataItem, fieldParts, this.onEmpty);
        return result;
    }
}
