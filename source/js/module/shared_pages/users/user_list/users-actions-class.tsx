/**
 * Created by Anatoly on 25.07.2016.
 */
import * as React from 'react'

import {DataLoader} from 'module/ui/grid/data-loader'
import * as UserModel from 'module/data/UserModel'
import {GridModel}  from  'module/ui/grid/grid-model'

import {CSVExportButton} from 'module/shared_pages/users/user_list/buttons/csv_export_button'
import * as CSVExportConsts	from 'module/ui/grid/csv_export/consts'
import * as UserConsts from 'module/helpers/consts/user'
import * as CSVExportController from 'module/ui/grid/csv_export/csv_export_controller'

import * as RoleHelper from 'module/helpers/role_helper'
import {ServiceList} from "module/core/service_list/service_list";

/**
 * UsersActionsClass
 *
 * @param {object} page
 *
 * */
export class UsersActionsClass {
	page: any;
	binding: any;
	rootBinding: any;
	activeSchoolId: string;
	props: any;
	columns: any;
	dataLoader: DataLoader;
	grid: GridModel;

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
			return typeof self.props.blockService !== "undefined" ?
				['View', 'Block', 'Unblock', 'Add Role']:
				['View', 'Add Role'];
		}
	}
	
	getActions(item) {
		const 	self 					= this,
				activeSchoolId 			= self.activeSchoolId,
				actionList 				= self.getActionList();

		let isActionListChange = false;

		item.permissions.forEach(permission => {
			if (
				permission.status !== UserConsts.PERMISSION_STATUS.REMOVED &&
				(
					// so if user can't accept staff roles then he can manage only PARENT and STUDENT roles
					self.props.canAcceptStaffRoles ?
						true :
						permission.preset === 'PARENT' || permission.preset === 'STUDENT'
				)
			) {
				let action = 'Revoke the role ';

				if(permission.preset === 'PARENT') {
					action += `of ${permission.student.firstName} ${permission.student.lastName} parent`;
				} else {
					action += permission.preset;

					if(!activeSchoolId) {
						action +=' for ' + permission.school.name;
					}
				}

				actionList.push({
					text: 	action,
					key: 	'revoke',
					id: 	permission.id
				});
				isActionListChange = true;
			}
		});
		if (isActionListChange && self.props.canAcceptStaffRoles) {
			actionList.push('Revoke All Roles');
		}

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
					// TODO pass service by props
					// but service not a service name
					permission		= (window.Server as ServiceList)[self.props.permissionServiceName],
					permissionList	= (window.Server as ServiceList)[`${self.props.permissionServiceName}s`];
			
			window.confirmAlert(
				"Are you sure you want revoke all roles?",
				"Ok",
				"Cancel",
				() => {
					ids.forEach( userId => {
						const params = {
							userId: 	userId,
							schoolId: 	schoolId,
							permissionId: undefined
						};
						
						permissionList.get(params).then( data => {
							data.forEach( p => {
								params.permissionId = p.id;
								permission.delete(params).then( () => self.reloadData());
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
				permission 		= (window.Server as ServiceList)[self.props.permissionServiceName];
		
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
	
	getGenders() {
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
					type:'string',
					id: 'userEmailFilter'
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
				text:'Details',
				cell:{
					dataField:'details'
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
				text:'Tokens',
				cell:{
					dataField:'tokens'
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
							getDataPromise: (window.Server as ServiceList).publicSchools.get({filter:{limit:2000,order:"name ASC"}}),
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
				btnCSVExport: this.getCSVExportButton()
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
				btnCSVExport: this.getCSVExportButton()
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

	getCSVExportButton() {
		return (
			<CSVExportButton
				handleClick = { () => {
						this.handleCSVExportClick();
					}
				}
			/>
		)
	}

	handleCSVExportClick() {
		// TODO dirty hack
		this.binding.set('isShowCSVExportPopup', true);

		this.dataLoader.doRequestWithCurrentFilterAndNoLimit().then(data => {
			this.binding.set('isShowCSVExportPopup', false);
			CSVExportController.getCSVByGridModel(
				CSVExportConsts.gridTypes.SUPERADMIN_USERS,
				data,
				this.grid
			);
		});
	}
	
	getDataLoadedHandle() {
		const	self	= this,
				binding	= self.page.getDefaultBinding();
		
		return () => {
			binding.set('data', self.grid.table.data);
		};
	}
};