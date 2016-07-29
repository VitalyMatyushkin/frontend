/**
 * Created by Anatoly on 21.07.2016.
 */

const 	FilterModel 	= require('./filter/model/filter-model'),
		PaginationModel = require('./filter/model/pagination-model'),
		TableModel 		= require('./table/model/table-model');

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
	this.pagination = new PaginationModel(this.filter);
	this.filterPanel = null;
	this.actionPanel = null;

};

GridModel.prototype.setData = function(data){
	this.table.data = this.table.data.concat(data);
};


module.exports = GridModel;

