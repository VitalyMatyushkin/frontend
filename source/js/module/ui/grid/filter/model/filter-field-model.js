/**
 * Created by Anatoly on 29.07.2016.
 */
const BadgeModel = require('./badge-model');

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
	this.badge = null;
};

FilterFieldModel.prototype.onChange = function(e){
	this.badge = new BadgeModel(this);
	this.badge.values = this.setValue(e);
	this.badgeArea.changeBadge(this.badge);
};
FilterFieldModel.prototype.setValue = function(e){
	let res = null;

	switch (this.type){
		case 'string':
			res = this.setStringValue(e);
			break;
	}
};
FilterFieldModel.prototype.setStringValue = function(e){
	return [e.target.value];
};


module.exports = FilterFieldModel;
