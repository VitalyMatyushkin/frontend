/**
 * Created by Anatoly on 19.07.2016.
 */

const CellModel = require('./cell-model');

/**
 * ColumnModel
 *
 * @param {object} options
 * 	{
 *		text:'',
 *		isSorted:false,
 *		onSort:null,
 *		width:null,
 *		cell:{
 *			type:'',
 *			typeOptions:{},
 *			dataField:''
 *		}
 *	}
 *
 *
 *
 * */
const ColumnModel = function(options){
	this.text = options.text;
	this.isSorted = !!options.isSorted;
	this.width = options.width;
	this.cell = new CellModel(options.cell);

	this.onSort = options.onSort ? options.onSort : this.onSort;
};

ColumnModel.prototype = {
	onSort:function(dataField, sortValue){
		console.error('Method column.onSort not initialized! Field:' + dataField)
	}
};


module.exports = ColumnModel;