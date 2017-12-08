/**
 * Created by Woland on 03.08.2017.
 */

const 	React 			= require('react'),
		Morearty		= require('morearty'),
		{SVG} 			= require('module/ui/svg'),
		{DataLoader} 	= require('module/ui/grid/data-loader'),
		{GridModel}		= require('module/ui/grid/grid-model'),
		{BadgeModel}	= require('module/ui/grid/filter/model/badge-model');

class ListInviteClass{
	constructor(page){
		this.getDefaultBinding = page.getDefaultBinding;
		this.getMoreartyContext = page.getMoreartyContext;
		this.props = page.props;
		this.state = page.state;
		
		this.rootBinding = this.getMoreartyContext().getBinding();
		this.activeSchoolId = this.rootBinding.get('userRules.activeSchoolId');
		
		this.setColumns();
	}
	reloadData(){
		this.dataLoader.loadData();
	}
	getRemoveFunction(itemId){
		const inviteId = itemId;
		
		return window.Server.invite.delete(inviteId).then(() => {
			this.reloadData();
		});
	}
	getActions(){
		const actionList = ['Remove'];
		return actionList;
	}
	getQuickEditAction(itemId, action){
		//For future extension, maybe will appear new actions
		switch (action){
			case 'Remove':
				this.getRemoveFunction(itemId);
				break;
			default :
				break;
		}
	}
	setColumns(){
		this.columns = [
			{
				text:'Email',
				cell:{
					dataField:'email'
				}
			},
			{
				text:'Status',
				cell:{
					dataField:'status'
				}
			},
			{
				text:'Invite Link',
				cell:{
					dataField:'inviteKey'
				}
			},
			{
				text:'Action',
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
	
	createGrid(){
		this.grid = new GridModel({
			actionPanel: {
				title: 'List Invite',
				showStrip: true
			},
			columns: this.columns,
			handleClick: this.props.handleClick,
			filters:{where:{status:{$ne:'REMOVED'}},limit:20}
		});
		
		this.dataLoader = new DataLoader({
			serviceName:'invites',
			grid:		this.grid,
			onLoad: 	this.getDataLoadedHandle()
		});
		
		return this;
	}
	
	createGridFromExistingData(grid){
		this.grid = new GridModel({
			actionPanel: {
				title: 'List Invite',
				showStrip: true
			},
			columns: this.columns,
			handleClick: this.props.handleClick,
			filters: {
				where: grid.filter.where,
				order: grid.filter.order
			},
			badges: grid.filterPanel.badgeArea
		});
		
		this.dataLoader = new DataLoader({
			serviceName:'invites',
			grid:		this.grid,
			onLoad: 	this.getDataLoadedHandle()
		});
		
		return this;
	}
	
	getDataLoadedHandle(data){
		const 	self 		= this,
				binding 	= self.getDefaultBinding();
		
		return function(data){
			binding.set('data', self.grid.table.data);
		};
	}
}

module.exports = ListInviteClass;
