/**
 * Created by Anatoly on 21.07.2016.
 */

const 	FilterModel = require('./filter/model/filter-model'),
		TableModel 	= require('./table/model/table-model');

/**
 * GridModel
 *
 * @param {object} options
 *
 * */
const GridModel = function(options){
	this.table = new TableModel(options.table);
	this.filter = new FilterModel(options.filters);
	this.filterPanel = null;
	this.actionPanel = null;

};

GridModel.prototype = {
};


module.exports = GridModel;

