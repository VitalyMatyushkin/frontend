/**
 * Created by Anatoly on 16.08.2016.
 */
//TODO Unused dependencies
const 	React 			= require('react'),
		Morearty		= require('morearty'),
		DataLoader 		= require('module/ui/grid/data-loader'),
		SVG				= require('module/ui/svg'),
		GridModel 		= require('module/ui/grid/grid-model');

/**
 * HouseListModel
 *
 * @param {object} page
 *
 * */
// TODO Is it good idea send Morearty object to model by args?
const HouseListModel = function(page){
	this.getDefaultBinding = page.getDefaultBinding;
	this.getMoreartyContext = page.getMoreartyContext;
	//TODO Where was "props" used?
	this.props = page.props;
	//TODO Where was "state" used?
	this.state = page.state;

	this.rootBinding = this.getMoreartyContext().getBinding();
	this.activeSchoolId = this.rootBinding.get('userRules.activeSchoolId');

	this.grid = this.getColumns();
};

HouseListModel.prototype.reloadData = function(){
	this.dataLoader.loadData();
};

HouseListModel.prototype.onEdit = function(data, event) {
	document.location.hash += '/edit?id=' + data.id;
	event.stopPropagation();
};

HouseListModel.prototype.onChildren = function(data, event) {
	document.location.hash += `/students?id=${data.id}&name=${data.name}`;
	event.stopPropagation();
};

HouseListModel.prototype.onRemove = function(data, event){
	const 	self = this;
	
	if(typeof data !== 'undefined') {
		const showAlert = function() {
			window.simpleAlert(
				'Sorry! You cannot perform this action. Please contact support',
				'Ok',
				() => {
				}
			);
		};
		
		window.confirmAlert(
			`Are you sure you want to remove house ${data.name}?`,
			"Ok",
			"Cancel",
			() => {window.Server.schoolHouse
			.delete( {schoolId:self.activeSchoolId, houseId:data.id} )
			.then(() => self.reloadData())
			.catch(() => showAlert())},
			() => {}
		);
	}
	event.stopPropagation();
};

HouseListModel.prototype.getColumns = function(){
	const 	role 			= this.rootBinding.get('userData.authorizationInfo.role'),
			changeAllowed 	= role === "ADMIN" || role === "MANAGER";
	
	this.columns = [
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
};

HouseListModel.prototype.createGrid = function(){
	const 	role 			= this.rootBinding.get('userData.authorizationInfo.role'),
			changeAllowed 	= role === "ADMIN" || role === "MANAGER";
	
	this.grid = new GridModel({
		actionPanel:{
			title:'Houses',
			showStrip:true,
			
			/**Only school admin and manager can add new students. All other users should not see that button.*/
			btnAdd:changeAllowed ?
				(
					<div className="addButtonShort bTooltip" data-description="Add House"
						 onClick={function(){document.location.hash += '/add';}}>
						<SVG icon="icon_add_house" />
					</div>
				) : null
		},
		columns:this.columns,
		handleClick: this.props.handleClick
	});
	
	this.dataLoader = new DataLoader({
		serviceName:'schoolHouses',
		params:		{schoolId:this.activeSchoolId},
		grid:		this.grid,
		onLoad: 	this.getDataLoadedHandle() // TODO You can use arrow function right here instead 'getDataLoadedHandle'.
	});
	
	return this;
};

HouseListModel.prototype.createGridFromExistingData = function(grid){
	const 	role 			= this.rootBinding.get('userData.authorizationInfo.role'),
			changeAllowed 	= role === "ADMIN" || role === "MANAGER";
	
	this.grid = new GridModel({
		actionPanel:{
			title:'Houses',
			showStrip:true,
			
			/**Only school admin and manager can add new students. All other users should not see that button.*/
			btnAdd:changeAllowed ?
				(
					<div className="addButtonShort bTooltip" data-description="Add House"
						 onClick={function(){document.location.hash += '/add';}}>
						<SVG icon="icon_add_house" />
					</div>
				) : null
		},
		columns:this.columns,
		handleClick: this.props.handleClick,
		filters: {
			where: grid.filter.where,
			order: grid.filter.order
		},
		badges: grid.filterPanel.badgeArea
	});
	
	this.dataLoader = new DataLoader({
		serviceName:'schoolHouses',
		params:		{schoolId:this.activeSchoolId},
		grid:		this.grid,
		onLoad: 	this.getDataLoadedHandle() // TODO You can use arrow function right here instead 'getDataLoadedHandle'.
	});
	
	return this;
};

// TODO Get WHAT??
HouseListModel.prototype.getDataLoadedHandle = function(data){
	const self = this,
		binding = self.getDefaultBinding();
	
	return function(data){
		binding.set('data', self.grid.table.data);
	};
};


module.exports = HouseListModel;
