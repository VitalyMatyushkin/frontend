/**
 * Created by Anatoly on 05.01.2016.
 */

var filter;


filter = function (binding) {
    var self = this;

    self._binding = binding;
    self.filters = {};
    self.isPaginated = false;
    self.pageLimit = 20;
    self.rowsSkip = 0;
};

filter.prototype.getDefaultBinding = function(){
    return this._binding;
};

filter.prototype.getWhere = function(){
    return  this.filters.where ? this.filters.where : '';
};

filter.prototype.getFilters = function(){
    var self = this;

    if(self.isPaginated){
        self.filters.skip = self.rowsSkip;
        self.filters.limit = self.pageLimit;
    }

    return self.filters;
};

filter.prototype.setPageNumber = function(pageNumber){
    var self = this;

    self.rowsSkip = (pageNumber-1)*self.pageLimit;
};

filter.prototype.setFileldFilter = function(field, value){
    var self = this;

    if(!self.filters.where)
        self.filters.where = {};

    self.filters.where[field] = value;
};

filter.prototype.setOrder = function(field, value){
    var self = this;

    self.filters.order = value;
};



module.exports = filter;