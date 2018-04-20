/**
 * Created by Anatoly on 12.12.2016.
 */

const 	React 			= require('react'),
		propz 			= require('propz'),
		Morearty 		= require('morearty'),
	
		{GridModel}		= require('module/ui/grid/grid-model'),
		{DataLoader}	= require('module/ui/grid/data-loader'),
	
		STATUS 			= require('module/helpers/consts/schools').STATUS;

/**
 * AdminSchoolsListClass
 *
 * @param {object} page
 *
 */
class AdminSchoolsListClass{
	constructor(page){
		this.getDefaultBinding = page.getDefaultBinding;
		this.getMoreartyContext = page.getMoreartyContext;
		this.props = page.props;
		this.state = page.state;
		
		const binding = this.getDefaultBinding();
		
		this.setColumns();
		this.grid = new GridModel({
			actionPanel:{
				title: 		'Schools',
				showStrip: 	true,
				btnAdd: 	this.props.addButton
			},
			columns: 		this.columns,
			handleClick: 	this.props.handleClick,
			filters:		{ limit: 20 }
		});
		
		const globalBinding = this.getMoreartyContext().getBinding();
		
		this.dataLoader = new DataLoader({
			serviceName: 	'schools',
			grid: 			this.grid,
			onLoad: 		this.getDataLoadedHandle()
		});
	}
	
	getActions(item){
		const 	status 		= propz.get(item, ['status'], 'ACTIVE'),
				actionList 	= ['Edit', 'View'];
		
		if (status !== STATUS.REMOVED) {
			actionList.push('Delete');
		}
		
		if (status === STATUS.REMOVED) {
			actionList.push('Recover');
		}
		return actionList;
	}
	
	getQuickEditAction(itemId, action){
		const actionKey = action;
		//For future extension, maybe will appear new actions
		switch (actionKey){
			case 'Edit':
				this.getEditFunction(itemId);
				break;
			case 'View':
				this.getViewFunction(itemId);
				break;
			case 'Delete':
				this.getDeleteFunction(itemId);
				break;
			case 'Recover':
				this.getRecoverFunction(itemId);
				break;
			default :
				break;
		}
	}
	
	getEditFunction(itemId){
		document.location.hash = 'schools/admin_views/edit?id=' + itemId;
	}
	
	getViewFunction(itemId, itemName) {
		document.location.hash = `school_sandbox/${itemId}/forms`;
	}
	
	getDeleteFunction(itemId){
		const binding = this.getDefaultBinding();
		
		window.confirmAlert(
			"Do you really want to remove this item?",
			"Ok",
			"Cancel",
			() => {
				window.Server.school.delete(itemId).then(() => {
						this.reloadData();
					}
				);
			},
			() => {}
		);
	}
	
	getRecoverFunction(itemId){
		const binding = this.getDefaultBinding();
		
		window.confirmAlert(
			"Do you really want to recover this item?",
			"Ok",
			"Cancel",
			() => {
				window.Server.school.put(itemId, {status: STATUS.ACTIVE}).then(() => {
						this.reloadData();
					}
				);
			},
			() => {}
		);
	}
	
	reloadData(){
		this.dataLoader.loadData();
	}
	
	getStatusList(){
		return [
			{
				key:	'ACTIVE',
				value:	'Active'
			},
			{
				key:	'INACTIVE',
				value:	'Inactive'
			},
			{
				key:	'SUSPENDED',
				value:	'Suspended'
			},
			{
				key:	'EMAIL_NOTIFICATIONS',
				value:	'Email Notifications'
			},
			{
				key:	'REMOVED',
				value:	'Removed'
			}
		];
	}

	getRegionList() {
		return [
			{
				key:	'GB',
				value:	'GB'
			},
			{
				key:	'US',
				value:	'US'
			},
			{
				key:	'DE',
				value:	'DE'
			}
		];
	}
	
	setColumns(){
		this.columns = [
			{
				text:'Logo',
				isSorted:false,
				cell:{
					dataField:'pic',
					type:'image'
				}
			},
			{
				text:'School',
				isSorted:true,
				cell:{
					dataField:'name',
					type:'general'
				},
				filter:{
					type:'string'
				}
			},
			{
				text:'Phone',
				isSorted:false,
				cell:{
					dataField:'phone',
					type:'general'
				}
			},
			{
				text:'Address',
				isSorted:true,
				cell:{
					dataField:'address',
					type:'general'
				},
				filter:{
					type:'string'
				}
			},
			{
				text:'Domain',
				isSorted:true,
				cell:{
					dataField:'domain',
					type:'general'
				},
				filter:{
					type:'string'
				}
			},
			{
				text:'Region',
				isSorted:false,
				cell:{
					dataField:'region',
					type:'general'
				},
				filter:{
					type:'multi-select',
					typeOptions:{
						items: this.getRegionList()
					}
				}
			},
			{
				text:'Status',
				isSorted:true,
				cell:{
					dataField:'status',
					type:'general'
				},
				filter:{
					type:'multi-select',
					typeOptions:{
						items: this.getStatusList()
					}
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
	}
	
	getDataLoadedHandle(){
		const binding = this.getDefaultBinding();
		
		return function(data){
			binding.set('data', this.grid.table.data);
		};
	}
	
}

module.exports = AdminSchoolsListClass;
