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
IntegrationPageModel.prototype.onClick = function(){
	//it dirty way, but browser blocked opening window in async request 
	const googleWindow = window.open("","_blank");
	
	window.Server.integrationGoogleCalendar.post({schoolId: this.activeSchoolId}).then( link => {
		const linkGoogleCalendar = link.url;
		googleWindow.location.href = linkGoogleCalendar;
	});
};

IntegrationPageModel.prototype.getGrid = function() {
	const 	role 					= this.rootBinding.get('userData.authorizationInfo.role'),
			integrationAllowed 		= role === "ADMIN";
	

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
			btnAdd:integrationAllowed ?
				(
					<div className="addButton bTooltip" data-description="Add Integration" onClick={() => {this.onClick()}}>
						<SVG icon="icon_cog" />
					</div>
				) : null
		},
		columns:columns,
		filters:{limit:5}
	});
};

module.exports = IntegrationPageModel;
