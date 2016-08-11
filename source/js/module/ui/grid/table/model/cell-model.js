/**
 * Created by Anatoly on 19.07.2016.
 */

/**
 * CellModel
 * */
const CellModel = function(options){
	this.type = options.type || 'general';
	this.typeOptions = options.typeOptions;
	this.dataField = options.dataField;
};

CellModel.prototype = {
	getValue:function(dataItem){
		const fieldParts = this.dataField.split('.');
		let result = dataItem;

		fieldParts.forEach(key => {
			result = result[key];
		});

		return result;
	}
};


module.exports = CellModel;