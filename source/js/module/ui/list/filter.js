/**
 * Created by Anatoly on 05.01.2016.
 */

var fiter = function(binding){
    var self = this;

    self._binding = binding;
    self.filters = {};
    self.pageLimit = 20;
    self.pageNumber = 1;
};

fiter.prototype.getDefaultBinding = function(){
    return this._binding;
};

fiter.prototype.getFiltersWithoutPaging = function(){
    var self = this,
        f =  self.getFilters(),
        skip = (self.pageNumber-1)*self.pageLimit;

    f.skip = skip;
    f.limit = self.pageLimit;

    return f;
};

fiter.prototype.getFilters = function(){
    return this.filters;
};
fiter.prototype.setPageLimit = function(pageLimit){
    this.pageLimit = pageLimit;
};
fiter.prototype.setPageNumber = function(pageNumber){
    this.pageNumber = pageNumber;
};


module.export = filter;