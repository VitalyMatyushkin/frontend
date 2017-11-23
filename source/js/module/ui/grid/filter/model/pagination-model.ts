/**
 * Created by Anatoly on 22.07.2016.
 */
import {FilterModel} from "module/ui/grid/filter/model/filter-model";

const 	HEADER_HEIGHT = 150,	// the value of scroll at which the button appears Up
		FOOTER_HEIGHT = 150;	// the value of indent bottom at which begins loading the next page of data.


export class PaginationModel {
    isLastPage: boolean;
    isLoading: boolean;
    currentPage: number;
    isScrolled: boolean;
    filter: FilterModel;
    onShowBtnUp: any;
    bindedOnScrollFunction: () => any;

    constructor(filter: FilterModel){
        this.isLastPage = false;
        this.isLoading = true;
        this.currentPage = 1;
        this.isScrolled = false;
        this.filter = filter;
        this.filter.onPageLoaded.on(this.onPageLoaded.bind(this));
        this.filter.onChange.on(this.onLoading.bind(this));

        this.onShowBtnUp = null;
    }

    nextPage(){
        this.isLoading = true;
        this.currentPage++;
        this.filter.setPageNumber(this.currentPage);
    }

    onPageLoaded(rowLoaded){
        this.currentPage = this.filter.skip / this.filter.limit + 1;
        this.isLastPage = this.filter.limit > rowLoaded;
        this.isLoading = false;
    }

    onLoading(){
        this.isLoading = true;
    }

    _onScroll(){
        if(!this.isScrolled && window.scrollY > HEADER_HEIGHT || this.isScrolled && window.scrollY < HEADER_HEIGHT){
            this.isScrolled = window.scrollY > HEADER_HEIGHT;
            this.onShowBtnUp && this.onShowBtnUp();
        }
        if(!this.isLastPage && !this.isLoading && (document.body.clientHeight - FOOTER_HEIGHT < window.scrollY + window.innerHeight)){
            this.nextPage();
        }
    }

    onScrollTop(){
        window.scrollTo(0, 0);
    }

    addListener(){
        this.bindedOnScrollFunction = this._onScroll.bind(this);
        window.addEventListener('scroll', this.bindedOnScrollFunction);
    }
    removeListeners(){
        window.removeEventListener('scroll', this.bindedOnScrollFunction);
        this.onShowBtnUp = null;
    };

}
