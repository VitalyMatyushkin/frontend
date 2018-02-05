/**
 * Created by Anatoly on 09.09.2016.
 */

const 	{DataLoader}        = require('module/ui/grid/data-loader'),
		React 			    = require('react'),
		Morearty 		    = require('morearty'),
		Lazy 			    = require('lazy.js'),
		{GridModel}		    = require('module/ui/grid/grid-model'),
		RoleHelper 		    = require('module/helpers/role_helper'),
		SessionHelper 	    = require('module/helpers/session_helper'),
		{ConfirmMessage}    = require('module/as_admin/pages/admin_schools/new_user_requests/confirm_message'),
		propz 			    = require('propz');

/**
 * RequestActions
 *
 * @param {object} page
 *
 * */
class RequestActionsClass {
	constructor(page){
		this.getDefaultBinding = page.getDefaultBinding;		// TODO: are you sure this is really good to miss original 'this'?
		this.getMoreartyContext = page.getMoreartyContext;		// TODO: are you sure this is really good to miss original 'this'?
		this.props = page.props;
		this.state = page.state;
		
		this.rootBinding = this.getMoreartyContext().getBinding();
		this.activeSchoolId = this.rootBinding.get('userRules.activeSchoolId');
		
		// getting viewer role, because MANAGER will not obtain ADMIN's requests
		this.viewerRole	= SessionHelper.getRoleFromSession(this.getMoreartyContext().getBinding().sub('userData'));
		
		this.updateSubMenu();
		this.getSchools();
		
		this.setColumns();
	}
	reloadData(){
		this.dataLoader.loadData();
	}
	getRoleList(){
		const roles = [];
		
		Object.keys(RoleHelper.USER_PERMISSIONS)
		.filter( key => !(this.viewerRole === 'MANAGER' && key === 'ADMIN')) 		// MANAGER cannot use ADMIN filter
		.forEach(key => {
			roles.push({
				key: key,
				value: RoleHelper.USER_PERMISSIONS[key].toLowerCase()
			});
		});
		
		return roles;
	}
	getSchools(){
		const 	self 	= this,
			binding = self.getDefaultBinding();
		
		window.Server.publicSchools.get({filter:{limit:10000,order:"name ASC"}}).then(schools => {
			binding.set('schools', schools);
		});
	}
	getSchoolEmblem(item){
		const pic = propz.get(item, ["requestedPermission", "school", "pic"]);
		
		if(typeof pic !== 'undefined'){
			return (
				<img
					src={window.Server.images.getResizedToBoxUrl(pic, 60, 60)}
				/>
			);
		}
	}
	getSchoolName(item){
		const schoolName = propz.get(item, ["requestedPermission", "school", "name"]);
		
		if(typeof schoolName !== 'undefined'){
			return schoolName;
		}
	}
	
	updateSubMenu(){
		this.rootBinding.set('submenuNeedsUpdate', !this.rootBinding.get('submenuNeedsUpdate'));
	}
	refresh(){
		this.updateSubMenu();
		this.reloadData();
	}
	getCurrentPermission(id, permissions) {
		return Lazy(permissions).find(permission => permission.id && permission.id === id);
	}
	getConfirmMessage(email, phone) {
		return <ConfirmMessage email = {email} phone = {phone}/>;
	}
	getActions(item){
		let actionList;

		if (item.requestedPermission.preset === "STUDENT") {
			actionList = ['Accept and merge', 'Decline', 'Accept as a new (inactive)'];
		} else {
			actionList = ['Accept', 'Decline'];
		}
		
		return actionList;
	}
	_getQuickEditActionFunctions(itemId, action) {
		// TODO Temporary solution for refactoring time
		if(typeof this.props.handleAction !== 'undefined') {
			this.props.handleAction(itemId, action).then(() => {
				this.refresh();
			});
		} else {
			const 	prId 		= itemId,
					binding 	= this.getDefaultBinding().sub('data'),
					currentPr 	= this.getCurrentPermission(prId, binding.toJS()),
					schoolId 	= currentPr ? currentPr.requestedPermission.schoolId : '',
					email 		= currentPr.requester.email,
					phone 		= currentPr.requester.phone;

			switch (action){
				case 'Accept':
					window.confirmAlert(
						this.getConfirmMessage(email, phone),
						"Ok",
						"Cancel",
						() => {
							if (currentPr.requestedPermission.preset === "PARENT") {
								document.location.hash = `${document.location.hash}/accept?prId=${prId}&schoolId=${schoolId}`
							} else if(currentPr.requestedPermission.preset === "STUDENT") {
								document.location.hash = `${document.location.hash}/accept-student?prId=${prId}&schoolId=${schoolId}`
							} else {
								// This component used on manager side and on admin side.
								// For manager and for admin we have different service lists, with different routes, but with same route names.
								// For admin we have statusPermissionRequest route with url - /superadmin/users/permissions/requests/{prId}/status
								// For manager we have statusPermissionRequest route with url - /i/schools/{schoolId}/permissions/requests/{prId}/status
								// So, for manager schoolId is required, for admin isn't required.
								window.Server.statusPermissionRequest.put(
									{schoolId: schoolId, prId: prId},
									{status: 'ACCEPTED'}
									)
									.then(() => this.refresh());
							}
						},
						() => {}
					);
					break;
				case 'Decline':
					window.confirmAlert(
						"Are you sure you want to decline?",
						"Ok",
						"Cancel",
						() => {
							// Pls look up at previous comment
							window.Server.statusPermissionRequest.put({schoolId:schoolId, prId:prId},{status:'REJECTED'})
								.then(_ => this.refresh());
						},
						() => {}
					);
					break;
				case 'Accept and merge':
					document.location.hash = `${document.location.hash}/merge-student?permissionId=${prId}&schoolId=${schoolId}`;
					break;
				default :
					break;
			}
		}
	}
	setColumns(){
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
				text:'Phone',
				isSorted:false,
				cell:{
					dataField:'requester.phone'
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
				text:'Promo',
				isSorted:false,
				cell:{
					dataField:'promo'
				}
			},
			{
				text:'Actions',
				cell:{
					type:'action-list',
					typeOptions:{
						getActionList:	this.getActions.bind(this),
						actionHandler:	this._getQuickEditActionFunctions.bind(this)
					}
				}
			}
		];
	}
	
	createGrid(){
		const classStyleAdmin = typeof this.viewerRole === 'undefined';
		
		let defaultFilter = {
			where: {
				status: 'NEW'
			},
			limit: 20
		};
		
		this.grid = new GridModel({
			actionPanel:{
				title: 'New Requests',
				showStrip: true
			},
			columns: this.columns,
			filters: defaultFilter,
			classStyleAdmin: classStyleAdmin
		});
		
		this.dataLoader = 	new DataLoader({
			serviceName:'permissionRequests',
			params:		{ schoolId: this.activeSchoolId },
			grid:		this.grid,
			onLoad: 	this.getDataLoadedHandle()
		});
		
		return this;
	}
	createGridFromExistingData(grid){
		const classStyleAdmin = typeof this.viewerRole === 'undefined';
		this.grid = new GridModel({
			actionPanel:{
				title: 'New Requests',
				showStrip: true
			},
			columns: this.columns,
			filters: {
				where: grid.filter.where,
				order: grid.filter.order
			},
			badges: grid.filterPanel.badgeArea,
			classStyleAdmin: classStyleAdmin
		});
		
		this.dataLoader = 	new DataLoader({
			serviceName:'permissionRequests',
			params:		{ schoolId: this.activeSchoolId },
			grid:		this.grid,
			onLoad: 	this.getDataLoadedHandle()
		});
		
		return this;
	}
	getDataLoadedHandle(data){
		const binding = this.getDefaultBinding();

		return function(data){
			binding.set('data', this.grid.table.data);
		};
	}
}

module.exports = RequestActionsClass;
