/**
 * Created by Woland on 10.02.2017.
 */

const 	React 			= require('react'),
		Morearty		= require('morearty'),
		SVG 			= require('module/ui/svg'),
		DataLoader 		= require('module/ui/grid/data-loader'),
		GridModel 		= require('module/ui/grid/grid-model');

const IntegrationPageModel = function(page){
	this.getDefaultBinding = page.getDefaultBinding;
	this.getMoreartyContext = page.getMoreartyContext;
	this.props = page.props;
	this.state = page.state;
	
	this.rootBinding = this.getMoreartyContext().getBinding();
	this.activeSchoolId = this.rootBinding.get('userRules.activeSchoolId');
	
	this.grid = this.getGrid();
	this.dataLoader = 	new DataLoader({
		serviceName:	'users',
		params:			{schoolId:this.activeSchoolId},
		grid:			this.grid,
		onLoad: 		this.getDataLoadedHandle()
	});
};
IntegrationPageModel.prototype.reloadData = function() {
	this.dataLoader.loadData();
};

IntegrationPageModel.prototype.getDataLoadedHandle = function(data) {
	const 	self 		= this,
			binding 	= self.getDefaultBinding();
	
	return function(data){
		binding.set('data', self.grid.table.data);
	};
};

IntegrationPageModel.prototype.getGrid = function() {
	const 	role 			= this.rootBinding.get('userData.authorizationInfo.role'),
			changeAllowed 	= role === "ADMIN" || role === "MANAGER";
	
	const columns = [
		{
			text:'Integration',
			isSorted:false,
			cell:{
				dataField:'name',
				type:'general'
			}
		}
	];
	
	return new GridModel({
		actionPanel:{
			title:'Integration',
			showStrip:true,
			hideBtnFilter: true,
			/**Only school admin and manager can add integration. All other users should not see that button.*/
			btnAdd:changeAllowed ?
				(
					<div className="addButton bTooltip" data-description="Add Integration" onClick={() => {console.log('Server request')}}>
						<SVG icon="icon_cog" />
					</div>
				) : null
		},
		columns:columns,
		filters:{limit:5}
	});
};

module.exports = IntegrationPageModel;
