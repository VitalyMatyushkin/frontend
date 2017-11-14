/**
 * Created by Anatoly on 09.09.2016.
 */

const 	DataLoader 		= require('module/ui/grid/data-loader'),
		React 			= require('react'),
		Morearty		= require('morearty'),
		Lazy 			= require('lazy.js'),
		GridModel 		= require('module/ui/grid/grid-model'),
		SessionHelper	= require('module/helpers/session_helper'),
		RoleHelper 		= require('module/helpers/role_helper');

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
		
		this.setColumns();
	}
	
	reloadData() {
		this.dataLoader.loadData();
	}
	
	getRoleList() {
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
	
	updateSubMenu() {
		this.rootBinding.set('submenuNeedsUpdate', !this.rootBinding.get('submenuNeedsUpdate'));
	}
	
	refresh() {
		this.updateSubMenu();
		this.reloadData();
	}
	
	getCurrentPermission(id, permissions) {
		return Lazy(permissions).find(permission => permission.id && permission.id === id);
	}
	
	getConfirmMessage(email, phone) {
		return (
			<div>
				<h2> Please Read Carefully! </h2>
				
				<p className="eSimpleAlert_text">We use reasonable measures to check the identity of each User
					registering with Squad In Touch. We require
					that each User provides a valid mobile phone number and email address so we check their validity via
					confirmation codes.</p>
				
				<p className="eSimpleAlert_text">The Mobile phone and email address the User has verified is as
					follows:
					<p className="eSimpleAlert_mail">{email}</p>
					<p className="eSimpleAlert_phone">{phone}</p>
				</p>
				
				<p className="eSimpleAlert_text">Notwithstanding mobile phone and email address verification, it is the
					responsibility of the School to
					satisfy that the User’s identity has been verified prior to accepting a role request.
					If you are not completely satisfied the User is genuine, please complete additional checks before
					granting
					them any permissions in the system or simply decline a role request.</p>
			</div>
		);
	}
	
	getActions(item){
		let actionList;
		//now we don't hide merge students (it available also by superadmin)
		if (item.requestedPermission.preset === "STUDENT") {
			actionList = ['Accept and merge', 'Decline', 'Accept as a new (inactive)'];
		} else {
			actionList = ['Accept', 'Decline'];
		}
		
		return actionList;
	}
	
	_getQuickEditActionFunctions(itemId, action) {
		const 	self 		= this,
				prId 		= itemId,
				binding 	= self.getDefaultBinding().sub('data'),
				currentPr 	= self.getCurrentPermission(prId, binding.toJS()),
				schoolId 	= currentPr.requestedPermission.schoolId,
				email 		= currentPr.requester.email,
				phone 		= currentPr.requester.phone,
				studentId 	= currentPr.requesterId;

		let confirmMsg;
		
		switch (true){
			case action === 'Accept':
				window.confirmAlert(
					self.getConfirmMessage(email, phone),
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
							window.Server.statusPermissionRequest.put({schoolId: schoolId, prId: prId}, {status: 'ACCEPTED'})
							.then(_ => self.refresh());
						}
					},
					() => {}
				);
				break;
			case action === 'Decline':
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
			case action === 'Accept and merge':
				document.location.hash = `${document.location.hash}/merge-student?permissionId=${prId}&schoolId=${schoolId}`;
				break;
			default:
				break;
		}
	}

	getSportsName(item){
		const sports = item.sports;
		return sports.map(sport => sport.name).join(", ");
	}

	setColumns() {
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
				text:'Sports',
				cell:{
					dataField:'sports',
					type:'custom',
					typeOptions:{
						parseFunction:this.getSportsName.bind(this)
					}
				}
			},
			{
				text:'Actions',
				cell:{
					type:'action-list',
					typeOptions:{
						getActionList: this.getActions.bind(this),
						actionHandler: this._getQuickEditActionFunctions.bind(this)
					}
				}
			}
		];
	}
	
	createGrid() {
		const classStyleAdmin = typeof this.viewerRole === 'undefined';
		
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
	
	createGridFromExistingData(grid) {
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
	
	getDataLoadedHandle(data) {
		const self = this,
			binding = self.getDefaultBinding();
		
		return function(data){
			binding.set('data', self.grid.table.data);
		};
	}
}

module.exports = RequestActionsClass;
