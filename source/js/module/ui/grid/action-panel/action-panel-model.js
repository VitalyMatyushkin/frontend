/**
 * Created by Anatoly on 22.07.2016.
 */


/**
 * ActionPanelModel
 *
 * @param {object} options
 *
 * */
const ActionPanelModel = function(options){
	this.title = options.title;
	this.btnAdd = options.btnAdd;
	this.btnCSVExport = options.btnCSVExport;
	this.showStrip = !!options.showStrip;
	//TODO Where was "showStrip" used?
	this.showSearch = !!options.showSearch;
	//TODO Where was "showBtnPrint" used?
	this.showBtnPrint = !!options.showBtnPrint;
	//TODO Where was "showBtnLoad" used?
	this.showBtnLoad = !!options.showBtnLoad;
	this.hideBtnFilter = !!options.hideBtnFilter;
	this.isFilterActive = false;

	this.onChange = null;
};

ActionPanelModel.prototype.toggleFilters = function() {
	this.isFilterActive = !this.isFilterActive;
	this.onChange && this.onChange();
};


module.exports = ActionPanelModel;
