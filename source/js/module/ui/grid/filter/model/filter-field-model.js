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
	this.type = options.type;
	this.typeOptions = options.typeOptions;
	this.field = {
		name:options.field.name,
		text:options.field.text
	};
};


module.exports = FilterFieldModel;
