/**
 * Created by Anatoly on 16.08.2016.
 */

const 	React 			= require('react'),
		Morearty		= require('morearty'),
		DataLoader 		= require('module/ui/grid/data-loader'),
		GridModel 		= require('module/ui/grid/grid-model');

/**
 * HouseListModel
 *
 * @param {object} page
 *
 * */
const HouseListModel = function(page){
	this.getDefaultBinding = page.getDefaultBinding;
	this.getMoreartyContext = page.getMoreartyContext;
	this.props = page.props;
	this.state = page.state;

	this.rootBinding = this.getMoreartyContext().getBinding();
	this.activeSchoolId = this.rootBinding.get('userRules.activeSchoolId');

	this.grid = this.getGrid();
	this.dataLoader = 	new DataLoader({
		serviceName:'schoolHouses',
		params:		{schoolId:this.activeSchoolId},
		grid:		this.grid,
		onLoad: 	this.getDataLoadedHandle()
	});
};

HouseListModel.prototype = {
	reloadData:function(){
		this.dataLoader.loadData();
	},
	onEdit: function(data) {
		document.location.hash += '/edit?id=' + data.id;
	},
	onChildren: function(data) {
		document.location.hash += `/students?id=${data.id}&name=${data.name}`;
	},
	onRemove:function(data){
		const 	self = this;

		if(data && confirm(`Are you sure you want to remove house ${data.name}?`)){
			window.Server.schoolHouse.delete({schoolId:self.activeSchoolId, houseId:data.id})
				.then(_ => self.reloadData())
				.catch(error => {
					error && error.xhr && error.xhr.responseJSON && error.xhr.responseJSON.details
					&& alert(error.xhr.responseJSON.details.text);
				});
		}
	},
	getGrid: function(){
		const 	role 			= this.rootBinding.get('userData.authorizationInfo.role'),
				changeAllowed 	= role === "ADMIN" || role === "MANAGER";

		const columns = [
			{
				text:'House name',
				isSorted:true,
				cell:{
					dataField:'name'
				},
				filter:{
					type:'string'
				}
			},
			{
				text:'Description',
				isSorted:true,
				cell:{
					dataField:'description'
				},
				filter:{
					type:'string'
				}
			},
			{
				text:'Color',
				cell:{
					dataField:'colors',
					type:'colors'
				}
			},
			{
				text:'Actions',
				cell:{
					type:'action-buttons',
					typeOptions:{
						/**
						 * Only school admin and manager can edit or delete houses.
						 * All other users should not see that button.
						 * */
						onItemEdit:		changeAllowed ? this.onEdit.bind(this) : null,
						onItemSelect:	this.onChildren.bind(this),
						onItemRemove:	changeAllowed ? this.onRemove.bind(this) : null
					}
				}
			}
		];

		return new GridModel({
			actionPanel:{
				title:'Houses',
				showStrip:true,

				/**Only school admin and manager can add new students. All other users should not see that button.*/
				btnAdd:changeAllowed ?
				(
					<div className="addButton addHouse bTooltip" data-description="Add House"
						 onClick={function(){document.location.hash += '/add';}}>
					</div>
				) : null
			},
			columns:columns
		});
	},
	getDataLoadedHandle: function(data){
		const self = this,
			binding = self.getDefaultBinding();

		return function(data){
			binding.set('data', self.grid.table.data);
		};
	}
};


module.exports = HouseListModel;
