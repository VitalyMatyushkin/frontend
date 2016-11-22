/**
 * Created by Anatoly on 19.07.2016.
 */

/**
 * CellModel
 * */
const CellModel = function(options){
	this.type = options.type || 'general';
	this.typeOptions = options.typeOptions;
	this.dataField 	= options.dataField;
	this.onEmpty 	= options.onEmpty || '';
};

CellModel.prototype = {
	getValue:function(dataItem){
		const fieldParts = this.dataField.split('.');
		let result = dataItem;

		for(let i = 0, len = fieldParts.length; i < len; i++) {
			const key = fieldParts[i];
			if(typeof result !== 'undefined') {
				result = result[key];
			} else {
				result = this.onEmpty;
				break;
			}
		}

		return result;
	}
};


module.exports = CellModel;