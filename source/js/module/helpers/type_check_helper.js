// @flow
/**
 * Created by Woland on 12.04.2017.
 */
const TypeCheckHelper = {
	isUndefined: function(value: any){
		return typeof value === 'undefined';
	},
	
	isNull: function(value: any){
		return value === null;
	}
};

module.exports = TypeCheckHelper;