/**
 * Created by Anatoly on 25.07.2016.
 */

const 	DataLoader = require('module/ui/grid/data-loader'),
	UserModel 		= require('module/data/UserModel'),
	GridModel = require('module/ui/grid/grid-model');

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
