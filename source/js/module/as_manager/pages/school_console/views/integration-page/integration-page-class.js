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
	
	getTypeIntegration(item){
		switch(true) {
			case item.type === 'google':
				return  'Google Calendar';
			case item.type === 'twitter':
				return 'Twitter';
			default: return null
		}
	}
	
	getLogoIntegration(item){
		switch(true) {
			case item.type === 'google':
				return  <i className="fa fa-google" ariaHidden="true"></i>;
			case item.type === 'twitter':
				return <i className="fa fa-twitter" ariaHidden="true"></i>;
			default: return null
		}
		
	}
	
	onClick(){
		const binding = this.getDefaultBinding();
		
		binding.set('isPopupOpen', true);
	}
	
	getGrid(){
		const columns = [
			{
				text:'',
				isSorted:false,
				cell:{
					dataField:'type',
					type:'custom',
					typeOptions:{
						parseFunction:this.getLogoIntegration.bind(this)
					}
				}
			},
			{
				text:'Integration',
				isSorted:false,
				cell:{
					dataField:'type',
					type:'custom',
					typeOptions:{
						parseFunction:this.getTypeIntegration.bind(this)
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