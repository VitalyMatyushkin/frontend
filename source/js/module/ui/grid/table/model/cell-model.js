/**
 * Created by Anatoly on 19.07.2016.
 */

/**
 * CellModel
 * */
const CellModel = function(options){
	this.type = options.type || 'string';
	this.typeOptions = options.typeOptions;
	this.dataField = options.dataField;
};

CellModel.prototype = {
	getValue:function(dataItem){
		return dataItem[this.dataField];
	}
};


module.exports = CellModel;