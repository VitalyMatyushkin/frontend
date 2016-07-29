/**
 * Created by Anatoly on 22.07.2016.
 */

/**
 * FilterModel
 *
 * @param {object} options
 *
 * */
const FilterModel = function(options){
	this.where = options.where;
	this.limit = options.limit;
	this.skip = options.skip;
	this.order = options.order;

	this.onChange = options.onChange;
	this.lastPageIsLoaded = options.lastPageIsLoaded;
};

FilterModel.prototype = {
	getFilters: function () {
		const result = {filter:{}},
			filter = result.filter;

		if (this.where) {
			filter.where = this.where;
		}
		if (this.limit) {
			filter.limit = this.limit;
		}
		if (this.skip) {
			filter.skip = this.skip;
		}
		if (this.order) {
			filter.order = this.order;
		}

		return result;
	},
	setPageNumber: function (pageNumber) {
		if(this.limit){
			this.skip = (pageNumber - 1) * this.limit;
			this._onChange();
		} else {
			console.error('Filter: Please provide page limit');
		}

	},
	setNumberOfLoadedRows:function(count){
		if(count < this.limit){
			this.lastPageIsLoaded && this.lastPageIsLoaded()
		}
	},
	setOrder: function (field, value) {
		this.order = field + ' ' + value;
		this._onChange();
	},
	addFieldFilter: function (field, value) {
		if (value)
			this._addLike(field, value);
		else
			this._deleteLike(field);

		this._onChange();
	},
	_addLike: function (field, value) {
		if (!this.where) {
			this.where = {};
		}

		this.where[field] = {};
		this.where[field].like = value;
		this.where[field].options = 'i';

		return this.where;
	},
	_deleteLike: function (field) {
		if (this.where && this.where[field]) {
			delete this.where[field];
		}
		return this.where;
	},
	_onChange:function(){
		this.onChange && this.onChange(this.getFilters());
	}
};


module.exports = FilterModel;
