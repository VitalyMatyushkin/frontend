/**
 * Created by Anatoly on 22.07.2016.
 */

const 	HEADER_HEIGHT = 150,	// the value of scroll at which the button appears Up
		FOOTER_HEIGHT = 150;	// the value of indent bottom at which begins loading the next page of data.


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
	this.isScrolled = false;
	this.filter = filter;
	this.filter.onPageLoaded.on(this.onPageLoaded.bind(this));
	this.filter.onChange.on(this.onLoading.bind(this));

	this.onShowBtnUp = () => {};
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
PaginationModel.prototype._onScroll = function(){
	if(!this.isScrolled && window.scrollY > HEADER_HEIGHT || this.isScrolled && window.scrollY < HEADER_HEIGHT){
		this.isScrolled = window.scrollY > HEADER_HEIGHT;
		this.onShowBtnUp();
	}
	if(document.body.clientHeight - FOOTER_HEIGHT < window.scrollY + window.innerHeight){
		!this.isLastPage && this.nextPage();
	}
};
PaginationModel.prototype.onScrollTop = function(){
	window.scrollTo(0, 0);
};
PaginationModel.prototype.addListener = function(){
	window.addEventListener('scroll', this._onScroll.bind(this));
};
PaginationModel.prototype.removeListener = function(){
	window.removeEventListener('scroll', this._onScroll.bind(this));
};


module.exports = PaginationModel;
