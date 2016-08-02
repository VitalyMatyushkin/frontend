/**
 * Created by Anatoly on 22.07.2016.
 */


/**the number of lines on the page by default, if you do not explicitly set a different value.*/
const DEFAULT_PAGE_LIMIT = 20;

/**
 * FilterModel
 *
 * @param {object} options
 *
 * */
const FilterModel = function(options){
	this.where = options.where;
	this.limit = options.limit || DEFAULT_PAGE_LIMIT;
	this.skip = 0;
	this.order = options.order;
	this.isChangePage = false;

	this.onChange = options.onChange;
	this.onPageLoaded = options.onPageLoaded;
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
			this._onChangePage();
		} else {
			console.error('Filter: Please provide page limit');
		}

	},
	setNumberOfLoadedRows:function(count){
		this.onPageLoaded && this.onPageLoaded(count);
		this.skip = 0;
		this.isChangePage = false;
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
	},
	_onChangePage:function(){
		this.onChange && this.onChange(this.getFilters());
		this.isChangePage = true;
	}
};


module.exports = FilterModel;
