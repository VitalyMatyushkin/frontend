
const Immutable = require('immutable');

/**the number of lines on the page by default, if you do not explicitly set a different value.*/
const DEFAULT_PAGE_LIMIT = 20;

/**
 * Tiny wrapper on
 * @param binding
 * @constructor
 */
const Filter = function (binding) {
	this._binding = binding;
};

Filter.prototype.getFilters = function(){
	return this._binding.toJS();
};

Filter.prototype.getWhere = function(){
	const self = this,
		filters = self.getFilters();
	return filters ? filters.where: filters;
};

Filter.prototype.getPageLimit = function(){
	return this._binding.get('limit');
};

Filter.prototype.setFilters = function(value){
	const   self = this,
		transaction = self._binding.atomically();

	for(var key in value){
		transaction.set(key, Immutable.fromJS(value[key]));
	}
	transaction.commit({ notify: false });
};

Filter.prototype.setPageLimit = function(pageLimit){
	const self = this;
	let limit = self.getPageLimit();

	if(pageLimit)
		limit = pageLimit;
	else if(!limit)
		limit = DEFAULT_PAGE_LIMIT;

	self._binding.set('limit', limit);
};

Filter.prototype.setPageNumber = function(pageNumber){
	const self = this,
		limit = self.getPageLimit();

	!limit && console.error('Please provide page limit');

	self._binding.set('skip', (pageNumber-1)*limit);
};

Filter.prototype.addFieldFilter = function(field, value){
	const self = this;
	let where = self.getWhere();

	if(value)
		where = self._addLike(where, field, value);
	else
		where = self._deleteLike(field);

	self.setWhere(where);
};
Filter.prototype._addLike = function(where, field, value){
	if(!where) {
		where = {};
	}

	where[field] = {};
	where[field].like = value;
	where[field].options = 'i';

	return where;
};
Filter.prototype._deleteLike = function(field){
	const 	self 	= this,
		where 	= self.getWhere();

	if(where && where[field]){
		delete where[field];
	}
	return where;
};

Filter.prototype.setOrder = function(field, value){
	this._binding.set('order', field + ' ' + value);
};

Filter.prototype.setWhere = function(value){
	this._binding.set('where', Immutable.fromJS(value));
};

module.exports = Filter;