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
	this.id = options.column.filter.id;
	this.typeOptions = options.column.filter.typeOptions;
	this.field = {
		name:options.column.cell.dataField,
		text:options.column.text
	};
	this.badgeArea = options.badgeArea;
};

FilterFieldModel.prototype.onChange = function(value){
	const badge = new BadgeModel(this);
	badge.values = this._setValue(value);
	this.badgeArea.changeBadge(badge);
};
FilterFieldModel.prototype.getBadge = function(){
	return this.badgeArea.badges[this.field.name];
};
FilterFieldModel.prototype._setValue = function(value){
	let res = null;

	switch (this.type){
		case 'string':
			res = this._setStringValue(value);
			break;
		case 'between-date':
			res = this._setBetweenDateValue(value);
			break;
		case 'between-date-time':
			res = this._setBetweenDateValue(value);
			break;
		case 'multi-select':
			res = this._setKeyValueArray(value);
			break;
	}
	return res;
};
FilterFieldModel.prototype._setStringValue = function(value){
	return value ? [value] : null;
};
FilterFieldModel.prototype._setBetweenDateValue = function(value){
	return value && value.length === 2 && (value[0] || value[1]) ? value : null;
};
FilterFieldModel.prototype._setKeyValueArray = function(value){
	return value && value.length > 0 ? value : null;
};


module.exports = FilterFieldModel;
