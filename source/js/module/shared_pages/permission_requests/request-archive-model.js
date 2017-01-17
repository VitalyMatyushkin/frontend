/**
 * Created by Anatoly on 13.09.2016.
 */

const 	DataLoader 		= require('module/ui/grid/data-loader'),
		React 			= require('react'),
		Morearty		= require('morearty'),
		GridModel 		= require('module/ui/grid/grid-model'),
		RoleHelper 		= require('module/helpers/role_helper');

/**
 * RequestArchiveModel
 *
 * @param {object} page
 *
 * */
const RequestArchiveModel = function(page){
	this.getDefaultBinding = page.getDefaultBinding;
	this.getMoreartyContext = page.getMoreartyContext;
	this.props = page.props;
	this.state = page.state;

	this.rootBinding = this.getMoreartyContext().getBinding();
	this.activeSchoolId = this.rootBinding.get('userRules.activeSchoolId');

	this.setColumns();
};

RequestArchiveModel.prototype = {
	reloadData:function(){
		this.dataLoader.loadData();
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
	getSchools:function(){
		const 	self 	= this,
			binding = self.getDefaultBinding();

		window.Server.publicSchools.get({filter:{limit:1000,order:"name ASC"}}).then(schools => {
			binding.set('schools', schools);
		});
	},
	setColumns: function(){
		this.columns = [
			{
				text:'Date',
				isSorted:true,
				cell:{
					dataField:'createdAt',
					type:'date'
				},
				filter:{
					type:'between-date'
				}
			},
			{
				text:'Request',
				isSorted:true,
				cell:{
					dataField:'requestedPermission.preset'
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
				text:'Name',
				isSorted:true,
				cell:{
					dataField:'requester.firstName'
				},
				filter:{
					type:'string'
				}
			},
			{
				text:'Surname',
				isSorted:true,
				cell:{
					dataField:'requester.lastName'
				},
				filter:{
					type:'string'
				}
			},
			{
				text:'Email',
				isSorted:true,
				cell:{
					dataField:'requester.email',
					type:'email'
				},
				filter:{
					type:'string'
				}
			},
			{
				text:'School',
				cell:{
					dataField:'requestedPermission.school.name'
				}
			},
			{
				text:'School',
				hidden:true,
				cell:{
					dataField:'requestedPermission.schoolId'
				},
				filter:{
					type:'multi-select',
					typeOptions:{
						getDataPromise: window.Server.publicSchools.get({filter:{limit:1000,order:"name ASC"}}),
						valueField:'name',
						keyField:'id'
					}
				}
			},
			{
				text:'Details',
				isSorted:true,
				cell:{
					dataField:'requestedPermission.comment'
				},
				filter:{
					type:'string'
				}
			},
			{
				text:'Response',
				isSorted:true,
				cell:{
					dataField:'status'
				}
			}
		];
	},
	init: function(){
		this.grid = new GridModel({
			actionPanel:{
				title:'Requests archive',
				showStrip:true
			},
			columns:this.columns,
			filters:{where:{status:{$ne:'NEW'}},limit:20}
		});

		this.dataLoader = 	new DataLoader({
			serviceName:'permissionRequests',
			params:		{schoolId:this.activeSchoolId},
			grid:		this.grid,
			onLoad: 	this.getDataLoadedHandle()
		});

		return this;
	},
	getDataLoadedHandle: function(data){
		const self = this,
			binding = self.getDefaultBinding();

		return function(data){
			binding.set('data', self.grid.table.data);
		};
	}
};


module.exports = RequestArchiveModel;
