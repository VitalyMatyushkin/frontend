/**
 * Created by Anatoly on 05.01.2016.
 */

const defaultPageLimit = 20;

const filter = function (binding) {
    var self = this;

    self._binding = binding;
};

filter.prototype.getDefaultBinding = function(){
    return this._binding;
};

filter.prototype.getWhere = function(){
    return  this.where ? this.where : '';
};

filter.prototype.getFilters = function(){
    var self = this,
        res = {};

    for(var key in self){
        if(key[0] !== '_' && typeof(self[key]) !== 'function'){
            res[key] = self[key];
        }
    }

    return res;
};

filter.prototype.setFilters = function(value){
    var self = this;

    for(var key in value){
        self[key] = value[key];
        self._binding.set(key, self[key]);
    }
};

filter.prototype.setPageLimit = function(pageLimit){
    var self = this;

    if(pageLimit)
        self.limit = pageLimit;
    else
        self.limit = defaultPageLimit;
    self._binding.set('limit', self.limit);
};

filter.prototype.setPageNumber = function(pageNumber){
    var self = this;
    !self.limit && console.error('Please provide page limit');

    self.skip = (pageNumber-1)*self.limit;
    self._binding.set('skip', self.skip);
};

filter.prototype.addFieldFilter = function(field, value){
    var self = this;

    if(!self.where)
        self.where = {};

    self.where[field] = value;

    self._binding.set('where', self.where);
};

filter.prototype.setOrder = function(field, value){
    var self = this;

    self.order = value;
    self._binding.set('order', self.order);
};

filter.prototype.setInclude = function(value){
    var self = this;

    self.include = value;
    self._binding.set('include', self.include);
};

filter.prototype.setWhere = function(value){
    var self = this;

    self.where = value;
    self._binding.set('where', self.where);
};



module.exports = filter;