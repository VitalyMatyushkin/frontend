/**
 * Created by Anatoly on 29.07.2016.
 */


/**
 * BadgeModel
 *
 * @param {object} options
 *
 * */
const BadgeModel = function(options){
	this.field = {
		name:options.field.name,
		text:options.field.text
	};
	this.type = options.type;
	this.badgeArea = options.badgeArea;
	this.values = null; //an array of key-value pairs.
};


BadgeModel.prototype.onDelete = function(){
	this.values = null;
	this.badgeArea.changeBadge(this);
};

module.exports = BadgeModel;
