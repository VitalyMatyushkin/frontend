/**
 * Created by Anatoly on 19.07.2016.
 */

const propz = require('propz');

/**
 * CellModel
 * */
const CellModel = function(options){
	this.type = options.type || 'general';
	this.typeOptions = options.typeOptions;
	this.dataField 	= options.dataField;
	this.onEmpty 	= options.onEmpty || '';
};

CellModel.prototype = {
	getValue:function(dataItem){
		const 	fieldParts	= this.dataField.split('.'),
				result		= propz.get(dataItem, fieldParts, this.onEmpty);
		return result;
	}
};


module.exports = CellModel;