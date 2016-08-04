/**
 * Created by Anatoly on 29.07.2016.
 */


/**
 * BadgeAreaModel
 *
 * @param {object} options
 *
 * */
const BadgeAreaModel = function(filter){
	this.filter = filter;
	this.badges = {};

	this.onChange = null;
};

BadgeAreaModel.prototype.changeBadge = function(badge) {
	if (badge.values){
		this.badges[badge.field.name] = badge;	// set badge
		this.setFilter(badge);
	}
	else {
		delete this.badges[badge.field.name];	// delete badge
		this.deleteFilter(badge);
	}

	this.onChange && this.onChange();
};
BadgeAreaModel.prototype.setFilter = function(badge) {
	switch (badge.type){
		case 'string':
			this.filter.addFieldFilter(badge.field.name, badge.values[0]);
			break;
	}
};
BadgeAreaModel.prototype.deleteFilter = function(badge) {
	switch (badge.type){
		case 'string':
			this.filter.addFieldFilter(badge.field.name, null);
			break;
	}
};


module.exports = BadgeAreaModel;
