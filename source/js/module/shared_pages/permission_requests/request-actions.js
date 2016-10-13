/**
 * Created by Anatoly on 09.09.2016.
 */

const 	DataLoader 		= require('module/ui/grid/data-loader'),
		React 			= require('react'),
		Morearty		= require('morearty'),
		Lazy            = require('lazy.js'),
		GridModel 		= require('module/ui/grid/grid-model'),
		RoleHelper 		= require('module/helpers/role_helper');

/**
 * RequestActions
 *
 * @param {object} page
 *
 * */
const RequestActions = function(page){
	this.getDefaultBinding = page.getDefaultBinding;		// TODO: are you sure this is really good to miss original 'this'?
	this.getMoreartyContext = page.getMoreartyContext;		// TODO: are you sure this is really good to miss original 'this'?
	this.props = page.props;
	this.state = page.state;

	this.rootBinding = this.getMoreartyContext().getBinding();
	this.activeSchoolId = this.rootBinding.get('userRules.activeSchoolId');

	// getting viewer role, because MANAGER will not obtain ADMIN's requests
	this.viewerRole	= this.getMoreartyContext().getBinding().get('userData.authorizationInfo.role');

	this.updateSubMenu();
	this.getSchools();

	this.setColumns();
};

RequestActions.prototype = {
	reloadData:function(){
		this.dataLoader.loadData();
	},
	getRoleList:function(){
		const roles = [];

		Object.keys(RoleHelper.ALLOWED_PERMISSION_PRESETS)
			.filter( key => !(this.viewerRole === 'MANAGER' && key === 'ADMIN')) 		// MANAGER cannot use ADMIN filter
			.forEach(key => {
			roles.push({
				key: key,
				value: RoleHelper.ALLOWED_PERMISSION_PRESETS[key].toLowerCase()
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
	getSchoolEmblem:function(item){
		const 	self = this,
				binding = self.getDefaultBinding(),
				schools = binding.get('schools'),
				school = schools && item.requestedPermission ? schools.find(s => s.id === item.requestedPermission.schoolId) : null;

		if(school && school.pic){
			return <img src={window.Server.images.getResizedToBoxUrl(school.pic, 60, 60)}/>;
		}
	},
	getSchoolName:function(item){
		const self = this,
			binding = self.getDefaultBinding(),
			schools = binding.get('schools'),
			school = schools && item.requestedPermission ? schools.find(s => s.id === item.requestedPermission.schoolId) : null;

		if(school){
			return school.name;
		}
	},
	updateSubMenu:function(){
		this.rootBinding.set('submenuNeedsUpdate', !this.rootBinding.get('submenuNeedsUpdate'));
	},
	refresh:function(){
		this.updateSubMenu();
		this.reloadData();
	},
	getCurrentPermission: function(id, permissions) {
		return Lazy(permissions).find(permission => permission.id && permission.id === id);
	},
	_getQuickEditActionFunctions:function(itemId,action){
		const   self      = this,
				prId      = itemId,
				binding   = self.getDefaultBinding().sub('data'),
				currentPr = self.getCurrentPermission(prId, binding.toJS()),
				schoolId  = currentPr.requestedPermission.schoolId;
		let confirmMsg;
		switch (action){
			case 'Accept':
				if(currentPr.requestedPermission.preset === "PARENT") {
					document.location.hash = `${document.location.hash}/accept?prId=${prId}&schoolId=${schoolId}`;
				} else {
					window.confirmAlert(
						"Are you sure you want to accept?",
						"Ok",
						"Cancel",
						() => {
							// This component used on manager side and on admin side.
							// For manager and for admin we have different service lists, with different routes, but with same route names.
							// For admin we have statusPermissionRequest route with url - /superadmin/users/permissions/requests/{prId}/status
							// For manager we have statusPermissionRequest route with url - /i/schools/{schoolId}/permissions/requests/{prId}/status
							// So, for manager schoolId is required, for admin isn't required.
							window.Server.statusPermissionRequest.put( {schoolId:schoolId, prId:prId},{status:'ACCEPTED'} )
								.then(_ => self.refresh());
						},
						() => {}
					);
				}
				break;
			case 'Decline':
				window.confirmAlert(
					"Are you sure you want to decline?",
					"Ok",
					"Cancel",
					() => {
						// Pls look up at previous comment
						window.Server.statusPermissionRequest.put({schoolId:schoolId, prId:prId},{status:'REJECTED'})
							.then(_ => self.refresh());
					},
					() => {}
				);
				break;
			default :
				break;
		}
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
				cell:{
					type:'custom',
					typeOptions:{
						parseFunction:this.getSchoolEmblem.bind(this)
					}
				}
			},
			{
				text:'School',
				cell:{
					type:'custom',
					typeOptions:{
						parseFunction:this.getSchoolName.bind(this)
					}
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
				text:'Role',
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
				text:'Actions',
				cell:{
					type:'action-list',
					typeOptions:{
						getActionList:() => {return ['Accept','Decline']},
						actionHandler:this._getQuickEditActionFunctions.bind(this)
					}
				}
			}
		];
	},
	init: function(){

		let defaultFilter = {
			where: {
				status: 'NEW'
			},
			limit: 20
		};

		if(this.viewerRole === 'MANAGER') {
			defaultFilter.where['requestedPermission.preset'] = { $ne: 'ADMIN'};
		}

		this.grid = new GridModel({
			actionPanel:{
				title: 'New Requests',
				showStrip: true
			},
			columns: this.columns,
			filters: defaultFilter
		});

		this.dataLoader = 	new DataLoader({
			serviceName:'permissionRequests',
			params:		{ schoolId: this.activeSchoolId },
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


module.exports = RequestActions;
