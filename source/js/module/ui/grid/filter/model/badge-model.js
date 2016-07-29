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
	this.values = []; //an array of key-value pairs.
};


module.exports = BadgeModel;
