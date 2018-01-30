/**
 * Created by Anatoly on 14.09.2016.
 */

const 	{DataLoader} 	= require('module/ui/grid/data-loader'),
		React 			= require('react'),
		Morearty		= require('morearty'),
		{SVG} 			= require('module/ui/svg'),
		{GridModel}		= require('module/ui/grid/grid-model'),
		SessionHelper	= require('module/helpers/session_helper'),
		RoleHelper 		= require('module/helpers/role_helper');

/**
 * RequestListModel
 *
 * @param {object} page
 *
 * */
const RequestListModel = function(page){
	this.getDefaultBinding = page.getDefaultBinding;
	this.getMoreartyContext = page.getMoreartyContext;
	this.props = page.props;
	this.state = page.state;

	this.rootBinding = this.getMoreartyContext().getBinding();
	this.activeSchoolId = this.rootBinding.get('userRules.activeSchoolId');
	this.getSchools();
	this.setAddButton();
	this.setColumns();
};

RequestListModel.prototype = {
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
	getStatusList:function(){
		const result = [];

		['NEW','ACCEPTED', 'REJECTED'].forEach(key => {
			result.push({
				key: key,
				value: key.toLowerCase()
			});
		});

		return result;
	},
	getSchools:function(){
		const 	self 	= this,
			binding = self.getDefaultBinding();

		window.Server.publicSchools.get({filter:{limit:1000,order:"name ASC"}}).then(schools => {
			binding.set('schools', schools);
		});
	},
    getSportsName:function(item){
		const sports = item.sports;
		return sports.map(sport => sport.name).join(", ");
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
				text:'Status',
				isSorted:true,
				cell:{
					dataField:'status',
					type:'custom',
					typeOptions:{
						parseFunction:this.getStatus.bind(this)
					}
				},
				filter:{
					type:'multi-select',
					typeOptions:{
						items: this.getStatusList(),
						hideFilter:true
					}
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
	},
	init: function(){
		this.grid = new GridModel({
			actionPanel:{
				title:'Profile Requests',
				showStrip:true,
				hideBtnFilter:true, 	//hide the filter button, because on the server for profileRequests does not include filters.
				btnAdd:this.btnAdd
			},
			columns:this.columns,
			filters:{where:{status:{$ne:'NEW'}},limit:20}
		});

		this.dataLoader = 	new DataLoader({
			serviceName:'profileRequests',
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
			const resultData = self.grid.table.data.map(r => {
				r.status = r.status === 'NEW' ? 'PENDING' : r.status;
				return r;
			});
			binding.set('data', resultData);
		};
	},
	setAddButton: function() {
		const verified = SessionHelper.getActiveSession(
			this.rootBinding.sub('userData')
		).verified;
		const changeAllowed = verified && verified.email && verified.sms;

		/** Only verified users can add new requests. All other users should not see that button.*/
		this.btnAdd = changeAllowed ?
			(
				<span onClick={this.handleAddNewButtonClick.bind(this)} className="addButtonShort">
					<SVG icon="icon_add_form"/>
				</span>
		) :
		null
	},
	getStatus:function(item){
		const status = item.status;
		return <span className={'request-'+status.toLowerCase()}>{status}</span>;
	},
	getActions:function(request){
		const self = this;

		if(request.status === 'NEW' || request.status === 'PENDING'){
			return (
				<span title="Cancel Request" className="requestActions" onClick={self._cancelRequest.bind(this,request)}>Cancel</span>
			);
		}
	},
	_cancelRequest:function(request){
		const self = this;

		window.confirmAlert(
			'Are you sure you want to cancel pending request?',
			"Ok",
			"Cancel",
			() => window.Server.profileRequest.delete(request.id).then(res => self.reloadData()),
			() => {}
		);
	},
	handleAddNewButtonClick:function(){
		const binding = this.getDefaultBinding();

		binding.set('popup',true);
	},
	_closePopup:function(){
		var self = this,
			binding = self.getDefaultBinding();
		binding.set('popup',false);
	},
	_onSuccess:function(){
		this._closePopup();
		this.reloadData();
		window.simpleAlert(
			'You just requested new role. Approving will take some time. We will send you email notification',
			'Ok',
			() => {
			});

	}

};


module.exports = RequestListModel;
