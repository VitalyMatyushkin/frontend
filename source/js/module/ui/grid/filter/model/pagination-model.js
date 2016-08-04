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
	this.currentPage = 1;
	this.filter = filter;
	this.filter.onPageLoaded = this.onPageLoaded.bind(this);
};

PaginationModel.prototype.nextPage = function(){
	this.currentPage++;
	this.filter.setPageNumber(this.currentPage);
};
PaginationModel.prototype.onPageLoaded = function(rowLoaded){
	this.isLastPage = this.filter.limit > rowLoaded;
};


module.exports = PaginationModel;
