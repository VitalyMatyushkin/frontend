/**
 * Created by Anatoly on 25.07.2016.
 */

const	DataLoader		= require('module/ui/grid/data-loader'),
		UserModel		= require('module/data/UserModel'),
		GridModel		= require('module/ui/grid/grid-model'),
		RoleHelper		= require('module/helpers/role_helper');

/**
 * UsersActions
 *
 * @param {object} page
 *
 * */
const UsersActions = function(page){
	this.page = page;
	this.binding = page.getDefaultBinding();
	this.rootBinding = page.getMoreartyContext().getBinding();
	this.activeSchoolId = this.rootBinding.get('userRules.activeSchoolId');
	this.props = page.props;

	this.grid = this.getGrid();
	this.dataLoader = 	new DataLoader({
							serviceName:'users',
							dataModel: 	UserModel,
							params:		{schoolId:this.activeSchoolId},
							grid:		this.grid,
							onLoad: 	this.getDataLoadedHandle()
						});
};

UsersActions.prototype = {
	reloadData:function(){
		this.dataLoader.loadData();
	},
	_getActionList: function() {
		const self = this;

		if(typeof self.props.customActionList !== "undefined") {
			return self.props.customActionList.slice();
		} else {
			return typeof self.props.blockService !== "undefined" ? ['View','Block','Unblock','Add Role','Revoke All Roles']
				: ['View','Add Role','Revoke All Roles'];
		}
	},
	getActions:function(item){
		var self 			= this,
			activeSchoolId 	= self.activeSchoolId,
			actionList 		= self._getActionList();

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
	},
	_getQuickEditActionsFactory:function(itemId,action){
		const 	self = this,
			binding = self.binding,
			data = binding.sub('data'),
			idAutoComplete = [],
			ationKey = action.key ? action.key : action;
		const user = data.get().find(function(item){
			return item.id === itemId;
		});
		idAutoComplete.push(user.id);
		switch (ationKey){
			case 'Add Role':
				binding.atomically()
					.set('groupIds',idAutoComplete)
					.set('popup',true)
					.commit();
				break;
			case 'Revoke All Roles':
				self._revokeAllRoles(idAutoComplete);
				break;
			case 'Unblock':
				self._accessRestriction(idAutoComplete,false);
				break;
			case 'Block':
				self._accessRestriction(idAutoComplete,true);
				break;
			case 'View':
				self._getItemViewFunction(idAutoComplete);
				break;
			case 'revoke':
				self._revokeRole(idAutoComplete, action);
				break;
			default :
				break;
		}
	},
	_getItemViewFunction:function(model){
		if(model.length === 1) {
			window.location.hash = 'user/view?id='+model[0];
		} else {
			window.simpleAlert(
				"You can only perform this action on one Item.",
				'Ok',
				() => {}
			);
		}
	},
	_revokeAllRoles:function(ids){
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
					ids.forEach(function(userId){
						const params = {userId:userId, schoolId:schoolId};

						permissionList.get(params)
							.then(function(data){
								data.forEach(function(p){
									if(p.preset !== 'STUDENT'){
										params.permissionId = p.id;
										permission.delete(params).then(_ => self.reloadData());
									}
								});
							});
					});
				},
				() => {}
			);
		}
	},
	_revokeRole:function(ids, action){
		const   self            = this,
				schoolId  		= self.activeSchoolId,
				permission 		= window.Server[self.props.permissionServiceName];

		if(ids && ids.length > 0 ) {
			window.confirmAlert(
				`Are you sure you want ${action.text}?`,
				"Ok",
				"Cancel",
				() => {
					ids.forEach(function(userId){
						const params = {userId:userId, schoolId:schoolId, permissionId:action.id};

						permission.delete(params).then(() => {
							self.reloadData();
						});
					});
				},
				() => {}
			);
		}
	},
	_accessRestriction:function(ids,block){
		const self = this,
			blockStr = block ? 'block': 'unblock';

		if(ids !== undefined && ids.length >=1){
			if(confirm(`Are you sure you want ${blockStr} user?`)){
				ids.forEach(function(id){
					self.props.blockService.post(id,{blocked: block }).then(function(){
						self.reloadData();
					});
				});
			}
		}else{
			window.simpleAlert(
				'Please select at least 1 row',
				'Ok',
				() => {}
			);
		}
	},
	getRoleList:function(){
		const roles = [];

		Object.keys(RoleHelper.USER_PERMISSIONS).forEach(key => {
			roles.push({
				key: key,
				value: RoleHelper.USER_PERMISSIONS[key].toLowerCase()
			});
		});

		return roles;
	},
	getGenders:function(){
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
	},
	getGrid: function(){
		let columns = [
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
						actionHandler:this._getQuickEditActionsFactory.bind(this)
					}
				}
			}
		];

		if(this.props.blockService){
			columns.splice(5,0,
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
							getDataPromise: window.Server.publicSchools.get({filter:{limit:1000,order:"name ASC"}}),
							valueField:'name',
							keyField:'id'
						}
					}
				}
			);
		}

		return new GridModel({
			actionPanel:{
				title:'Users & Permissions',
				showStrip:true,
				btnAdd:this.props.addButton
			},
			columns:columns,
			handleClick: this.props.handleClick,
			filters:{limit:20}
		});
	},
	getDataLoadedHandle: function(data){
		const self = this,
			binding = self.page.getDefaultBinding();

		return function(data){
			binding.set('data', self.grid.table.data);
		};
	}
};


module.exports = UsersActions;
