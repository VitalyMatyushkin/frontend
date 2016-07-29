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
	this.filter.lastPageIsLoaded = this.onLastPageIsLoaded.bind(this);
};

PaginationModel.prototype.nextPage = function(){
	this.currentPage++;
	this.filter.setPageNumber(this.currentPage);
};
PaginationModel.prototype.onLastPageIsLoaded = function(){
	this.lastPage = this.currentPage;
};


module.exports = PaginationModel;
