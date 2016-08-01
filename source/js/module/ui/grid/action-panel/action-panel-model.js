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
	this.showStrip = !!options.showStrip;
	this.showSearch = !!options.showSearch;
	this.showBtnPrint = !!options.showBtnPrint;
	this.showBtnLoad = !!options.showBtnLoad;
	this.hideBtnFilter = !!options.hideBtnFilter;
	this.isFilterActive = false;

	this.onChange = null;
};


module.exports = ActionPanelModel;
