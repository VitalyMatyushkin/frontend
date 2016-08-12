/**
 * Created by Anatoly on 18.07.2016.
 */

const 	ColumnModel = require('./column-model'),
		SortModel 	= require('./sort-model');

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
const TableModel = function(options){
	this.data = options.data || [];
	this.sort = new SortModel(options.onSort);
	this.columns = options.columns ? options.columns.filter(c => !c.hidden).map(c => {
		c.sort = this.sort;
		return new ColumnModel(c);
	}) : [];
};

TableModel.prototype = {
};


module.exports = TableModel;
