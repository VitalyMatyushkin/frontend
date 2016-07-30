/**
 * Created by Anatoly on 22.07.2016.
 */

const FilterFieldModel = require(''),
	BadgeAreaModel = require('');


/**
 * FilterPanelModel
 *
 * @param {object} options
 *
 * */
const FilterPanelModel = function(options){
	this.badgeArea = new BadgeAreaModel(options.filter);
	this.filterFields = options.columns.filter(c => !!c.filter).map(column => {
		return new FilterFieldModel({
			column:column,
			badgeArea:this.badgeArea
		});
	});
};


module.exports = FilterPanelModel;
