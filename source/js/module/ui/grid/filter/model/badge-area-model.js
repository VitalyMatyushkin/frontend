/**
 * Created by Anatoly on 29.07.2016.
 */


/**
 * BadgeAreaModel
 *
 * @param {object} options
 *
 * */
const BadgeAreaModel = function(filter, badges){
	this.filter = filter;
	this.badges = typeof badges === 'undefined' ? {} : badges;

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
			this.filter.addLike(badge.field.name, badge.values[0]);
			break;
		case 'between-date':
			this.filter.addBetween(badge.field.name, badge.values);
			break;
		case 'between-date-time':
			this.filter.addBetween(badge.field.name, badge.values);
			break;			
		case 'multi-select':
			this.filter.addIn(badge.field.name, badge.values.map(item => item.key));
			break;
	}
};
BadgeAreaModel.prototype.deleteFilter = function(badge) {
	this.filter.deleteField(badge.field.name);
};


module.exports = BadgeAreaModel;
