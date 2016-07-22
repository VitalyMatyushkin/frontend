/**
 * Created by Anatoly on 21.07.2016.
 */

const 	DataLoader 	= require('./data-loader'),
		FilterModel = require('./filter/model/filter-model'),
		TableModel 	= require('./table/model/table-model');

/**
 * GridModel
 *
 * @param {object} options
 *
 * */
const GridModel = function(options){
	this.table = new TableModel(options.table);
	this.filter = new FilterModel();
	this.dataLoader = new DataLoader(options.dataLoader, this.table);
};

GridModel.prototype = {
};


module.exports = GridModel;

