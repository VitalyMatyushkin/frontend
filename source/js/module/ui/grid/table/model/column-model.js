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
 *		hidden:false,
 *		onSort:null,
 *		width:null,
 *		cell:{
 *			type:'',
 *			typeOptions:{},
 *			dataField:''
 *		}
 *		filter:{
 *			type:'',
 *			typeOptions:{},
 *		}
 *	}
 *
 *
 *
 * */
const ColumnModel = function(options){
	this.text = options.text;
	this.isSorted = !!options.isSorted;
	this.hidden = !!options.hidden;
	this.width = options.width;
	this.cell = new CellModel(options.cell);
	this.filter = options.filter;

	this.sort = options.sort;
};


module.exports = ColumnModel;

