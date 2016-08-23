/**
 * Created by Anatoly on 22.07.2016.
 */


/**
 * PaginationModel
 *
 * @param {FilterModel} filter
 *
 * */
const PaginationModel = function(filter){
	this.isLastPage = false;
	this.isLoading = true;
	this.currentPage = 1;
	this.filter = filter;
	this.filter.onPageLoaded.on(this.onPageLoaded.bind(this));
	this.filter.onChange.on(this.onLoading.bind(this));
};

PaginationModel.prototype.nextPage = function(){
	this.currentPage++;
	this.filter.setPageNumber(this.currentPage);
};
PaginationModel.prototype.onPageLoaded = function(rowLoaded){
	this.currentPage = this.filter.skip / this.filter.limit + 1;
	this.isLastPage = this.filter.limit > rowLoaded;
	this.isLoading = false;
};
PaginationModel.prototype.onLoading = function(){
	this.isLoading = true;
};


module.exports = PaginationModel;
