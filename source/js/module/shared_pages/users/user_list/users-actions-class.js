/**
 * Created by Anatoly on 25.07.2016.
 */

const	DataLoader		= require('module/ui/grid/data-loader'),
		UserModel		= require('module/data/UserModel'),
		{GridModel}		= require('module/ui/grid/grid-model'),
		RoleHelper		= require('module/helpers/role_helper');

/**
 * UsersActionsClass
 *
 * @param {object} page
 *
 * */
class UsersActionsClass {
	constructor(page) {
		this.page = page;
		this.binding = page.getDefaultBinding();
		this.rootBinding = page.getMoreartyContext().getBinding();
		this.activeSchoolId = this.rootBinding.get('userRules.activeSchoolId');
		this.props = page.props;

		this.getColumns();
	}
	
	reloadData() {
		this.dataLoader.loadData();
	}
	
	getActionList() {
		const self = this;
		
		if(typeof self.props.customActionList !== "undefined") {
			return self.props.customActionList.slice();
		} else {
			return typeof self.props.blockService !== "undefined" ? ['View','Block','Unblock','Add Role','Revoke All Roles']
				: ['View','Add Role','Revoke All Roles'];
		}
	}
	
	getActions(item) {
		const 	self 			= this,
				activeSchoolId 	= self.activeSchoolId,
				actionList 		= self.getActionList();
		
		item.permissions.filter(p => p.preset != 'STUDENT').forEach(p => {
			let action = 'Revoke the role ';
			if(p.preset === 'PARENT') {
				action += `of ${p.student.firstName} ${p.student.lastName} parent`;
			} else {
				action += p.preset;
				
				if(!activeSchoolId) {
					action +=' for ' + p.school.name;
				}
			}
			
			actionList.push({
				text: action,
				key: 'revoke',
				id: p.id
			});
		});
		return actionList;
	}
	
	getQuickEditActionsFactory(itemId,action) {
		const 	self = this,
				binding = self.binding,
				data = binding.sub('data'),
				idAutoComplete = [],
				actionKey = action.key ? action.key : action;
		
		const user = data.get().find( item => {
			return item.id === itemId;
		});
		idAutoComplete.push(user.id);
		const rolesAutoComplete = user.permissions;
		switch (actionKey){
			case 'Add Role':
				binding.atomically()
				.set('groupIds',idAutoComplete)
				.set('groupPermissions',rolesAutoComplete)
				.set('popup',true)
				.commit();
				break;
			case 'Revoke All Roles':
				self.revokeAllRoles(idAutoComplete);
				break;
			case 'Unblock':
				self.accessRestriction(idAutoComplete,false);
				break;
			case 'Block':
				self.accessRestriction(idAutoComplete,true);
				break;
			case 'View':
				self.getItemViewFunction(idAutoComplete);
				break;
			case 'revoke':
				self.revokeRole(idAutoComplete, action);
				break;
			default :
				break;
		}
	}
	
	getItemViewFunction(model) {
		if(model.length === 1) {
			window.location.hash = 'user/view?id=' + model[0];
		} else {
			window.simpleAlert(
				"You can only perform this action on one Item.",
				'Ok',
				() => {}
			);
		}
	}
	
	revokeAllRoles(ids) {
		const self = this;
		
		if(ids && ids.length > 0 ){
			const	schoolId		= self.activeSchoolId,
					permission		= window.Server[self.props.permissionServiceName],
					permissionList	= window.Server[`${self.props.permissionServiceName}s`];
			
			window.confirmAlert(
				"Are you sure you want revoke all roles?",
				"Ok",
				"Cancel",
				() => {
					ids.forEach( userId => {
						const params = {
							userId:userId,
							schoolId:schoolId
						};
						
						permissionList.get(params)
						.then( data => {
							data.forEach( p => {
								if(p.preset !== 'STUDENT'){
									params.permissionId = p.id;
									permission.delete(params).then( () => self.reloadData());
								}
							});
						});
					});
				},
				() => {}
			);
		}
	}
	
	revokeRole(ids, action) {
		const   self            = this,
				schoolId  		= self.activeSchoolId,
				permission 		= window.Server[self.props.permissionServiceName];
		
		if(ids && ids.length > 0 ) {
			window.confirmAlert(
				`Are you sure you want ${action.text}?`,
				"Ok",
				"Cancel",
				() => {
					ids.forEach( userId => {
						const params = {
							userId:userId,
							schoolId:schoolId,
							permissionId:action.id
						};
						
						permission.delete(params).then( () => {
							self.reloadData();
						});
					});
				},
				() => {}
			);
		}
	}
	
	accessRestriction(ids,block) {
		const 	self = this,
				blockStr = block ? 'block': 'unblock';
		
		if(ids !== undefined && ids.length >= 1){
			if(confirm(`Are you sure you want ${blockStr} user?`)){
				ids.forEach( id => {
					self.props.blockService.post(id,{blocked: block }).then( () => {
						self.reloadData();
					});
				});
			}
		} else {
			window.simpleAlert(
				'Please select at least 1 row',
				'Ok',
				() => {}
			);
		}
	}
	
	getRoleList() {
		const roles = [];
		
		Object.keys(RoleHelper.USER_PERMISSIONS).forEach( key => {
			roles.push({
				key: key,
				value: RoleHelper.USER_PERMISSIONS[key].toLowerCase()
			});
		});
		
		return roles;
	}
	
	getGenders(){
		return [
			{
				key:'MALE',
				value:'Male'
			},
			{
				key:'FEMALE',
				value:'Female'
			},
			{
				key:null,
				value:'Not Available'
			}
		];
	}
	
	getColumns() {
		this.columns = [
			{
				text:'Gender',
				cell:{
					dataField:'gender',
					type:'gender'
				},
				filter:{
					type:'multi-select',
					typeOptions:{
						items: this.getGenders(),
						hideFilter:true,
						hideButtons:true
					}
				}
			},
			{
				text:'Name',
				isSorted:true,
				cell:{
					dataField:'firstName'
				},
				filter:{
					type:'string'
				}
			},
			{
				text:'Surname',
				isSorted:true,
				cell:{
					dataField:'lastName'
				},
				filter:{
					type:'string'
				}
			},
			{
				text:'Email',
				isSorted:true,
				width:'100px',
				cell:{
					dataField:'email',
					type:'email'
				},
				filter:{
					type:'string'
				}
			},
			{
				text:'Birthday',
				isSorted:true,
				cell:{
					dataField:'birthday',
					type:'date'
				},
				filter:{
					type:'between-date'
				}
			},
			{
				text:'Role',
				cell:{
					dataField:'roles'
				}
			},
			{
				text:'Status',
				hidden:true,
				cell:{
					dataField:'filterPermissionStatus'
				},
				filter:{
					type:'multi-select',
					typeOptions:{
						items: [
							{
								key:'ACTIVE',
								value:'ACTIVE'
							},
							{
								key:'ACTIVE/Outdated',
								value:'ACTIVE/Outdated'
							}
						],
						hideFilter:true
					}
				}
			},
			{
				text:'Role',
				hidden:true,
				cell:{
					dataField:'permissions.preset'
				},
				filter:{
					type:'multi-select',
					typeOptions:{
						items: this.getRoleList(),
						hideFilter:true
					}
				}
			},
			{
				text:'Access',
				isSorted:true,
				cell:{
					dataField:'status'
				},
				filter:{
					type:'multi-select',
					typeOptions:{
						items: [
							{
								key: 'ACTIVE',
								value: 'Active'
							},
							{
								key: 'BLOCKED',
								value: 'Blocked'
							},
							{
								key: 'DELETED',
								value: 'Deleted'
							}
						],
						hideFilter:true,
						hideButtons:true
					}
				}
			},
			{
				text:'Actions',
				cell:{
					type:'action-list',
					typeOptions:{
						getActionList:this.getActions.bind(this),
						actionHandler:this.getQuickEditActionsFactory.bind(this)
					}
				}
			}
		];
		
		if(this.props.blockService){
			this.columns.splice(5, 0,
				{
					text:'School',
					cell:{
						dataField:'school'
					}
				},
				{
					text:'School',
					hidden:true,
					cell:{
						dataField:'permissions.schoolId'
					},
					filter:{
						type:'multi-select',
						typeOptions:{
							getDataPromise: window.Server.publicSchools.get({filter:{limit:2000,order:"name ASC"}}),
							valueField:'name',
							keyField:'id'
						}
					}
				}
			);
		}
	}
	
	createGrid() {
		this.grid = new GridModel({
			actionPanel:{
				title:'Users & Permissions',
				showStrip:true,
				btnAdd:this.props.addButton,
				btnCSVExport:this.props.csvExportButton
			},
			columns:this.columns,
			handleClick: this.props.handleClick,
			filters:{limit:20}
		});

		this.dataLoader = 	new DataLoader({
			serviceName:'users',
			dataModel: 	UserModel,
			params:		{schoolId:this.activeSchoolId},
			grid:		this.grid,
			onLoad: 	this.getDataLoadedHandle()
		});
		
		return this;
	}
	
	createGridFromExistingData(grid) {
		this.grid = new GridModel({
			actionPanel:{
				title:'Users & Permissions',
				showStrip:true,
				btnAdd:this.props.addButton,
				btnCSVExport:this.props.csvExportButton
			},
			columns:this.columns,
			handleClick: this.props.handleClick,
			filters: {
				where: grid.filter.where,
				order: grid.filter.order
			},
			badges: grid.filterPanel.badgeArea
		});

		this.dataLoader = 	new DataLoader({
			serviceName:'users',
			dataModel: 	UserModel,
			params:		{schoolId:this.activeSchoolId},
			grid:		this.grid,
			onLoad: 	this.getDataLoadedHandle()
		});
		
		return this;
	}
	
	getDataLoadedHandle(data) {
		const self = this,
			binding = self.page.getDefaultBinding();
		
		return function(data){
			binding.set('data', self.grid.table.data);
		};
	}
	
};

module.exports = UsersActionsClass;
