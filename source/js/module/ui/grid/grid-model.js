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
	this.filter = new FilterModel(options.filters);
	options.table.onSort = this.filter.setOrder.bind(this.filter);
	this.table = new TableModel(options.table);
	this.filterPanel = null;
	this.actionPanel = null;

};


module.exports = GridModel;

