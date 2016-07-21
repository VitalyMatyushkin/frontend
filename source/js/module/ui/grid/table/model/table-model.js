/**
 * Created by Anatoly on 18.07.2016.
 */

const ColumnModel = require('./column-model');

/**
 * TableModel
 *
 * @param {object} options
 * {
 * 		data:[],
 * 		columns:[],
 * 		order:{}
 * }
 *
 * */
const TableModel = function(options){
	this.data = options.data || [];
	this.columns = options.columns ? options.columns.map(c => new ColumnModel(c)) : [];
	this.order = options.order;
};

TableModel.prototype = {
};


module.exports = TableModel;
