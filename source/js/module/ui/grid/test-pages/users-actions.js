/**
 * Created by Anatoly on 25.07.2016.
 */

const 	DataLoader = require('module/ui/grid/data-loader'),
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
				cell:{
					dataField:'firstName'
				}
			},
			{
				text:'Surname',
				cell:{
					dataField:'lastName'
				}
			},
			{
				text:'Email',
				cell:{
					dataField:'email'
				}
			}
		];

		return new GridModel({
			columns:columns
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
