/**
 * Created by Anatoly on 25.07.2016.
 */

const 	DataLoader 		= require('module/ui/grid/data-loader'),
		UserModel 		= require('module/data/UserModel'),
		React 			= require('react'),
		Morearty		= require('morearty'),
		AdminDropList   = require('module/ui/admin_dropList/admin_dropList'),
		GridModel 		= require('module/ui/grid/grid-model');

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
	getActions:function(item){
		var self 			= this,
			binding 		= self.binding,
			activeSchoolId 	= self.activeSchoolId,
			actionList 		= self.props.blockService ? ['View','Block','Unblock','Add Role','Revoke All Roles']
														: ['View','Add Role','Revoke All Roles'];

		item.permissions.filter(p=> p.preset != 'STUDENT').forEach(p => {
			let action = 'Revoke the role ';
			if(p.preset === 'PARENT'){
				action += `of ${p.student.firstName} parent`;
			}
			else{
				action += p.preset;

				if(!activeSchoolId){
					action +=' for ' + p.school.name;
				}
			}

			actionList.push({
				text: action,
				key: 'revoke',
				id: p.id
			});
		});
		return (
			<AdminDropList key={item.id}
						   binding={binding.sub('dropList'+item.id)}
						   itemId={item.id}
						   listItems={actionList}
						   listItemFunction={self._getQuickEditActionsFactory.bind(this)}/>
		);

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
		if(model.length === 1){
			window.location.hash = 'user/view?id='+model[0];
		}else{
			alert("You can only perform this action on one Item");
		}
	},
	_revokeAllRoles:function(ids){
		const   self            = this,
				schoolId  		= self.activeSchoolId,
				permission 		= window.Server[self.props.permissionServiceName],
				permissionList 	= window.Server[`${self.props.permissionServiceName}s`],
				confirmAction 	= window.confirm("Are you sure you want revoke all roles?");

		if(ids && ids.length > 0 ){
			if(confirmAction){
				ids.forEach(function(userId){
					const params = {userId:userId, schoolId:schoolId};

					permissionList.get(params)
						.then(function(data){
							data.forEach(function(p){
								if(p.preset !== 'STUDENT'){
									params.permissionId = p.id;
									permission.delete(params).then(_ => {
										self.reloadData();
									});
								}
							});
						});
				});
			}
		}
	},
	_revokeRole:function(ids, action){
		const   self            = this,
				schoolId  		= self.activeSchoolId,
				permission 		= window.Server[self.props.permissionServiceName];

		if(ids && ids.length > 0 ){
			if(window.confirm(`Are you sure you want ${action.text}?`)){
				ids.forEach(function(userId){
					const params = {userId:userId, schoolId:schoolId, permissionId:action.id};

					permission.delete(params).then(_ => {
						self.reloadData();
					});
				});
			}
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
			alert('Please select at least 1 row');
		}
	},
	getGrid: function(){
		const columns = [
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
				cell:{
					dataField:'email'
				},
				filter:{
					type:'string'
				}
			},
			{
				text:'Birthday',
				isSorted:true,
				cell:{
					dataField:'birthday'
				},
				filter:{
					type:'between-date'
				}
			},
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
						getDataPromise: window.Server.publicSchools.get(),
						valueField:'name',
						keyField:'id'
					}
				}
			},
			{
				text:'Role',
				cell:{
					dataField:'roles'
				}
			},
			{
				text:'Access',
				cell:{
					dataField:'blocked'
				}
			},
			{
				text:'Actions',
				cell:{
					type:'custom',
					typeOptions:{
						parseFunction:this.getActions.bind(this)
					}
				}
			}
		];

		return new GridModel({
			actionPanel:{
				title:'Users & Permissions',
				showStrip:true
			},
			columns:columns,
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
