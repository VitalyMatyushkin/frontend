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
	this.lastPage = -1;
	this.currentPage = 1;
	this.filter = filter;
	this.filter.onLastPageLoaded = this.onLastPageLoaded.bind(this);
	this.filter.onPageLoaded = this.onPageLoaded.bind(this);
	this.isLoaded = false;
};

PaginationModel.prototype.nextPage = function(){
	this.currentPage++;
	this.filter.setPageNumber(this.currentPage);
};
PaginationModel.prototype.onLastPageLoaded = function(){
	this.lastPage = this.currentPage;
};
PaginationModel.prototype.onPageLoaded = function(){
	this.isLoaded = true;
};


module.exports = PaginationModel;
