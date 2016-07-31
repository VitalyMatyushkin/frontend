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
 * GridModel
 *
 * @param {object} page
 *
 * */
const UsersActions = function(page){
	this.page = page;
	this.binding = page.getDefaultBinding();
	this.rootBinding = page.getMoreartyContext().getBinding();
	this.activeSchoolId = this.rootBinding.get('userRules.activeSchoolId');
	this.grid = this.getGrid();
	this.dataLoader = new DataLoader({
		serviceName:'users',
		dataModel: 	UserModel,
		params:		{schoolId:this.activeSchoolId},
		filter: 	this.grid.filter,
		onLoad: 	this.getDataLoadedHandle()
	});
};

UsersActions.prototype = {
	getActions:function(item){
		var self 			= this,
			binding 		= self.binding,
			activeSchoolId 	= self.activeSchoolId,
			actionList 		= ['View','Add Role','Revoke All Roles'];

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
			//case 'Add Role':
			//	binding.atomically()
			//		.set('groupIds',idAutoComplete)
			//		.set('popup',true)
			//		.commit();
			//	break;
			//case 'Revoke All Roles':
			//	self._revokeAllRoles(idAutoComplete);
			//	break;
			//case 'Unblock':
			//	self._accessRestriction(idAutoComplete,false);
			//	break;
			//case 'Block':
			//	self._accessRestriction(idAutoComplete,true);
			//	break;
			case 'View':
				self._getItemViewFunction(idAutoComplete);
				break;
			//case 'revoke':
			//	self._revokeRole(idAutoComplete, action);
			//	break;
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
				text:'School',
				cell:{
					dataField:'school'
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
			table:{
				columns:columns
			},
			filters:{limit:20}
		});
	},
	getDataLoadedHandle: function(data){
		const self = this,
			binding = self.page.getDefaultBinding();

		return function(data){
			self.grid.setData(data);
			binding.set('data', self.grid.table.data);
		};
	}
};


module.exports = UsersActions;
