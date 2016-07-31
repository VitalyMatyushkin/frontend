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
};

FilterFieldModel.prototype.onChange = function(e){
	const badge = new BadgeModel(this);
	badge.values = this._setValue(e);
	this.badgeArea.changeBadge(badge);

	e.stopPropagation();
};
FilterFieldModel.prototype.getBadge = function(){
	return this.badgeArea.badges[this.field.name];
};
FilterFieldModel.prototype._setValue = function(e){
	let res = null;

	switch (this.type){
		case 'string':
			res = this._setStringValue(e);
			break;
	}
	return res;
};
FilterFieldModel.prototype._setStringValue = function(e){
	return e.target.value ? [e.target.value] : null;
};


module.exports = FilterFieldModel;
