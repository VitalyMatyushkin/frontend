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
	const   globalBinding   = page.getMoreartyContext().getBinding(),
			activeSchoolId  = globalBinding.get('userRules.activeSchoolId');

	this.page = page;
	this.grid = this.getGrid();
	this.dataLoader = new DataLoader({
		serviceName:'users',
		dataModel: 	UserModel,
		params:		{schoolId:activeSchoolId},
		filter: 	this.grid.filter,
		onLoad: 	this.getDataLoadedHandle()
	});
};

UsersActions.prototype = {
	getActions:function(item){
		var self 			= this,
			binding 		= self.page.getDefaultBinding(),
			rootBinding 	= self.page.getMoreartyContext().getBinding(),
			activeSchoolId 	= rootBinding.get('userRules.activeSchoolId'),
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
						   listItemFunction={null}/>
		);

	},
	getGrid: function(){
		const columns = [
			{
				text:'Name',
				isSorted:true,
				cell:{
					dataField:'firstName'
				}
			},
			{
				text:'Surname',
				isSorted:true,
				cell:{
					dataField:'lastName'
				}
			},
			{
				text:'Email',
				isSorted:true,
				cell:{
					dataField:'email'
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
			self.grid.table.data = data;
			binding.set('data', data);
		};
	}
};


module.exports = UsersActions;
