const 	React 			= require('react'),
		DataLoader 		= require('module/ui/grid/data-loader'),
		SVG				= require('module/ui/svg'),
		GridModel 		= require('module/ui/grid/grid-model');

const APPS_ROOT_URL = 'apps';

const AppListModel = function(page){
	this.getDefaultBinding = page.getDefaultBinding;
	this.getMoreartyContext = page.getMoreartyContext;
	this.props = page.props;
	this.state = page.state;

	this.rootBinding = this.getMoreartyContext().getBinding();
	this.activeSchoolId = this.rootBinding.get('userRules.activeSchoolId');

	this.grid = this.getColumns();
};

AppListModel.prototype.reloadData = function(){
	this.dataLoader.loadData();
};

AppListModel.prototype.onEdit = function(data, event) {
	document.location.hash = `${APPS_ROOT_URL}/edit?id=` + data.id;
	event.stopPropagation();
};

AppListModel.prototype.onRemove = function(data, event){
	const 	self = this;

	if(typeof data !== 'undefined') {

		window.confirmAlert(
			`Are you sure you want to remove app ${data.name}?`,
			"Ok",
			"Cancel",
			() => {
				window.Server.app.delete( { appId: data.id } )
					.then(() => self.reloadData())
			},
			() => {}
		);
	}
	event.stopPropagation();
};

AppListModel.prototype.getColumns = function(){
	this.columns = [
		{
			text:		'Name',
			isSorted:	true,
			cell:		{ dataField:'name' },
			filter:		{
				id:		'app_name_filter',
				type:	'string'
			}
		},
		{
			text:		'Current Version',
			isSorted:	false,
			cell:		{ dataField:'currentVersion' },
			filter:		{
				id:		'app_current_version_filter',
				type:	'string'
			}
		},
		{
			text:		'Minimal Version',
			isSorted:	false,
			cell:		{ dataField:'minimalVersion' },
			filter:		{
				id:		'app_minimal_version_filter',
				type:	'string'
			}
		},
		{
			text:		'Current Version',
			isSorted:	false,
			cell:		{ dataField:'lowerMinimalVersionText' },
			filter:		{
				id:		'app_current_version_filter',
				type:	'string'
			}
		},
		{
			text:		'Minimal Version',
			isSorted:	false,
			cell:		{ dataField:'lowerCurrentVersionText' },
			filter:		{
				id:		'app_minimal_version_filter',
				type:	'string'
			}
		},
		{
			text:		'Platform',
			isSorted:	false,
			cell:		{ dataField:'platform' },
			filter:		{
				id:		'app_platform_filter',
				type:	'string'
			}
		},
		{
			text:	'Actions',
			cell:	{
				type:			'action-buttons',
				typeOptions:	{
					onItemEdit:		this.onEdit.bind(this),
					onItemRemove:	this.onRemove.bind(this)
				}
			}
		}
	];
};

AppListModel.prototype.createGrid = function(){
	this.grid = new GridModel({
		actionPanel:{
			title:'Apps',
			showStrip:true,

			btnAdd: (
				<div
					className			= "addButtonShort bTooltip"
					data-description	= "Add app"
					onClick				= { () => document.location.hash = `${APPS_ROOT_URL}/add` }
				>
					<SVG icon="icon_add_house" />
				</div>
			)
		},
		columns: this.columns,
		handleClick: this.props.handleClick,
		filters: {
			limit: 100,
			where: {
				status: 'ACTIVE'
			}
		}
	});

	this.dataLoader = new DataLoader({
		serviceName:'apps',
		params:		{schoolId:this.activeSchoolId},
		grid:		this.grid,
		onLoad: 	this.getDataLoadedHandle() // TODO You can use arrow function right here instead 'getDataLoadedHandle'.
	});

	return this;
};

AppListModel.prototype.createGridFromExistingData = function(grid){
	this.grid = new GridModel({
		actionPanel:{
			title:'Apps',
			showStrip:true,

			btnAdd: (
				<div
					className			= "addButtonShort bTooltip"
					data-description	= "Add app"
					onClick				= { () => document.location.hash = `${APPS_ROOT_URL}/add` }
				>
					<SVG icon="icon_add_house" />
				</div>
			)
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
		serviceName:'apps',
		grid:		this.grid,
		onLoad: 	this.getDataLoadedHandle()
	});

	return this;
};

AppListModel.prototype.getDataLoadedHandle = function(){
	const self = this,
		binding = self.getDefaultBinding();

	return function() {
		binding.set('data', self.grid.table.data);
	};
};

module.exports = AppListModel;