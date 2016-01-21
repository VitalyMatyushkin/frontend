
const Immutable = require('immutable');

const defaultPageLimit = 20;

const filter = function (binding) {
    this._binding = binding;
};

filter.prototype.getFilters = function(){
    return this._binding.toJS();
};

filter.prototype.getWhere = function(){
    const self = this,
        filters = self.getFilters();
    return filters ? filters.where: filters;
};

filter.prototype.getPageLimit = function(){
    return this._binding.get('limit');
};

filter.prototype.setFilters = function(value){
    const   self = this,
            transaction = self._binding.atomically();

    for(var key in value){
        transaction.set(key, value[key]);
    }
    transaction.commit({ notify: false });
};

filter.prototype.setPageLimit = function(pageLimit){
    const self = this;
    let limit = self.getPageLimit();

    if(pageLimit)
        limit = pageLimit;
    else if(!limit)
        limit = defaultPageLimit;

    self._binding.set('limit', limit);
};

filter.prototype.setPageNumber = function(pageNumber){
    const self = this,
        limit = self.getPageLimit();

    !limit && console.error('Please provide page limit');

    self._binding.set('skip', (pageNumber-1)*limit);
};

filter.prototype.addFieldFilter = function(field, value){
    const self = this;
    let where = self._deleteLike(field);

    if(value)
        where = self._addLike(where, field, value);

    self.setWhere(where);
};

filter.prototype._addLike = function(where, field, value){
    let filter = {};

    filter[field] = {};
    filter[field].like = value;

    if(!where) {
        where = {};
        where.and = [];
    }

    where.and.push(filter);
    return where;
};

filter.prototype._deleteLike = function(field){
    const self = this;
    let i,
        where = self.getWhere();

    if(where && where.and){
        i = where.and.map(function(item){return Object.keys(item)[0];}).indexOf(field);
        i >= 0 && where.and.splice(i,1);
        if(where.and.length == 0)
            where = undefined;
    }
    return where;
};
filter.prototype.setOrder = function(field, value){
    this._binding.set('order', field + value);
};

filter.prototype.setWhere = function(value){
    this._binding.set('where', Immutable.fromJS(value));
};

module.exports = filter;