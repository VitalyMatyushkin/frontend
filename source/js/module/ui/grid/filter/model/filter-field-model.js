/**
 * Created by Anatoly on 29.07.2016.
 */


/**
 * FilterFieldModel
 *
 * @param {object} options
 *
 * */
const FilterFieldModel = function(options){
	this.type = options.column.filter.type;
	this.typeOptions = options.column.filter.typeOptions;
	this.field = {
		name:options.column.cell.dataField,
		text:options.column.text
	};
	this.badgeArea = options.badgeArea;
};


module.exports = FilterFieldModel;
