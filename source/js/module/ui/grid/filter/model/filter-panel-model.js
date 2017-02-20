/**
 * Created by Anatoly on 22.07.2016.
 */

const 	FilterFieldModel 	= require('./filter-field-model'),
		BadgeAreaModel 		= require('./badge-area-model');

/**
 * FilterPanelModel
 *
 * @param {object} options
 *
 * */
const FilterPanelModel = function(options){
	this.badgeArea = new BadgeAreaModel(options.filter, options.badges);
	this.filterFields = options.columns.filter(c => !!c.filter).map(column => {
		return new FilterFieldModel({
			column:column,
			badgeArea:this.badgeArea
		});
	});
};


module.exports = FilterPanelModel;
