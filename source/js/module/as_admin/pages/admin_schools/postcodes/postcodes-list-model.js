/**
 * Created by vitaly on 12.09.17.
 */

const   DataLoader      = require('module/ui/grid/data-loader'),
		React           = require('react'),
		Morearty        = require('morearty'),
		{GridModel}     = require('module/ui/grid/grid-model');

/**
 * ClassesListModel
 *
 * @param {object} page
 *
 * */
const PostcodesListModel = function(page){
	this.getDefaultBinding = page.getDefaultBinding;
	this.getMoreartyContext = page.getMoreartyContext;
	this.props = page.props;
	this.state = page.state;

	const binding = this.getDefaultBinding();

	this.setColumns();
	this.grid = new GridModel({
		actionPanel:{
			title:'Postcodes',
			showStrip:true,
			btnAdd:this.props.addButton
		},
		columns:this.columns,
		filters:{limit: 20}
	});

	this.dataLoader =   new DataLoader({
		serviceName:    'postCodes',
		grid:           this.grid,
		onLoad:         this.getDataLoadedHandle()
	});

};

PostcodesListModel.prototype.getActions = function(){
	const actionList = ['Edit', 'Delete'];
	return actionList;
};

PostcodesListModel.prototype.getQuickEditAction = function(itemId, action){
	const actionKey = action;
	//For future extension, maybe will appear new actions
	switch (actionKey){
		case 'Edit':
			this.getEditFunction(itemId);
			break;
		case 'Delete':
			this.getDeleteFunction(itemId);
			break;
		default :
			break;
	}

};

PostcodesListModel.prototype.getEditFunction = function(itemId){
	document.location.hash = `tools/postcodes/edit/${itemId}`;
};

PostcodesListModel.prototype.getDeleteFunction = function(itemId){
	const binding = this.getDefaultBinding();

	window.confirmAlert(
		"Do you really want to remove this postcode?",
		"Ok",
		"Cancel",
		() => {
			window.Server.postCode.delete(itemId).then(() => {
					binding.update((result) => {
						return result.filter((res) => {
							return res[0].id !== itemId;
						});
					});
					this.reloadData();
				}
			);
		},
		() => {}
	);
};

PostcodesListModel.prototype.reloadData = function(){
	this.dataLoader.loadData();
};

PostcodesListModel.prototype.setColumns = function(){
	this.columns = [
		{
			text:'Name',
			isSorted:false,
			cell:{
				dataField:'postcode',
				type:'general'
			},
			filter:{
				type:'string'
			}
		},
		{
			text:'Longitude',
			isSorted:false,
			cell:{
				dataField:'point.lng',
				type:'general'
			}
		},
		{
			text:'Latitude',
			isSorted:false,
			cell:{
				dataField:'point.lat',
				type:'general'
			}
		},
		{
			text:'Actions',
			width:'150px',
			cell:{
				type:'action-list',
				typeOptions:{
					getActionList:this.getActions.bind(this),
					actionHandler:this.getQuickEditAction.bind(this)
				}
			}
		}
	];
};

PostcodesListModel.prototype.getDataLoadedHandle = function(){
	const binding = this.getDefaultBinding();

	return function(data){
		binding.set('data', this.grid.table.data);
	};
};

module.exports = PostcodesListModel;