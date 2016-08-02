/**
 * Created by Anatoly on 26.07.2016.
 */

/**
 * SortModel
 * */
const SortModel = function(onChangeHandler){
	this.dataField = null;
	this.value = null;

	this.onChange = onChangeHandler;
};

SortModel.prototype.onSort = function(dataField){
	if(this.dataField === dataField){
		this.value = this.value === 'ASC' ? 'DESC' : 'ASC';
	}else{
		this.dataField = dataField;
		this.value = 'ASC';
	}

	this.onChange && this.onChange(this.dataField, this.value);
};


module.exports = SortModel;