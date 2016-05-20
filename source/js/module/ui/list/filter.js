const Immutable = require('immutable');

const defaultPageLimit = 20;    // TODO: surprize!!! :))

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
    const   self    = this,
            filters = self.getFilters();
    return filters ? filters.where : filters;
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
        limit = defaultPageLimit;

    self._binding.set('limit', limit);
};

Filter.prototype.setPageNumber = function(pageNumber){
    const self = this,
        limit = self.getPageLimit();

    !limit && console.error('Filter: Please provide page limit');

    self._binding.set('skip', (pageNumber-1)*limit);
};

Filter.prototype.addFieldFilter = function(field, value){
    const self = this;
    let where = self._deleteLike(field);

    if(value)
        where = self._addLike(where, field, value);

    self.setWhere(where);
};

Filter.prototype._addLike = function(where, field, value){
    let filter = {};

    filter[field] = {};
    filter[field].like = value;
    filter[field].options = 'i';

    if(!where) {
        where = {};
    }
    if(!where.and) {
        where.and = [];
    }

    where.and.push(filter);
    return where;
};

Filter.prototype._deleteLike = function(field){
    const self = this;
    let i,
        where = self.getWhere();

    if(where && where.and){
        i = where.and.map(function(item){return Object.keys(item)[0];}).indexOf(field);
        i >= 0 && where.and.splice(i,1);
        if(where.and.length == 0)
            delete where.and;
        if(where.length == 0)
            where = undefined;
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