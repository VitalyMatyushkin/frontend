/**
 * Created by Anatoly on 16.08.2016.
 */

const 	React 			= require('react'),
		Morearty		= require('morearty'),
		SVG 			= require('module/ui/svg'),
		DataLoader 		= require('module/ui/grid/data-loader'),
		GridModel 		= require('module/ui/grid/grid-model'),
		BadgeModel		= require('module/ui/grid/filter/model/badge-model');

/**
 * ClassListModel
 *
 * @param {object} page
 *
 * */

class ClassListClass{
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
	
	onEdit(data, event){
		document.location.hash += '/edit?id=' + data.id;
		event.stopPropagation();
	}
	
	onChildren(data, event){
		document.location.hash += `/students?id=${data.id}&name=${data.name}`;
		event.stopPropagation();
	}
	
	onRemove(data, event){
		const 	self = this;
		
		if(typeof data !== 'undefined') {
			window.confirmAlert(
				`Are you sure you want to remove form ${data.name}?`,
				"Ok",
				"Cancel",
				() => window.Server.schoolForm
				.delete( {schoolId:self.activeSchoolId, formId:data.id} )
				.then(() => self.reloadData())
				.catch(() => {
					window.simpleAlert(
						'Sorry! You cannot perform this action. Please contact support',
						'Ok',
						() => {}
					);
				}),
				() => {}
			);
		}
		event.stopPropagation();
	}
	
	setColumns(){
		const 	role 			= this.rootBinding.get('userData.authorizationInfo.role'),
				changeAllowed 	= role === "ADMIN" || role === "MANAGER";
		
		this.columns = [
			{
				text:'Name',
				isSorted:true,
				cell:{
					dataField:'name'
				},
				filter:{
					type:'string'
				}
			},
			{
				text:'Age group',
				isSorted:true,
				cell:{
					dataField:'age',
					type:'custom',
					typeOptions:{
						parseFunction: function(item) {return 'Y' + item.age;}
					}
				}
			},
			{
				text:'Actions',
				cell:{
					type:'action-buttons',
					typeOptions:{
						/**
						 * Only school admin and manager can edit or delete students.
						 * All other users should not see that button.
						 * */
						onItemEdit:		changeAllowed ? this.onEdit.bind(this) : null,
						onItemSelect:	this.onChildren.bind(this),
						onItemRemove:	changeAllowed ? this.onRemove.bind(this) : null
					}
				}
			}
		];
		

	}
	
	init(){
		const 	role 			= this.rootBinding.get('userData.authorizationInfo.role'),
				changeAllowed 	= role === "ADMIN" || role === "MANAGER";
		
		this.grid = new GridModel({
			actionPanel:{
				title:'Forms',
				showStrip:true,
				
				/**Only school admin and manager can add new students. All other users should not see that button.*/
				btnAdd:changeAllowed ?
					(
						<div className="addButton bTooltip" data-description="Add Form" onClick={function(){document.location.hash += '/add';}}>
							<SVG icon="icon_add_form" />
						</div>
					) : null
			},
			columns:this.columns,
			handleClick: this.props.handleClick,
			filters:{limit:30}
		});
		
		this.dataLoader = new DataLoader({
			serviceName:'schoolForms',
			params:		{schoolId:this.activeSchoolId},
			grid:		this.grid,
			onLoad: 	this.getDataLoadedHandle()
		});
		
		
		return this;
	}
	
	loadFilter(grid){
		const 	role 			= this.rootBinding.get('userData.authorizationInfo.role'),
				changeAllowed 	= role === "ADMIN" || role === "MANAGER";
		
		/*this.badges = new BadgeModel({
			field: {
				text: grid.filterPanel.filterFields["0"].field.text,
				name: grid.filterPanel.filterFields["0"].field.name
			},
			type: grid.filterPanel.filterFields["0"].type,
			badgeArea: grid.filterPanel.filterFields["0"].badgeArea,
		 	values: grid.filterPanel.badgeArea.badges.name.values
			
		});*/
		
		this.grid = new GridModel({
			actionPanel:{
				title:'Forms',
				showStrip:true,
				
				/**Only school admin and manager can add new students. All other users should not see that button.*/
				btnAdd:changeAllowed ?
					(
						<div className="addButton bTooltip" data-description="Add Form" onClick={function(){document.location.hash += '/add';}}>
							<SVG icon="icon_add_form" />
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
			serviceName:'schoolForms',
			params:		{schoolId:this.activeSchoolId},
			grid:		this.grid,
			onLoad: 	this.getDataLoadedHandle()
		});
		
		return this;
	}
	
	getDataLoadedHandle(data){
		const self = this,
			binding = self.getDefaultBinding();
		
		return function(data){
			binding.set('data', self.grid.table.data);
		};
	}
}

module.exports = ClassListClass;
