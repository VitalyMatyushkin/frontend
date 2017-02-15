/**
 * Created by Woland on 15.02.2017.
 */
const 	React 			= require('react'),
		Morearty		= require('morearty'),
		SVG 			= require('module/ui/svg'),
		DataLoader 		= require('module/ui/grid/data-loader'),
		GridModel 		= require('module/ui/grid/grid-model');

class IntegrationPageClass{
	constructor(page){
		this.getDefaultBinding = page.getDefaultBinding;
		this.getMoreartyContext = page.getMoreartyContext;
		this.props = page.props;
		this.state = page.state;
		
		this.rootBinding = this.getMoreartyContext().getBinding();
		this.activeSchoolId = this.rootBinding.get('userRules.activeSchoolId');
		
		this.grid = this.getGrid();
		this.dataLoader = 	new DataLoader({
			serviceName:	'integrations',
			params:			{schoolId:this.activeSchoolId},
			grid:			this.grid,
			onLoad: 		this.getDataLoadedHandle()
		});
	}
	
	reloadData(){
		this.dataLoader.loadData();
	}
	
	getDataLoadedHandle(data){
		const 	self 		= this,
				binding 	= self.getDefaultBinding();
		
		return function(data){
			binding.set('data', self.grid.table.data);
		};
	}
	
	getStringGoogleCalendar(){
		return "Google calendar";
	}
	
	onRemove(item, event){
		window.confirmAlert(
			`Are you sure you want to remove this integration?`,
			"Ok",
			"Cancel",
			() => {
				window.Server.integration
				.delete( {schoolId:this.activeSchoolId, integrationId:item.id} )
				.then(() => this.reloadData())
			},
			() => {}
		);
		event.stopPropagation();
	}
	
	onClick(){
		//it dirty way, but browser blocked opening window in async request
		const googleWindow = window.open("","_blank");
		
		window.Server.integrationGoogleCalendar.post({schoolId: this.activeSchoolId}).then( link => {
			const linkGoogleCalendar = link.url;
			googleWindow.location.href = linkGoogleCalendar;
		});
	}
	
	getGrid(){
		const columns = [
			{
				text:'Integration',
				isSorted:false,
				cell:{
					type:'custom',
					typeOptions: {
						parseFunction: this.getStringGoogleCalendar
					}
				}
			},
			{
				text:'Name',
				isSorted:false,
				cell:{
					dataField:'name',
					type:'general'
				}
			},
			{
				text:'Actions',
				cell:{
					type:'action-buttons',
					typeOptions:{
						onItemRemove: this.onRemove.bind(this)
					}
				}
			}
		];
		
		return new GridModel({
			actionPanel:{
				title:'Integration',
				showStrip:true,
				hideBtnFilter: true,
				/**Only school admin and manager can add integration. All other users should not see that button.*/
				btnAdd:
					(
						<div className="addButton bTooltip" data-description="Add Integration" onClick={() => {this.onClick()}}>
							<SVG icon="icon_cog" />
						</div>
					)
			},
			columns:columns,
			filters:{limit:10}
		});
	}
}

module.exports = IntegrationPageClass;