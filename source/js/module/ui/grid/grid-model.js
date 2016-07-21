/**
 * Created by Anatoly on 21.07.2016.
 */

/**
 * GridModel
 *
 * @param {object} options
 *
 * */
const GridModel = function(options){
	this.table = options.table;
	this.filter = options.typeOptions;
	this.dataField = options.dataField;
};

GridModel.prototype = {
	getValue:function(dataItem){
		return dataItem[this.dataField];
	}
};


module.exports = GridModel;